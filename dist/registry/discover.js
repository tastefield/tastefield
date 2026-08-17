import { SkillsClient } from "./client.js";
import { scoreDomains } from "./domains.js";
/**
 * Candidate discovery: how to find design-relevant skills in a 600k-skill registry.
 *
 * Two tempting shortcuts, both wrong on their own:
 *
 *   "Index Official"  — Official is a PROVENANCE signal ("built by the company
 *                       that makes the tech"), not a topic. It spans ~99 orgs
 *                       including AWS, Bitwarden, MongoDB and Coinbase. Useful
 *                       as a trust weight; useless as a category filter.
 *
 *   "Use the topics"  — skills.sh's topic pages are hand-curated highlights, not
 *                       a taxonomy. All eight topics together hold ~94 skills.
 *                       Design & UI has 16 — and does not include any of Figma's
 *                       20 design skills. High precision, poor recall.
 *
 * So: harvest a candidate pool from three independent sources, score it, and
 * review a ranked shortlist. Scoring narrows 600k to a few hundred; a human
 * still makes the final call, because that judgement is the product.
 */
/**
 * Design-tooling publishers from the Official list.
 *
 * These are makers of design and frontend tools documenting their own products,
 * which is both topically relevant and high-trust. Counts are repos/skills as
 * listed on skills.sh/official on 2026-08-12.
 */
export const DESIGN_OWNERS = [
    { owner: "figma", why: "Design tool of record. 20 skills incl. implement-design, figma-generate-design — none on the Design topic page." },
    { owner: "vercel-labs", why: "web-design-guidelines, composition patterns, React/Next conventions." },
    { owner: "vercel", why: "AI SDK and framework-level UI guidance." },
    { owner: "anthropics", why: "frontend-design and canvas-design; highest-install design skill in the registry." },
    { owner: "tldraw", why: "Canvas/whiteboard primitives — interaction and rendering patterns." },
    { owner: "nuxt", why: "Nuxt UI — component library conventions." },
    { owner: "facebook", why: "React itself — component model at the source." },
    { owner: "expo", why: "Native UI components, NativeWind/Tailwind setup." },
    { owner: "flutter", why: "88 skills; widget composition and platform design conventions." },
    { owner: "google-labs-code", why: "stitch-skills — Google's UI generation tooling." },
    { owner: "webflow", why: "Visual web building; 37 skills on layout and styling." },
    { owner: "wix", why: "Site building and template systems." },
    { owner: "sanity-io", why: "Structured content — the schema-side neighbour of design systems." },
    { owner: "contentful", why: "Content modelling that constrains presentation." },
    { owner: "remotion-dev", why: "Programmatic video — motion and timing primitives." },
    { owner: "runwayml", why: "Generative visual tooling." },
    { owner: "automattic", why: "WordPress block editor — theme and style systems." },
    { owner: "shopify", why: "Polaris design system lineage." },
    // Brand, copy and conversion publishers. Not on the Official list — these are
    // independent practitioners, which is exactly the Tastemaker profile.
    { owner: "coreyhaines31", why: "21 marketing skills: copywriting, content-strategy, pricing-strategy, page-cro, popup-cro." },
    { owner: "emilkowalski", why: "203.7K installs. Design engineering craft, motion, and the taste-as-differentiator thesis." },
    { owner: "leonxlnx", why: "taste-skill: anti-slop frontend plus brandkit and named visual dials." },
    { owner: "pbakaus", why: "impeccable: polish, critique, distill, quieter, bolder, delight as discrete operators." },
    { owner: "skyzer", why: "deslop-the-copy — copy-side anti-slop, the editorial mirror of our voice rules." },
    { owner: "ognjengt", why: "founder-skills: brand-copywriter, cro-optimization, linkedin-writer." },
    { owner: "checklist-design", why: "Checklist-driven UI and content review." },
    { owner: "arvindrk", why: "extract-design-system — direct TasteSampler analogue." },
    { owner: "nextlevelbuilder", why: "ui-ux-pro-max, though currently flagged on a failed audit." },
];
/**
 * Semantic search battery.
 *
 * The search endpoint uses semantic matching for multi-word queries and fuzzy
 * matching for single words, so every entry here is deliberately multi-word.
 * These target the concepts Tastefield compiles, not just the word "design".
 */
export const QUERY_BATTERY = [
    // visual
    "design system",
    "design tokens",
    "visual design polish",
    "typography and type scale",
    "color palette and theming",
    "spacing and layout grid",
    "responsive breakpoints",
    "accessibility and contrast audit",
    "tailwind css conventions",
    "dark mode theming",
    // architecture
    "component architecture",
    "component library conventions",
    "storybook component documentation",
    "ui component patterns",
    // motion
    "motion and animation design",
    "micro-interactions and transitions",
    // brand
    "brand guidelines and identity",
    "brand voice and tone",
    "naming and positioning",
    "style guide enforcement",
    // copy
    "microcopy and ux writing",
    "copywriting for product",
    "content design and editorial",
    "plain english rewriting",
    "removing ai slop from copy",
    // conversion
    "landing page conversion",
    "pricing page structure",
    "onboarding flow design",
    // content
    "structured content modelling",
    "content schema design",
    // process
    "frontend code review",
    "design critique and feedback",
    "extract design system from website",
];
/** Terms that pull a candidate toward design when they appear in name or slug. */
const STRONG_TERMS = [
    "design", "ui", "ux", "component", "token", "theme", "typography", "font",
    "color", "colour", "spacing", "layout", "grid", "motion", "animation",
    "style", "css", "tailwind", "storybook", "figma", "brand", "visual",
    "aesthetic", "polish", "critique", "accessibility", "a11y", "contrast",
    "responsive", "shadcn", "radix", "variant", "frontend",
];
/** Weaker signals — meaningful in a summary, not enough on their own. */
const WEAK_TERMS = [
    "interface", "page", "screen", "render", "widget", "card", "button",
    "modal", "form", "icon", "svg", "canvas", "landing", "portfolio",
    "microcopy", "copywriting", "editorial", "craft", "taste",
];
/**
 * Terms that indicate a skill is about something else entirely. Negative
 * weighting matters more than it looks: "deploy your design system to AWS"
 * should not outrank "design tokens".
 */
