/**
 * Multi-domain relevance for the Tastefield index.
 *
 * The original scorer was visual-design only, which was too narrow. Tastefield
 * compiles *brand* into executable context, and brand is not just pixels — it's
 * vocabulary, tone, naming, positioning and the rules about what a product is
 * forbidden from saying.
 *
 * This matters strategically, not just taxonomically. Aesthetic governance has a
 * shelf life: base models keep getting better at spacing and colour on their own.
 * Voice and business-logic governance doesn't expire — a model will never
 * independently know that a given company can't say "cheap", can't use red on a
 * checkout button for compliance reasons, or names its plans a particular way.
 *
 * Two separate axes, deliberately not merged:
 *   domain    what the skill is ABOUT        (visual, brand, copy, motion, …)
 *   category  what kind of RULE it compiles into (structure, boundary, voice, …)
 *
 * A skill can be multi-domain. `popup-cro` — "intent-based popup design and copy
 * that converts without degrading UX" — is genuinely visual + copy + conversion,
 * and forcing it into one bucket loses information.
 */
export const DOMAINS = [
    {
        domain: "visual",
        why: "The original core: what the compiled token and component rules govern.",
        strong: [
            "design", "ui", "visual", "layout", "typography", "font", "color", "colour",
            "spacing", "grid", "radius", "shadow", "css", "tailwind", "style", "styling",
            "theme", "aesthetic", "polish", "figma", "shadcn", "radix", "responsive",
            "dark mode", "contrast", "accessibility", "a11y", "wcag",
        ],
        weak: ["page", "screen", "card", "button", "modal", "icon", "svg", "landing", "portfolio"],
    },
    {
        domain: "brand",
        why: "Brand rules are the most durable governance layer — models never learn them independently.",
        strong: [
            "brand", "branding", "brandkit", "identity", "logo", "positioning",
            "naming", "nomenclature", "guidelines", "styleguide", "style guide",
            "tone of voice", "brand voice", "messaging",
        ],
        weak: ["personality", "audience", "positioning", "differentiation", "competitor"],
    },
    {
        domain: "copy",
        why: "Voice and microcopy compile into enforceable rules and outlive aesthetic ones.",
        strong: [
            "copy", "copywriting", "copywriter", "microcopy", "ux writing", "writing",
            "editorial", "content design", "content strategy", "wording", "tone",
            "voice", "headline", "slop", "deslop", "plain english", "readability",
        ],
        weak: ["message", "label", "text", "narrative", "story", "email", "social", "personalization"],
    },
    {
        domain: "motion",
        why: "Thinnest category in the compiled ruleset — worth importing rather than reinventing.",
        strong: [
            "motion", "animation", "animate", "transition", "easing", "spring",
            "choreography", "micro-interaction", "microinteraction", "gsap", "framer",
        ],
        weak: ["interaction", "hover", "scroll", "parallax", "gesture"],
    },
    {
        domain: "architecture",
        why: "Cleaner component architecture upstream produces cleaner contracts for the scanner.",
        strong: [
            "component", "composition", "variant", "props", "design system",
            "architecture", "storybook", "primitive", "token", "atomic",
        ],
        weak: ["react", "vue", "svelte", "library", "pattern", "refactor"],
    },
    {
        domain: "content",
        why: "Structured content is the schema-side neighbour of a design system.",
        strong: [
            "content model", "structured content", "schema", "cms", "taxonomy",
            "content architecture", "metadata", "frontmatter",
        ],
        weak: ["sanity", "contentful", "markdown", "documentation", "docs"],
    },
    {
        domain: "conversion",
        why: "Where copy and visual meet revenue — the surface agencies are actually paid for.",
        strong: [
            "cro", "conversion", "landing page", "pricing page", "paywall",
            "ab test", "a/b test", "funnel", "onboarding flow", "checkout",
        ],
        weak: ["popup", "cta", "signup", "growth", "retention", "churn"],
    },
    {
        domain: "process",
        why: "Review and extraction workflows that wrap around the compiler.",
        strong: [
            "critique", "review", "audit", "extract", "inspect", "lint",
            "checklist", "guideline compliance", "teardown",
        ],
        weak: ["analysis", "report", "assessment", "feedback", "qa"],
    },
];
/**
 * Global disqualifiers. These outweigh domain hits, so "deploy your design
 * system to Kubernetes" doesn't read as a design skill.
 *
 * Note what is deliberately NOT here: "email", "social" and "seo" are only weak
 * copy signals, not negatives — a copywriting skill that mentions email is still
 * a copywriting skill.
 */
