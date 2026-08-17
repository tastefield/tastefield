import { SkillsClient } from "./client.js";
import { type Snapshot, type SnapshotDiff } from "./snapshot.js";
/**
 * The recurring ingest: sweep the leaderboard, score for design relevance,
 * classify momentum, snapshot, diff against the previous run.
 *
 * Cost of a full run at depth 5000: 10 all-time pages + 2 trending + 2 hot,
 * so ~14 requests against a 600/min budget. The cadence is not rate-limited —
 * it's limited by how often a human wants to review a diff.
 */
export interface IngestOptions {
    /** How deep to sweep the all-time leaderboard. */
    depth?: number;
    /** Keep candidates at or above this relevance score. */
    minScore?: number;
    client?: SkillsClient;
    /** Repo root for snapshot storage. */
    root?: string;
    /** Skip writing files — for dry runs. */
    dryRun?: boolean;
}
export interface IngestResult {
    snapshot: Snapshot;
    diff: SnapshotDiff;
    changelog: string;
    written: string | null;
    stats: {
        swept: number;
        designRelevant: number;
        byMomentum: Record<string, number>;
        byVerdict: Record<string, number>;
    };
    errors: string[];
}
export declare function ingest(options?: IngestOptions): Promise<IngestResult>;
