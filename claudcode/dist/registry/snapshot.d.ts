import type { Momentum, RankedSkill } from "./momentum.js";
import type { RelevanceScore } from "./discover.js";
/**
 * Versioned snapshots of the design-relevant slice of the registry.
 *
 * Design constraints that drove this:
 *
 * 1. The registry moves fast. Two leaderboard reads minutes apart reported
 *    1,176,382 and 1,168,046 total skills — thousands of skills of drift inside
 *    one session. So a snapshot is a point-in-time observation, never "the truth",
 *    and every record carries the timestamp it was taken at.
 *
 * 2. Install counts are cumulative and monotonic in principle but jitter in
 *    practice (dedup, recounts). Diffs report movement; they don't assert causes.
 *
 * 3. Snapshots are immutable files in git. The diff between two snapshots is the
 *    reviewable artifact — that's what makes a 3-day cron safe to run.
 */
export interface SnapshotEntry {
    id: string;
    slug: string;
    name: string;
    source: string;
    url: string;
    installs: number;
    allTimeRank: number | null;
    trendingRank: number | null;
    hotRank: number | null;
    relevance: RelevanceScore;
    momentum: Momentum;
}
export interface Snapshot {
    /** Date-ordered, collision-safe: 2026-08-13.1 */
    version: string;
    takenAt: string;
    /** Total skills the registry reported at capture time. */
    registryTotal: number | null;
    /** How deep the all-time sweep went. */
    sweepDepth: number;
    /** SHA-256 over the entry set — identical hash means a no-op run. */
    contentHash: string;
    entries: SnapshotEntry[];
}
export interface SnapshotDiff {
    from: string | null;
    to: string;
    added: SnapshotEntry[];
    removed: SnapshotEntry[];
    /** Entries whose momentum state changed, e.g. steady -> rising. */
    momentumChanged: Array<{
        entry: SnapshotEntry;
        was: string;
        now: string;
    }>;
    /** Biggest install gains since the previous snapshot. */
    topGainers: Array<{
        entry: SnapshotEntry;
        delta: number;
        growthPct: number | null;
    }>;
    /** Entries that lost installs — usually a recount, occasionally a delisting. */
    decliners: Array<{
        entry: SnapshotEntry;
        delta: number;
    }>;
    /** True when nothing changed and the run can be discarded. */
    noop: boolean;
}
/**
 * Hash the parts of an entry that represent real content, deliberately
 * excluding rank and momentum. Ranks churn constantly; hashing them would make
 * every run look like a change and defeat no-op detection.
 */
export declare function hashEntries(entries: SnapshotEntry[]): string;
export declare function buildSnapshot(skills: Array<RankedSkill & {
    relevance: RelevanceScore;
    momentum: Momentum;
}>, options: {
    registryTotal?: number | null;
    sweepDepth: number;
    existingVersions?: string[];
}): Snapshot;
export declare function diffSnapshots(previous: Snapshot | null, current: Snapshot): SnapshotDiff;
export declare function listSnapshotVersions(root: string): Promise<string[]>;
export declare function loadLatestSnapshot(root: string): Promise<Snapshot | null>;
export declare function writeSnapshot(root: string, snapshot: Snapshot): Promise<string>;
/** Render a diff as the body of a review PR. */
export declare function renderChangelog(diff: SnapshotDiff, snapshot: Snapshot): string;