const NEGATIVE_TERMS = [
    "database", "migration", "sql", "postgres", "mongo", "redis", "kafka",
    "oauth", "sso", "vault", "secret", "credential",
    "payment", "billing", "invoice", "stripe integration",
    "kubernetes", "terraform", "docker", "deployment", "ci/cd", "pipeline",
    "observability", "logging", "tracing", "alerting",
    "vulnerability", "malware", "penetration", "fuzzing", "exploit",
    "crypto", "wallet", "blockchain", "trading",
    "webhook", "cron", "queue",
];
/**
 * Skill slugs are hyphenated ("design-system", "landing-page", "content-strategy")
 * but multi-word terms are written with spaces. Without normalising, every
 * multi-word term in the taxonomy silently failed to match any slug — "design
 * system" never once matched `design-system`.
 */
function normalize(text) {
    return text.replace(/[-_/]+/g, " ").toLowerCase();
}
function matchTerms(raw, terms) {
    const haystack = normalize(raw);
    const found = [];
    for (const term of terms) {
        const escaped = term.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
        // Optional trailing "s": skill names are overwhelmingly plural
        // ("design-tokens", "review-animations", "brand-guidelines").
        const re = new RegExp(`(^|[^a-z])${escaped}s?([^a-z]|$)`, "i");
        if (re.test(haystack))
            found.push(term);
    }
    return found;
}
/**
 * Domain threshold — below this a domain isn't reported at all.
 *
 * Must sit below the weight of a single summary match (8), otherwise a skill
 * described as "popup design and copy" reports neither visual nor copy, because
 * one mention of each scores 6 and silently falls under the bar. Multi-domain
 * detection is the whole point, so the floor has to let single mentions through.
 */
const DOMAIN_FLOOR = 6;
export function scoreDomains(input) {
    const nameText = `${input.name} ${input.slug ?? ""}`.toLowerCase();
    const summaryText = (input.summary ?? "").toLowerCase();
    const topicText = (input.topics ?? []).join(" ").toLowerCase();
    const signals = [];
    const matches = [];
    for (const def of DOMAINS) {
        let score = 0;
        const terms = [];
        // A term in the name is worth far more than one buried in a summary —
        // skill names are short and deliberate.
        const strongName = matchTerms(nameText, def.strong);
        if (strongName.length) {
            score += Math.min(strongName.length * 18, 45);
            terms.push(...strongName);
        }
        const strongSummary = matchTerms(summaryText, def.strong);
        if (strongSummary.length) {
            score += Math.min(strongSummary.length * 8, 30);
            terms.push(...strongSummary.filter((t) => !terms.includes(t)));
        }
        const weakAll = matchTerms(`${nameText} ${summaryText}`, def.weak);
        if (weakAll.length)
            score += Math.min(weakAll.length * 3, 12);
        if (score >= DOMAIN_FLOOR) {
            matches.push({ domain: def.domain, score: Math.min(score, 100), terms });
        }
    }
    // Topic tags are the registry's own classification — strong evidence.
    let topicBonus = 0;
    if (/design|ui/.test(topicText)) {
        topicBonus += 30;
        signals.push("topic:design");
    }
    if (/marketing/.test(topicText)) {
        topicBonus += 20;
        signals.push("topic:marketing");
    }
    if (/react|next|mobile/.test(topicText)) {
        topicBonus += 8;
        signals.push("topic:frontend-adjacent");
    }
    const ownerBoost = input.ownerBoost ?? 0;
    if (ownerBoost)
        signals.push(`owner:+${ownerBoost}`);
    matches.sort((a, b) => b.score - a.score);
    // Total leans on the strongest domain, with diminishing credit for breadth.
    // A skill spanning copy + visual + conversion is genuinely more relevant than
    // a single-domain one, but three weak signals shouldn't beat one strong one.
    const best = matches[0]?.score ?? 0;
    const breadth = matches.slice(1).reduce((sum, m) => sum + m.score * 0.25, 0);
    let total = best + Math.min(breadth, 25) + topicBonus + ownerBoost;
    const negatives = matchTerms(`${nameText} ${summaryText}`, NEGATIVE_TERMS);
    if (negatives.length) {
        total -= negatives.length * 30;
        signals.push(`negative:${negatives.slice(0, 3).join("+")}`);
    }
    total = Math.max(0, Math.min(100, Math.round(total)));
    for (const m of matches.slice(0, 3)) {
        signals.push(`${m.domain}:${m.score}`);
    }
    return {
        primary: matches[0]?.domain ?? null,
        domains: matches,
        total,
        verdict: total >= 60 ? "include" : total >= 30 ? "review" : "exclude",
        signals,
    };
}
/** Human-readable rationale for why a domain is indexed. */
export function domainRationale(domain) {
    return DOMAINS.find((d) => d.domain === domain)?.why ?? "";
}
//# sourceMappingURL=domains.js.map