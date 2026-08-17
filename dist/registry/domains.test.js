import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreDomains, DOMAINS } from "./domains.js";
import { scoreRelevance, QUERY_BATTERY } from "./discover.js";
/**
 * Ground truth is the real Marketing topic from skills.sh — 21 skills from
 * coreyhaines31/marketingskills, with their published descriptions.
 */
const MARKETING = [
    { slug: "copywriting", summary: "Persuasive copy across formats: headlines, landing pages, email, and ads", expect: "copy" },
    { slug: "content-strategy", summary: "Topic planning, content calendars, and editorial frameworks", expect: "copy" },
    { slug: "page-cro", summary: "Conversion rate analysis and optimization for landing and product pages", expect: "conversion" },
    { slug: "pricing-strategy", summary: "Pricing page structure, plan naming, anchoring, and conversion optimization", expect: "conversion" },
    { slug: "popup-cro", summary: "Intent-based popup design and copy that converts without degrading UX", expect: null },
    { slug: "competitor-alternatives", summary: "Positioning and messaging for competitive comparison and alternative pages", expect: "brand" },
    { slug: "schema-markup", summary: "Structured data implementation for rich results and AI search visibility", expect: null },
];
test("brand and copy skills are found, not just visual ones", () => {
    for (const item of MARKETING) {
        const result = scoreDomains({
            name: item.slug,
            slug: item.slug,
            source: "coreyhaines31/marketingskills",
            topics: ["Marketing"],
            summary: item.summary,
        });
        assert.notEqual(result.verdict, "exclude", `${item.slug} scored ${result.total} (${result.signals.join(", ")}) — should surface for review`);
        if (item.expect) {
            assert.ok(result.domains.some((d) => d.domain === item.expect), `${item.slug} should match domain "${item.expect}", got [${result.domains.map((d) => d.domain).join(", ")}]`);
        }
    }
});
test("skills spanning copy and visual report both domains", () => {
    // "Intent-based popup design and copy that converts without degrading UX"
    const popup = scoreDomains({
        name: "popup-cro",
        slug: "popup-cro",
        source: "coreyhaines31/marketingskills",
        summary: "Intent-based popup design and copy that converts without degrading UX",
    });
    const found = popup.domains.map((d) => d.domain);
    assert.ok(found.includes("copy"), `expected copy, got [${found.join(", ")}]`);
    assert.ok(found.includes("conversion"), `expected conversion, got [${found.join(", ")}]`);
    assert.ok(popup.domains.length >= 2, "a genuinely multi-domain skill must not be collapsed into one bucket");
});
test("copy-side anti-slop is recognised", () => {
    // Real skill observed on the leaderboard: skyzer/deslop-the-copy
    const deslop = scoreDomains({
        name: "deslop",
        slug: "deslop",
        source: "skyzer/deslop-the-copy",
        summary: "Remove AI slop from marketing and product copy.",
    });
    assert.equal(deslop.primary, "copy");
    assert.notEqual(deslop.verdict, "exclude");
});
test("brand identity work scores on the brand domain", () => {
    for (const name of ["brandkit", "brand-copywriter", "brand-guidelines", "naming-house"]) {
        const result = scoreDomains({ name, slug: name, source: "x/y" });
        assert.ok(result.domains.some((d) => d.domain === "brand" || d.domain === "copy"), `${name} should hit brand or copy, got [${result.domains.map((d) => d.domain).join(", ")}]`);
    }
});
test("expanding to brand and copy did not let infrastructure through", () => {
    const infra = [
        { name: "postgres-migrations", summary: "Run Postgres schema migrations safely." },
        { name: "vault-secrets", summary: "Manage secrets and dynamic credentials in Vault." },
        { name: "kubernetes-deploy", summary: "Deploy containers with terraform and CI/CD pipelines." },
        { name: "cargo-fuzz", summary: "Fuzzing harnesses for Rust crates." },
        { name: "webhook-handler", summary: "Process inbound webhooks and queue jobs." },
    ];
    for (const item of infra) {
        const result = scoreDomains({ ...item, slug: item.name, source: "a/b" });
        assert.equal(result.verdict, "exclude", `${item.name} scored ${result.total} (${result.signals.join(", ")})`);
    }
});
test("outbound email tooling is detected as copy but stays below the bar", () => {
    // Deliberate editorial outcome, not a scoring failure. Cold-email sequencing
    // is copywriting, but it produces no rule that governs a codebase — so it
    // should register on the copy domain and still fall short of review.
    // Scoring it higher would flood the index with marketing-ops tooling.
    const result = scoreDomains({
        name: "email-sequence",
        slug: "email-sequence",
        source: "coreyhaines31/marketingskills",
        topics: ["Marketing"],
        summary: "Multi-touch email sequences with coherent arc, personalization, and timing",
    });
    assert.ok(result.domains.some((d) => d.domain === "copy"), "should still be recognised as copy work rather than invisible");
    assert.equal(result.verdict, "exclude", `scored ${result.total}`);
});
test("every domain has a stated reason to exist", () => {
    const seen = new Set();
    for (const def of DOMAINS) {
        assert.ok(def.why.length > 25, `${def.domain} needs a real justification`);
        assert.ok(def.strong.length >= 5, `${def.domain} needs enough strong terms`);
        assert.ok(!seen.has(def.domain), `duplicate domain: ${def.domain}`);
        seen.add(def.domain);
    }
    assert.equal(seen.size, 8);
});
test("query battery covers every domain", () => {
    const joined = QUERY_BATTERY.join(" ").toLowerCase();
    for (const probe of [
        "design", // visual
        "brand", // brand
        "copywriting", // copy
        "animation", // motion
        "component", // architecture
        "content", // content
        "conversion", // conversion
        "critique", // process
    ]) {
        assert.ok(joined.includes(probe), `query battery has no probe for "${probe}"`);
    }
    for (const q of QUERY_BATTERY) {
        assert.ok(q.trim().split(/\s+/).length >= 2, `"${q}" is single-word and would fuzzy-match instead of semantic-match`);
    }
});
test("scoreRelevance still surfaces the known design set", () => {
    // Regression guard: broadening the taxonomy must not demote the originals.
    for (const name of ["frontend-design", "web-design-guidelines", "high-end-visual-design"]) {
        const result = scoreRelevance({ name, slug: name, source: "anthropics/skills", topics: ["Design & UI"] });
        assert.equal(result.verdict, "include", `${name} scored ${result.score}`);
        assert.equal(result.primaryDomain, "visual");
    }
});
//# sourceMappingURL=domains.test.js.map