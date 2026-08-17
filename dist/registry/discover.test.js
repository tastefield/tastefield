import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreRelevance, harvest, DESIGN_OWNERS, QUERY_BATTERY } from "./discover.js";
import { CURATED } from "./curate.js";
import { SkillsClient } from "./client.js";
/**
 * The scorer is validated against ground truth we already hold: the 16
 * hand-verified design skills should rank high, and real non-design skills
 * from the Official list should rank low.
 */
test("every curated design skill scores as include or review", () => {
    for (const s of CURATED) {
        const result = scoreRelevance({
            name: s.name,
            slug: s.slug,
            source: s.source,
            topics: s.topics,
            summary: s.officialSummary,
        });
        assert.notEqual(result.verdict, "exclude", `${s.slug} scored ${result.score} (${result.signals.join(", ")}) — a known design skill must not be excluded`);
    }
});
test("known design skills outscore known infrastructure skills", () => {
    // Real skills from the Official list that are emphatically not design work.
    const infra = [
        { name: "postgres-migrations", slug: "postgres-migrations", source: "neondatabase/agent-skills", summary: "Write and run Postgres schema migrations safely." },
        { name: "vault-secrets", slug: "vault-secrets", source: "hashicorp/agent-skills", summary: "Manage secrets, auth methods, and dynamic credentials in Vault." },
        { name: "stripe-payments", slug: "stripe-payments", source: "stripe/ai", summary: "Create checkout sessions, handle webhooks, and reconcile invoices." },
        { name: "kubernetes-deploy", slug: "kubernetes-deploy", source: "microsoft/azure-skills", summary: "Deploy containers to Kubernetes with terraform and CI/CD pipelines." },
    ];
    for (const item of infra) {
        const result = scoreRelevance(item);
        assert.equal(result.verdict, "exclude", `${item.slug} scored ${result.score} (${result.signals.join(", ")}) — infrastructure must be excluded`);
    }
    const design = scoreRelevance({
        name: "frontend-design",
        slug: "frontend-design",
        source: "anthropics/skills",
        topics: ["Design & UI"],
        summary: "Distinctive, production-grade frontend interfaces.",
    });
    const worstInfra = Math.max(...infra.map((i) => scoreRelevance(i).score));
    assert.ok(design.score > worstInfra, `design (${design.score}) should outscore all infra (max ${worstInfra})`);
});
test("negative terms outweigh an incidental design mention", () => {
    // The exact failure mode the negative weighting exists for.
    const result = scoreRelevance({
        name: "deploy-design-system",
        slug: "deploy-design-system",
        source: "aws/agent-toolkit-for-aws",
        summary: "Deploy your design system documentation to Kubernetes with terraform and a CI/CD pipeline.",
    });
    assert.notEqual(result.verdict, "include", `scored ${result.score} (${result.signals.join(", ")}) — deployment work should not be auto-included`);
});
test("design-tool owners get a trust boost even with a neutral name", () => {
    const withOwner = scoreRelevance({
        name: "implement-design",
        slug: "implement-design",
        source: "figma/mcp-server-guide",
    });
    const withoutOwner = scoreRelevance({
        name: "implement-design",
        slug: "implement-design",
        source: "randomuser/misc",
    });
    assert.ok(withOwner.score > withoutOwner.score, "figma ownership should raise the score");
    assert.ok(withOwner.signals.some((s) => s.startsWith("owner:")), "owner signal should be recorded");
});
test("search battery uses multi-word queries only", () => {
    // Single-word queries fall back to fuzzy matching, which defeats the purpose.
    for (const query of QUERY_BATTERY) {
        assert.ok(query.trim().split(/\s+/).length >= 2, `"${query}" is single-word and would fuzzy-match instead of semantic-match`);
    }
});
test("owner allowlist entries all carry a justification", () => {
    assert.ok(DESIGN_OWNERS.length >= 15);
    for (const entry of DESIGN_OWNERS) {
        assert.ok(entry.why.length > 15, `${entry.owner} needs a real rationale`);
    }
});
test("harvest dedupes across sources and records provenance", async () => {
    const skill = {
        id: "figma/mcp-server-guide/implement-design",
        slug: "implement-design",
        name: "implement-design",
        source: "figma/mcp-server-guide",
        installs: 5000,
        sourceType: "github",
        installUrl: "https://github.com/figma/mcp-server-guide",
        url: "https://www.skills.sh/figma/mcp-server-guide/implement-design",
    };
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => new Response(JSON.stringify({
            data: [skill],
            query: "x",
            searchType: "semantic",
            count: 1,
            durationMs: 1,
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const result = await harvest(client, {
        queries: ["design system", "design tokens"],
        owners: ["figma"],
    });
    assert.equal(result.stats.unique, 1, "same skill from 3 sources must dedupe to 1");
    assert.equal(result.candidates[0].foundVia.length, 3, "all three sources recorded");
    assert.equal(result.errors.length, 0);
});
test("harvest filters out flagged duplicates", async () => {
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => new Response(JSON.stringify({
            data: [
                {
                    id: "someone/fork/copied-skill",
                    slug: "copied-skill",
                    name: "copied-skill",
                    source: "someone/fork",
                    installs: 1,
                    sourceType: "github",
                    installUrl: null,
                    url: "https://www.skills.sh/someone/fork/copied-skill",
                    isDuplicate: true,
                },
            ],
            query: "x",
            searchType: "semantic",
            count: 1,
            durationMs: 1,
        }), { status: 200, headers: { "content-type": "application/json" } })),
    });
    const result = await harvest(client, { queries: ["design system"], owners: [] });
    assert.equal(result.stats.unique, 0, "forks should be dropped");
});
test("harvest survives a failing query without losing the rest", async () => {
    let call = 0;
    const client = new SkillsClient({
        getToken: () => "fake-token",
        fetchImpl: (async () => {
            call++;
            if (call === 1)
                throw new Error("rate limited");
            return new Response(JSON.stringify({
                data: [
                    {
                        id: "a/b/design-tokens",
                        slug: "design-tokens",
                        name: "design-tokens",
                        source: "a/b",
                        installs: 10,
                        sourceType: "github",
                        installUrl: null,
                        url: "https://www.skills.sh/a/b/design-tokens",
                    },
                ],
                query: "x",
                searchType: "semantic",
                count: 1,
                durationMs: 1,
            }), { status: 200, headers: { "content-type": "application/json" } });
        }),
    });
    const result = await harvest(client, {
        queries: ["design system", "design tokens"],
        owners: [],
    });
    assert.equal(result.errors.length, 1, "the failure is reported");
    assert.equal(result.stats.unique, 1, "the surviving query still contributes");
});
//# sourceMappingURL=discover.test.js.map