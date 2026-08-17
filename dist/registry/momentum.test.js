import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyMomentum, mergeViews } from "./momentum.js";
import { buildSnapshot, diffSnapshots, hashEntries, renderChangelog, } from "./snapshot.js";
const rel = {
    score: 80,
    verdict: "include",
    signals: [],
    primaryDomain: "visual",
    domains: [],
};
function entry(id, installs, state = "steady") {
    return {
        id,
        slug: id.split("/").at(-1),
        name: id.split("/").at(-1),
        source: id.split("/").slice(0, 2).join("/"),
        url: `https://www.skills.sh/${id}`,
        installs,
        allTimeRank: 1,
        trendingRank: null,
        hotRank: null,
        relevance: rel,
        momentum: {
            state: state,
            score: 40,
            delta: null,
            growthPct: null,
            signals: [],
        },
    };
}
// --- momentum ---
test("hot view is ignored below the noise floor", () => {
    // Observed on the real hot board: entries sitting at "1 install, +1 change".
    // A single install must not qualify as hot.
    const noise = classifyMomentum({
        installs: 5000,
        allTimeRank: 400,
        trendingRank: null,
        trendingInstalls: null,
        hotRank: 42,
        hotChange: 1,
        previousInstalls: 5000,
        seenBefore: true,
    });
    assert.equal(noise.state, "steady", "1 install/hour is not hot");
    assert.ok(noise.signals.includes("hot:below-noise-floor"));
    const real = classifyMomentum({
        installs: 5000,
        allTimeRank: 400,
        trendingRank: null,
        trendingInstalls: null,
        hotRank: 1,
        hotChange: 68,
        previousInstalls: 5000,
        seenBefore: true,
    });
    assert.equal(real.state, "hot");
});
test("trending requires real 24h volume", () => {
    const weak = classifyMomentum({
        installs: 900,
        allTimeRank: 900,
        trendingRank: 300,
        trendingInstalls: 40,
        hotRank: null,
        hotChange: null,
        previousInstalls: 900,
        seenBefore: true,
    });
    assert.equal(weak.state, "steady", "40 installs/24h is not rising");
    const strong = classifyMomentum({
        installs: 20000,
        allTimeRank: 100,
        trendingRank: 5,
        trendingInstalls: 18200,
        hotRank: null,
        hotChange: null,
        previousInstalls: 20000,
        seenBefore: true,
    });
    assert.equal(strong.state, "rising");
});
test("unseen skills are new, not rising", () => {
    const result = classifyMomentum({
        installs: 100,
        allTimeRank: null,
        trendingRank: 12,
        trendingInstalls: 100,
        hotRank: null,
        hotChange: null,
        seenBefore: false,
    });
    assert.equal(result.state, "new");
});
test("growth adjusts score without changing state", () => {
    const base = {
        installs: 1000,
        allTimeRank: 50,
        trendingRank: null,
        trendingInstalls: null,
        hotRank: null,
        hotChange: null,
        seenBefore: true,
    };
    const grown = classifyMomentum({ ...base, previousInstalls: 700 });
    const flat = classifyMomentum({ ...base, previousInstalls: 1000 });
    assert.equal(grown.state, "steady", "growth alone must not promote to rising");
    assert.ok(grown.score > flat.score);
    assert.equal(grown.growthPct, 42.86);
});
test("merging views never overwrites cumulative installs with a windowed rate", () => {
    // The trap: trending reports 24h installs in the same `installs` field.
    const allTime = [
        { id: "a/b/x", slug: "x", name: "x", source: "a/b", installs: 770700, sourceType: "github", installUrl: null, url: "u" },
    ];
    const trending = [
        { id: "a/b/x", slug: "x", name: "x", source: "a/b", installs: 4100, sourceType: "github", installUrl: null, url: "u" },
    ];
    const merged = mergeViews(allTime, trending, []);
    assert.equal(merged.length, 1);
    assert.equal(merged[0].installs, 770700, "cumulative count must survive");
    assert.equal(merged[0].trendingInstalls, 4100, "24h rate stored separately");
    assert.equal(merged[0].allTimeRank, 1);
    assert.equal(merged[0].trendingRank, 1);
});
test("skills only in trending get null installs, not a fake count", () => {
    const trending = [
        { id: "new/repo/y", slug: "y", name: "y", source: "new/repo", installs: 3000, sourceType: "github", installUrl: null, url: "u" },
    ];
    const merged = mergeViews([], trending, []);
    assert.equal(merged[0].installs, 0, "unknown cumulative, not the 24h figure");
    assert.equal(merged[0].trendingInstalls, 3000);
    assert.equal(merged[0].allTimeRank, null);
});
// --- snapshot + diff ---
test("content hash ignores rank churn", () => {
    const a = entry("a/b/x", 100);
    const b = { ...entry("a/b/x", 100), allTimeRank: 999, trendingRank: 3 };
    assert.equal(hashEntries([a]), hashEntries([b]), "rank movement alone must not look like a content change");
});
test("content hash changes when installs change", () => {
    assert.notEqual(hashEntries([entry("a/b/x", 100)]), hashEntries([entry("a/b/x", 200)]));
});
test("versions increment within a day", () => {
    const s1 = buildSnapshot([], { sweepDepth: 100, existingVersions: [] });
    const day = s1.version.split(".")[0];
    const s2 = buildSnapshot([], { sweepDepth: 100, existingVersions: [s1.version] });
    assert.equal(s2.version, `${day}.2`);
});
test("diff detects added, removed and momentum changes", () => {
    const prev = {
        version: "2026-08-10.1",
        takenAt: "2026-08-10T06:00:00.000Z",
        registryTotal: 1000,
        sweepDepth: 5000,
        contentHash: "x",
        entries: [entry("a/b/keep", 100, "steady"), entry("a/b/gone", 50)],
    };
    const curr = {
        version: "2026-08-13.1",
        takenAt: "2026-08-13T06:00:00.000Z",
        registryTotal: 1100,
        sweepDepth: 5000,
        contentHash: "y",
        entries: [entry("a/b/keep", 400, "rising"), entry("a/b/fresh", 10)],
    };
    const diff = diffSnapshots(prev, curr);
    assert.deepEqual(diff.added.map((e) => e.slug), ["fresh"]);
    assert.deepEqual(diff.removed.map((e) => e.slug), ["gone"]);
    assert.equal(diff.momentumChanged.length, 1);
    assert.equal(diff.momentumChanged[0].was, "steady");
    assert.equal(diff.momentumChanged[0].now, "rising");
    assert.equal(diff.topGainers[0].delta, 300);
    assert.equal(diff.topGainers[0].growthPct, 300);
    assert.equal(diff.noop, false);
});
test("identical hashes produce a noop diff", () => {
    const entries = [entry("a/b/x", 100)];
    const snap = {
        version: "2026-08-13.1",
        takenAt: "t",
        registryTotal: null,
        sweepDepth: 5000,
        contentHash: hashEntries(entries),
        entries,
    };
    const same = { ...snap, version: "2026-08-16.1" };
    assert.equal(diffSnapshots(snap, same).noop, true);
});
test("first snapshot treats everything as added", () => {
    const snap = {
        version: "2026-08-13.1",
        takenAt: "t",
        registryTotal: null,
        sweepDepth: 5000,
        contentHash: "h",
        entries: [entry("a/b/x", 1), entry("a/b/y", 2)],
    };
    const diff = diffSnapshots(null, snap);
    assert.equal(diff.added.length, 2);
    assert.equal(diff.from, null);
});
test("changelog states that curation is not automatic", () => {
    const snap = {
        version: "2026-08-13.1",
        takenAt: "t",
        registryTotal: 1176382,
        sweepDepth: 5000,
        contentHash: "h",
        entries: [entry("a/b/x", 1)],
    };
    const body = renderChangelog(diffSnapshots(null, snap), snap);
    assert.match(body, /not\*\* automatic/);
    assert.match(body, /1,176,382/, "registry total should be reported");
});
//# sourceMappingURL=momentum.test.js.map