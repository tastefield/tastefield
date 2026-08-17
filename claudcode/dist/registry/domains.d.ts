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
export type Domain = 
/** Layout, colour, typography, spacing, visual craft. */
"visual"
/** Identity, naming, positioning, brand guidelines. */
 | "brand"
/** Microcopy, UX writing, editorial, tone of voice. */
 | "copy"
/** Animation, transitions, interaction feel. */
 | "motion"
/** Component architecture, design system engineering. */
 | "architecture"
/** Content modelling, structured content, schema. */
 | "content"
/** CRO, landing pages, pricing pages — where copy and visual meet money. */
 | "conversion"
/** Critique, review, audit, extraction workflows. */
 | "process";
export interface DomainDefinition {
    domain: Domain;
    /** Why this domain belongs in a Tastefield index. */
    why: string;
    strong: string[];
    weak: string[];
}
export declare const DOMAINS: DomainDefinition[];
export interface DomainMatch {
    domain: Domain;
    score: number;
    terms: string[];
}
export interface DomainScore {
    /** Highest-scoring domain, or null if nothing matched. */
    primary: Domain | null;
    /** Every domain that cleared the threshold, strongest first. */
    domains: DomainMatch[];
    /** Combined relevance, 0-100. */
    total: number;
    verdict: "include" | "review" | "exclude";
    signals: string[];
}
export interface DomainScoreInput {
    name: string;
    slug?: string;
    source: string;
    topics?: string[];
    summary?: string | null;
    /** Extra trust for known-relevant publishers. */
    ownerBoost?: number;
}
export declare function scoreDomains(input: DomainScoreInput): DomainScore;
/** Human-readable rationale for why a domain is indexed. */
export declare function domainRationale(domain: Domain): string;
