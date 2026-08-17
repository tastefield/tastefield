import type { V1Skill } from "./types.js";
import { SkillsClient } from "./client.js";
import { type Domain, type DomainMatch } from "./domains.js";
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
export declare const DESIGN_OWNERS: Array<{
    owner: string;
    why: string;
}>;
/**
 * Semantic search battery.
 *
 * The search endpoint uses semantic matching for multi-word queries and fuzzy
 * matching for single words, so every entry here is deliberately multi-word.
 * These target the concepts Tastefield compiles, not just the word "design".
 */
export declare const QUERY_BATTERY: string[];
export interface RelevanceInput {
    name: string;
    slug?: string;
    source: string;
    topics?: string[];
    summary?: string | null;
}
export interface RelevanceScore {
    score: number;
    verdict: "include" | "review" | "exclude";
    signals: string[];
    /** Strongest subject-matter domain. Null when nothing matched. */
    primaryDomain: Domain | null;
    /** Every domain that cleared the floor. Skills are frequently multi-domain. */
    domains: DomainMatch[];
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
export declare function scoreRelevance(input: RelevanceInput): RelevanceScore;
export interface Candidate extends V1Skill {
    relevance: RelevanceScore;
    /** Which harvest source(s) surfaced this skill. */
    foundVia: string[];
}
export interface HarvestResult {
    candidates: Candidate[];
    stats: {
        fromSearch: number;
        fromOwners: number;
        unique: number;
        include: number;
        review: number;
        excluded: number;
    };
    errors: string[];
}
/**
 * Harvest candidates from the search battery and the owner allowlist, then rank.
 *
 * Returns a ranked shortlist for human review. It does not decide what ships —
 * the editorial layer (category, status, rationale, recipe membership) is
 * applied by hand afterwards, because that judgement is the differentiator.
 */
export declare function harvest(client?: SkillsClient, options?: {
    queries?: string[];
    owners?: string[];
    perQuery?: number;
}): Promise<HarvestResult>;
