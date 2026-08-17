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
  | "hot"
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

/**
 * Minimum absolute activity before the hot view is allowed to matter.
 * Set from observation: the hot board's long tail is skills with a single
 * install in the last hour, which is indistinguishable from noise.
 */
const HOT_NOISE_FLOOR = 25;

/** Minimum 24h installs before "rising" means anything. */
const TRENDING_FLOOR = 500;

export function classifyMomentum(input: MomentumInput): Momentum {
  const signals: string[] = [];

  const delta =
    input.previousInstalls != null ? input.installs - input.previousInstalls : null;
  const growthPct =
    input.previousInstalls != null && input.previousInstalls > 0
      ? Number((((input.installs - input.previousInstalls) / input.previousInstalls) * 100).toFixed(2))
      : null;

  let score = 0;
  let state: MomentumState;

  const hotQualifies =
    input.hotRank != null &&
    (input.hotChange ?? 0) >= HOT_NOISE_FLOOR;

  const trendingQualifies =
    input.trendingRank != null && (input.trendingInstalls ?? 0) >= TRENDING_FLOOR;

  if (!input.seenBefore) {
    state = "new";
    score = 70;
    signals.push("first-seen");
  } else if (hotQualifies) {
    state = "hot";
    score = 90;
    signals.push(`hot:#${input.hotRank}+${input.hotChange}`);
  } else if (trendingQualifies) {
    state = "rising";
    score = 75;
    signals.push(`trending:#${input.trendingRank}(${input.trendingInstalls})`);
  } else if (input.allTimeRank != null) {
    state = "steady";
    score = 40;
    signals.push(`all-time:#${input.allTimeRank}`);
  } else {
    state = "fading";
    score = 10;
    signals.push("dropped-out-of-window");
  }

  // Growth nudges the score within a state rather than changing the state,
  // so a big established skill can't be labelled "rising" on a rounding blip.
  if (growthPct != null) {
    if (growthPct >= 25) {
      score += 10;
      signals.push(`growth:+${growthPct}%`);
    } else if (growthPct <= -10) {
      score -= 15;
      signals.push(`decline:${growthPct}%`);
    }
  }

  if (input.hotRank != null && !hotQualifies) {
    signals.push("hot:below-noise-floor");
  }

  return {
    state,
    score: Math.max(0, Math.min(100, score)),
    delta,
    growthPct,
    signals,
  };
}

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
export function mergeViews(
  allTime: V1Skill[],
  trending: V1Skill[],
  hot: Array<V1Skill & { change?: number }>
): RankedSkill[] {
  const merged = new Map<string, RankedSkill>();

  allTime.forEach((skill, i) => {
    merged.set(skill.id, {
      ...skill,
      allTimeRank: i + 1,
      trendingRank: null,
      trendingInstalls: null,
      hotRank: null,
      hotChange: null,
    });
  });

  trending.forEach((skill, i) => {
    const existing = merged.get(skill.id);
    if (existing) {
      existing.trendingRank = i + 1;
      existing.trendingInstalls = skill.installs;
    } else {
      merged.set(skill.id, {
        ...skill,
        // Not in the all-time window: cumulative installs are unknown, and the
        // trending figure is a 24h rate. Record null rather than a wrong number.
        installs: 0,
        allTimeRank: null,
        trendingRank: i + 1,
        trendingInstalls: skill.installs,
        hotRank: null,
        hotChange: null,
      });
    }
  });

  hot.forEach((skill, i) => {
    const existing = merged.get(skill.id);
    if (existing) {
      existing.hotRank = i + 1;
      existing.hotChange = skill.change ?? null;
    } else {
      merged.set(skill.id, {
        ...skill,
        installs: 0,
        allTimeRank: null,
        trendingRank: null,
        trendingInstalls: null,
        hotRank: i + 1,
        hotChange: skill.change ?? null,
      });
    }
  });

  return [...merged.values()];
}