const NEGATIVE_TERMS = [
    "database", "migration", "sql", "postgres", "mongo", "redis", "kafka",
    "auth", "oauth", "sso", "payment", "billing", "invoice", "checkout",
    "kubernetes", "terraform", "docker", "deployment", "ci/cd", "pipeline",
    "observability", "logging", "tracing", "metrics", "alerting",
    "vulnerability", "malware", "penetration", "compliance audit",
    "crypto", "wallet", "blockchain", "trading",
    "email delivery", "sms", "webhook", "cron",
];
function countMatches(haystack, terms) {
    const found = [];
    for (const term of terms) {
        const escaped = term.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
        // Word-boundary match so "ui" doesn't fire on "build" or "guide", with an
        // optional trailing "s" — skill names are overwhelmingly plural
        // ("design-tokens", "ui-components", "review-animations") and a strict
        // match silently missed all of them.
        const re = new RegExp(`(^|[^a-z])${escaped}s?([^a-z]|$)`, "i");
        if (re.test(haystack))
            found.push(term);
    }
    return found;
}
/**
 * Score a candidate for Tastefield relevance across all domains.
 *
 * Delegates to the multi-domain scorer so that brand, copy and conversion
 * skills are found alongside visual ones. Thresholds stay generous toward
 * "review": a false negative (a good skill silently dropped) costs more than a
 * false positive, because a human sees the review pile and never sees the
 * excluded pile.
 */
export function scoreRelevance(input) {
    const owner = input.source.split("/")[0].toLowerCase();
    const known = DESIGN_OWNERS.find((o) => o.owner.toLowerCase() === owner);
    const result = scoreDomains({
        name: input.name,
        slug: input.slug,
        source: input.source,
        topics: input.topics,
        summary: input.summary,
        ownerBoost: known ? 25 : 0,
    });
    return {
        score: result.total,
        verdict: result.verdict,
        signals: known
            ? [`owner:${owner}`, ...result.signals.filter((s) => !s.startsWith("owner:"))]
            : result.signals,
        primaryDomain: result.primary,
        domains: result.domains,
    };
}
/**
 * Harvest candidates from the search battery and the owner allowlist, then rank.
 *
 * Returns a ranked shortlist for human review. It does not decide what ships —
 * the editorial layer (category, status, rationale, recipe membership) is
 * applied by hand afterwards, because that judgement is the differentiator.
 */
export async function harvest(client = new SkillsClient(), options = {}) {
    const queries = options.queries ?? QUERY_BATTERY;
    const owners = options.owners ?? DESIGN_OWNERS.map((o) => o.owner);
    const perQuery = options.perQuery ?? 100;
    const found = new Map();
    const errors = [];
    let fromSearch = 0;
    let fromOwners = 0;
    const record = (skill, via, isOwner) => {
        // Forks and copies add noise without adding options.
        if (skill.isDuplicate)
            return;
        const existing = found.get(skill.id);
        if (existing) {
            if (!existing.foundVia.includes(via))
                existing.foundVia.push(via);
            return;
        }
        found.set(skill.id, {
            ...skill,
            foundVia: [via],
            relevance: scoreRelevance({
                name: skill.name,
                slug: skill.slug,
                source: skill.source,
                // The listing shape carries no topics or summary; scoring leans on
                // name and owner here, and gets sharper after a detail fetch.
                topics: [],
            }),
        });
        if (isOwner)
            fromOwners++;
        else
            fromSearch++;
    };
    for (const query of queries) {
        try {
            const res = await client.search(query, { limit: perQuery });
            for (const skill of res.data)
                record(skill, `search:${query}`, false);
        }
        catch (err) {
            errors.push(`search "${query}": ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    for (const owner of owners) {
        try {
            // An owner-scoped search with a broad term enumerates that owner's set.
            const res = await client.search("design ui component", {
                owner,
                limit: perQuery,
            });
            for (const skill of res.data)
                record(skill, `owner:${owner}`, true);
        }
        catch (err) {
            errors.push(`owner "${owner}": ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    const candidates = [...found.values()].sort((a, b) => b.relevance.score - a.relevance.score || b.installs - a.installs);
    return {
        candidates,
        stats: {
            fromSearch,
            fromOwners,
            unique: candidates.length,
            include: candidates.filter((c) => c.relevance.verdict === "include").length,
            review: candidates.filter((c) => c.relevance.verdict === "review").length,
            excluded: candidates.filter((c) => c.relevance.verdict === "exclude").length,
        },
        errors,
    };
}
//# sourceMappingURL=discover.js.map