import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { CURATED, findSkill, formatInstalls, hydrateInstalls, recipes, } from "./curate.js";
import { SkillsClient } from "./client.js";
import { importSkill, listImported } from "./import.js";
test("curated set is well formed", () => {
    assert.ok(CURATED.length >= 15);
    const ids = new Set();
    for (const s of CURATED) {
        assert.match(s.id, /^[\w.-]+\/[\w.-]+\/[\w.-]+$/, `bad id: ${s.id}`);
        assert.ok(!ids.has(s.id), `duplicate id: ${s.id}`);
        ids.add(s.id);
        // id must agree with source + slug, or detail-endpoint paths break.
        assert.equal(s.id, `${s.source}/${s.slug}`, `id/source/slug mismatch: ${s.id}`);
        assert.ok(s.url.startsWith("https://www.skills.sh/"), s.url);
        assert.ok(s.rationale.length > 10, `missing rationale: ${s.slug}`);
        assert.ok(s.installCommand.startsWith("npx skills add "), `bad install command: ${s.slug}`);
        // Third-party prose skills are never parametrically tweakable.
        assert.equal(s.tweakable, false, `${s.slug} must not be tweakable`);
    }
});
test("verified skills carry the registry facts, unverified ones admit it", () => {
    for (const s of CURATED) {
        if (s.verified) {
            assert.ok(s.installs !== null, `${s.slug}: verified but no install count`);
            assert.ok(s.officialSummary, `${s.slug}: verified but no official summary`);
            assert.ok(s.audits.length > 0, `${s.slug}: verified but no audits`);
            assert.ok(s.firstSeen, `${s.slug}: verified but no firstSeen`);
        }
        else {
            // An unverified entry must not fake data it doesn't have.
            assert.equal(s.installs, null, `${s.slug}: unverified but has installs`);
            assert.equal(s.audits.length, 0, `${s.slug}: unverified but has audits`);
        }
    }
});
test("flagged skills are never bundled into a recipe", () => {
    for (const s of CURATED) {
        if (s.status === "flagged" || s.status === "watch") {
            assert.deepEqual(s.recipes, [], `${s.slug} is ${s.status} but appears in a recipe`);
        }
    }
});
test("any failing audit forces a flagged status", () => {
    for (const s of CURATED) {
        const failing = s.audits.filter((a) => a.status === "fail");
        if (failing.length) {
            assert.equal(s.status, "flagged", `${s.slug} fails ${failing.map((a) => a.provider).join(", ")} but is marked ${s.status}`);
        }
    }
});
test("unverified install counts are null, never zero", () => {
    for (const s of CURATED) {
        assert.ok(s.installs === null || s.installs > 0, `${s.slug} has installs=0, which reads as a real measurement`);
    }
});
test("formatInstalls renders unknown as an em dash", () => {
    assert.equal(formatInstalls(null), "—");
    assert.equal(formatInstalls(770900), "770.9K");
    assert.equal(formatInstalls(2_900_000), "2.9M");
    assert.equal(formatInstalls(42), "42");
});
test("recipes resolve to real skills", () => {
    const all = recipes();
    assert.ok(all.length >= 4);
    for (const r of all) {
        assert.ok(r.skills.length > 0, `empty recipe: ${r.name}`);
        for (const s of r.skills)
            assert.ok(findSkill(s.slug));
    }
});
test("hydrateInstalls degrades to seed data when the API is unavailable", async () => {
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => {
            throw new Error("network unreachable");
        }),
    });
    const res = await hydrateInstalls(client);
    assert.equal(res.hydrated, 0);
    assert.ok(res.error, "should report the failure rather than throwing");
    assert.equal(res.skills.length, CURATED.length, "seed data still returned");
});
test("hydrateInstalls merges live counts onto the curated set", async () => {
    // Deliberately start from a null count so the merge is observable. Every
    // seed entry currently has a verified install figure, so construct the gap.
    const target = { ...CURATED[0], installs: null };
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => new Response(JSON.stringify({
            data: [
                {
                    id: target.id,
                    slug: target.slug,
                    name: target.name,
                    source: target.source,
                    installs: 12345,
                    sourceType: "github",
                    installUrl: null,
                    url: target.url,
                },
            ],
            pagination: { page: 0, perPage: 500, total: 1, hasMore: false },
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const res = await hydrateInstalls(client, [target]);
    assert.equal(res.hydrated, 1);
    assert.equal(res.skills[0].installs, 12345);
});
test("rate limit headers are captured", async () => {
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => new Response(JSON.stringify({ data: [], pagination: { hasMore: false } }), {
            status: 200,
            headers: {
                "content-type": "application/json",
                "X-RateLimit-Limit": "600",
                "X-RateLimit-Remaining": "598",
                "X-RateLimit-Reset": "42",
            },
        })),
    });
    await client.listSkills();
    assert.deepEqual(client.lastRateLimit, {
        limit: 600,
        remaining: 598,
        resetSeconds: 42,
    });
});
test("missing token produces an actionable error", async () => {
    const client = new SkillsClient({ getToken: () => undefined });
    await assert.rejects(() => client.listSkills(), /VERCEL_OIDC_TOKEN/);
});
test("import writes skill files and records them in the manifest", async () => {
    const repo = await mkdtemp(path.join(tmpdir(), "tf-import-"));
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => new Response(JSON.stringify({
            id: "pbakaus/impeccable/polish",
            source: "pbakaus/impeccable",
            slug: "polish",
            installs: 999,
            hash: "abc123def456",
            files: [
                { path: "SKILL.md", contents: "---\nname: polish\n---\nTighten spacing." },
                { path: "references/notes.md", contents: "Supporting notes." },
                // Path traversal attempt — must not escape the skill directory.
                { path: "../../../evil.md", contents: "should not land outside" },
            ],
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const record = await importSkill(repo, "polish", { client });
    assert.equal(record.via, "api");
    assert.equal(record.hash, "abc123def456");
    assert.ok(record.files.includes("SKILL.md"));
    assert.ok(record.files.some((f) => f.replace(/\\/g, "/") === "references/notes.md"));
    assert.ok(!record.files.some((f) => f.includes("..")), "traversal path must be neutralised");
    const skillMd = await readFile(path.join(repo, record.dir, "SKILL.md"), "utf8");
    assert.match(skillMd, /Tighten spacing/);
    const imported = await listImported(repo);
    assert.equal(imported.length, 1);
    assert.equal(imported[0].id, "pbakaus/impeccable/polish");
});
test("import refuses skills outside the curated set", async () => {
    const repo = await mkdtemp(path.join(tmpdir(), "tf-import-"));
    await assert.rejects(() => importSkill(repo, "some-random-skill"), /not in the curated set/);
});
//# sourceMappingURL=registry.test.js.map