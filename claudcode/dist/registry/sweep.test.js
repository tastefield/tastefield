import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { SkillsClient } from "./client.js";
import { sweepAll, enrichCandidates, shardByTier, projectCost } from "./sweep.js";
function skill(id, name = id.split("/").at(-1), installs = 100) {
    return {
        id,
        slug: name,
        name,
        source: id.split("/").slice(0, 2).join("/"),
        installs,
        sourceType: "github",
        installUrl: null,
        url: `https://www.skills.sh/${id}`,
    };
}
function pagedClient(pages, total) {
    let call = 0;
    return new SkillsClient({
        getToken: () => "t",
        fetchImpl: (async () => {
            const data = pages[call] ?? [];
            const hasMore = call < pages.length - 1;
            call++;
            return new Response(JSON.stringify({
                data,
                pagination: { page: call - 1, perPage: 500, total, hasMore },
            }), { status: 200, headers: { "content-type": "application/json" } });
        }),
    });
}
test("cost projection matches the real registry size", () => {
    // 1,176,382 skills observed on the leaderboard, 2026-08-13.
    const cost = projectCost(1_176_382, 20_000);
    assert.equal(cost.sweepPages, 2353);
    assert.ok(cost.sweepMinutes < 5, `sweep should be minutes, got ${cost.sweepMinutes}`);
    assert.ok(cost.enrichMinutes > cost.sweepMinutes, "enrichment, not sweeping, is the expensive stage");
    assert.ok(cost.rawSizeMb > 200, "raw listing data is too big for one git file");
});
test("sweep paginates to completion and keeps only design candidates", async () => {
    const client = pagedClient([
        [skill("a/b/design-tokens"), skill("a/b/postgres-migrations")],
        [skill("c/d/ui-components"), skill("c/d/kubernetes-deploy")],
    ], 4);
    const result = await sweepAll({ client });
    assert.equal(result.stats.complete, true);
    assert.equal(result.stats.skillsSeen, 4);
    assert.deepEqual(result.candidates.map((c) => c.slug).sort(), ["design-tokens", "ui-components"]);
    assert.ok(result.stats.keepRate > 0 && result.stats.keepRate <= 100);
});
test("sweep skips duplicates and respects an install floor", async () => {
    const dup = { ...skill("x/y/design-system"), isDuplicate: true };
    const low = skill("x/y/design-tokens", "design-tokens", 3);
    const ok = skill("x/y/ui-kit", "ui-kit", 5000);
    const client = pagedClient([[dup, low, ok]], 3);
    const result = await sweepAll({ client, minInstalls: 100 });
    assert.deepEqual(result.candidates.map((c) => c.slug), ["ui-kit"]);
});
test("sweep checkpoints and resumes without losing work", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "tf-sweep-"));
    const checkpointPath = path.join(dir, "checkpoint.json");
    // First run: one page, then the API dies.
    let call = 0;
    const flaky = new SkillsClient({
        getToken: () => "t",
        fetchImpl: (async () => {
            call++;
            if (call === 1) {
                return new Response(JSON.stringify({
                    data: [skill("a/b/design-tokens")],
                    pagination: { page: 0, perPage: 500, total: 2, hasMore: true },
                }), { status: 200, headers: { "content-type": "application/json" } });
            }
            throw new Error("upstream exploded");
        }),
    });
    const first = await sweepAll({ client: flaky, checkpointPath });
    assert.equal(first.stats.complete, false);
    assert.equal(first.candidates.length, 1);
    assert.ok(first.errors.length > 0);
    const cp = JSON.parse(await readFile(checkpointPath, "utf8"));
    assert.equal(cp.kept.length, 1, "work so far is persisted");
    assert.ok(cp.nextPage >= 1, "resume point recorded");
    // Second run picks up from the checkpoint rather than page 0.
    const resumed = pagedClient([[skill("c/d/ui-kit")]], 2);
    const second = await sweepAll({ client: resumed, checkpointPath });
    assert.deepEqual(second.candidates.map((c) => c.slug).sort(), ["design-tokens", "ui-kit"], "resumed run retains earlier candidates");
});
test("enrichment promotes to indexed and records the content hash", async () => {
    const client = new SkillsClient({
        getToken: () => "t",
        fetchImpl: (async () => new Response(JSON.stringify({
            id: "a/b/design-tokens",
            source: "a/b",
            slug: "design-tokens",
            installs: 100,
            hash: "abc123",
            files: [
                {
                    path: "SKILL.md",
                    contents: "---\nname: design-tokens\n---\nExtract color, typography and spacing tokens into a design system.",
                },
            ],
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const result = await enrichCandidates([skill("a/b/design-tokens")], { client });
    assert.equal(result.enriched[0].tier, "indexed");
    assert.equal(result.enriched[0].hash, "abc123");
    assert.equal(result.stats.requested, 1);
    assert.equal(result.stats.failed, 0);
});
test("enrichment budget degrades to known instead of dropping skills", async () => {
    const client = new SkillsClient({
        getToken: () => "t",
        fetchImpl: (async () => new Response(JSON.stringify({
            id: "a/b/x",
            source: "a/b",
            slug: "x",
            installs: 1,
            hash: "h",
            files: [
                {
                    path: "SKILL.md",
                    contents: "Extract color, typography, spacing and component tokens into a design system with a consistent visual style.",
                },
            ],
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const candidates = [
        skill("a/b/design-one"),
        skill("a/b/design-two"),
        skill("a/b/design-three"),
    ];
    const result = await enrichCandidates(candidates, { client, budget: 1 });
    assert.equal(result.enriched.length, 3, "nothing is silently dropped");
    assert.equal(result.stats.requested, 1);
    assert.equal(result.enriched.filter((e) => e.tier === "known").length, 2, "over-budget candidates fall back to known");
});
test("a failed detail fetch keeps the skill at known rather than losing it", async () => {
    const client = new SkillsClient({
        getToken: () => "t",
        fetchImpl: (async () => {
            throw new Error("404");
        }),
    });
    const result = await enrichCandidates([skill("a/b/design-tokens")], { client });
    assert.equal(result.enriched.length, 1);
    assert.equal(result.enriched[0].tier, "known");
    assert.equal(result.stats.failed, 1);
});
test("sharding splits tiers and sorts by score", () => {
    const skills = [
        { ...skill("a/b/low"), tier: "indexed", score: 40 },
        { ...skill("a/b/high"), tier: "indexed", score: 90 },
        { ...skill("a/b/core"), tier: "core", score: 100 },
        { ...skill("a/b/tail"), tier: "known", score: 20 },
    ];
    const shards = shardByTier(skills);
    assert.equal(shards.core.length, 1);
    assert.equal(shards.known.length, 1);
    assert.deepEqual(shards.indexed.map((s) => s.slug), ["high", "low"]);
});
//# sourceMappingURL=sweep.test.js.map