import type { V1Skill } from "./types.js";
/**
 * Momentum: how a skill is moving, as an axis SEPARATE from what it does.
 *
 * `category` (structure/boundary/voice/motion/process) answers "what is this for".
 * `momentum` answers "is this going anywhere". Conflating them is the mistake —
 * a skill doesn't stop being a motion skill because it cooled off this week, and
 * "trending" is not a kind of design work.
 *
 * The registry exposes three views, and they measure different windows:
 *   all-time  — cumulative installs. Slow, stable, biased toward age.
 *   trending  — installs in the last 24h. Catches this week's arrivals.
 *   hot       — last hour vs the same hour yesterday. Extremely noisy.
 *
 * Hot is noisy enough to be near-useless raw: observed hot entries sat at
 * "1 install, +1 change". A single install can put a skill on the hot board.
 * So hot only contributes when the absolute numbers clear a floor.
 */
export type MomentumState = 
/** Surging right now, above the noise floor. */
"hot"
/** Meaningful 24h install velocity. */
 | "rising"
/** Established, stable install base. */
 | "steady"
/** Was ranked in a previous snapshot, has since dropped out. */
 | "fading"
/** First seen in this snapshot. */
 | "new";
export interface MomentumInput {
    installs: number;
    /** Rank in the all-time view, 1-based. Null if not in the fetched window. */
    allTimeRank: number | null;
    /** Rank in the trending (24h) view. */
    trendingRank: number | null;
    /** Installs in the last 24h, from the trending view. */
    trendingInstalls: number | null;
    /** Rank in the hot view. */
    hotRank: number | null;
    /** Hot view: installs this hour minus the same hour yesterday. */
    hotChange: number | null;
    /** Installs at the previous snapshot, for delta computation. */
    previousInstalls?: number | null;
    /** Whether the skill existed in the previous snapshot at all. */
    seenBefore?: boolean;
}
export interface Momentum {
    state: MomentumState;
    /** 0-100 composite, for ranking within the shortlist. */
    score: number;
    /** Installs gained since the previous snapshot. Null on first sight. */
    delta: number | null;
    /** Percentage growth since the previous snapshot. */
    growthPct: number | null;
    signals: string[];
}
export declare function classifyMomentum(input: MomentumInput): Momentum;
/** A skill observed across all three leaderboard views. */
export interface RankedSkill extends V1Skill {
    allTimeRank: number | null;
    trendingRank: number | null;
    trendingInstalls: number | null;
    hotRank: number | null;
    hotChange: number | null;
}
/**
 * Merge the three view sweeps into one ranked set.
 *
 * A skill can appear in all three, and each view reports a different `installs`
 * meaning — cumulative for all-time, 24h for trending, hourly for hot. Only the
 * all-time figure is a real install count; the others are windowed rates and
 * must not overwrite it. Getting this wrong silently corrupts the headline number.
 */
export declare function mergeViews(allTime: V1Skill[], trending: V1Skill[], hot: Array<V1Skill & {
    change?: number;
}>): RankedSkill[];
