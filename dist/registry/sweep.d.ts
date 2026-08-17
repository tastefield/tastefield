import { SkillsClient } from "./client.js";
import type { V1Skill } from "./types.js";
/**
 * Full-registry sweep — the "distillation" pass.
 *
 * Feasibility, from the real numbers:
 *
 *   registry size     1,176,382 skills (leaderboard, 2026-08-13)
 *   page size         500 (API max)
 *   pages             ~2,353
 *   rate limit        600 requests/minute
 *   wall clock        ~4 minutes of requests
 *
 * So a complete enumeration is cheap. The expensive part is not fetching — it's
 * that the LISTING endpoint returns no description and no topics. Per skill you
 * get id, slug, name, source, installs, sourceType, installUrl, url. Nothing else.
 *
 * That forces two stages:
 *
 *   Stage 1 (sweep)   Score 1.18M on name + source alone. Cheap, low precision.
 *                     Deliberately generous threshold — this is a sieve, not a filter.
 *   Stage 2 (enrich)  Detail-fetch the survivors for real summaries, topics and
 *                     audits, then rescore properly. One request per candidate.
 *
 * Stage 2 is why the shortlist size matters: 20k candidates is ~33 minutes of
 * requests. The detail endpoint returns a `hash` of file contents, so subsequent
 * runs only re-fetch skills whose hash changed. Steady-state cost is small; the
 * first run is the expensive one.
 */
export interface SweepCheckpoint {
    view: string;
    nextPage: number;
    totalSeen: number;
    registryTotal: number | null;
    startedAt: string;
    updatedAt: string;
    /** Candidates kept so far, so a resumed run doesn't lose work. */
    kept: V1Skill[];
}
export interface SweepOptions {
    client?: SkillsClient;
    /** Stop after N pages. Omit for the whole registry. */
    maxPages?: number;
    /** Stage-1 threshold. Low on purpose — this is a sieve. */
    minScore?: number;
    /** Skip skills below this install count. 0 keeps everything, including new arrivals. */
    minInstalls?: number;
    /** Where to persist checkpoints so a long run can resume. */
    checkpointPath?: string;
    /** Called after each page so callers can log progress. */
    onProgress?: (state: {
        page: number;
        seen: number;
        kept: number;
        total: number | null;
    }) => void;
}
export interface SweepResult {
    candidates: V1Skill[];
    stats: {
        pagesFetched: number;
        skillsSeen: number;
        kept: number;
        registryTotal: number | null;
        /** Proportion of the registry that survived stage 1. */
        keepRate: number;
        durationMs: number;
        complete: boolean;
    };
    errors: string[];
}
/**
 * Enumerate the all-time leaderboard, keeping only skills that pass a cheap
 * name-based relevance sieve.
 *
 * Resumable: a 2,353-page run that dies at page 1,800 should not start over.
 */
export declare function sweepAll(options?: SweepOptions): Promise<SweepResult>;
/**
 * Tiers for the distilled index.
 *
 * A distillation is only useful if it distinguishes confidence levels. Flattening
 * everything into one list means either burying the good entries or discarding
 * the long tail — this keeps both, labelled.
 */
export type Tier = 
/** Hand-reviewed, categorised, eligible for recipes. */
"core"
/** Detail-verified and scored, browsable, not yet hand-reviewed. */
 | "indexed"
/** Seen in the sweep and scored on name alone. Searchable, not featured. */
 | "known";
export interface TieredSkill extends V1Skill {
    tier: Tier;
    score: number;
    /** Content hash from the detail endpoint, when enriched. Drives incremental refresh. */
    hash?: string | null;
    enrichedAt?: string;
}
export interface EnrichOptions {
    client?: SkillsClient;
    /** Previous hashes by skill id — unchanged hashes are skipped. */
    knownHashes?: Map<string, string | null>;
    /** Cap the number of detail requests for this run. */
    budget?: number;
    onProgress?: (done: number, total: number) => void;
}
export interface EnrichResult {
    enriched: TieredSkill[];
    stats: {
        requested: number;
        skippedUnchanged: number;
        failed: number;
    };
    errors: string[];
}
/**
 * Stage 2: detail-fetch candidates to get real content, then promote to `indexed`.
 *
 * Uses the `hash` field for cache invalidation, so a repeat run costs roughly
 * one request per *changed* skill rather than one per skill.
 */
export declare function enrichCandidates(candidates: V1Skill[], options?: EnrichOptions): Promise<EnrichResult>;
/**
 * Shard the distilled index for storage.
 *
 * A single JSON file of the full sweep would be unreviewable in a PR diff and
 * awkward in git. Sharding by tier keeps the interesting changes (core, indexed)
 * in small files a human can actually read, while the long tail lives in its own
 * compact file that can be regenerated at will.
 */
export declare function shardByTier(skills: TieredSkill[]): Record<Tier, TieredSkill[]>;
/**
 * Cost projection, so the cadence decision is made on numbers rather than vibes.
 */
export declare function projectCost(registryTotal: number, shortlistSize: number): {
    sweepPages: number;
    sweepMinutes: number;
    enrichRequests: number;
    enrichMinutes: number;
    totalMinutes: number;
    /** Rough JSON footprint of the raw listing data, at ~200 bytes/skill. */
    rawSizeMb: number;
};
