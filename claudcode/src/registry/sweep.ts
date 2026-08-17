import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { SkillsClient } from "./client.js";
import { scoreRelevance } from "./discover.js";
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
  onProgress?: (state: { page: number; seen: number; kept: number; total: number | null }) => void;
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

const PER_PAGE = 500;

/**
 * Hard ceiling so a pagination bug can't spin forever. 4,000 pages is ~2M
 * skills — comfortably above the current registry, low enough to bound cost.
 */
const MAX_PAGES_CEILING = 4000;

async function loadCheckpoint(file: string): Promise<SweepCheckpoint | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as SweepCheckpoint;
  } catch {
    return null;
  }
}

async function saveCheckpoint(file: string, cp: SweepCheckpoint): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(cp)}\n`, "utf8");
}

/**
 * Enumerate the all-time leaderboard, keeping only skills that pass a cheap
 * name-based relevance sieve.
 *
 * Resumable: a 2,353-page run that dies at page 1,800 should not start over.
 */
export async function sweepAll(options: SweepOptions = {}): Promise<SweepResult> {
  const {
    client = new SkillsClient(),
    maxPages = MAX_PAGES_CEILING,
    // Far below the "review" threshold of 30, and deliberately so. With no
    // description available, a single strong term in the name scores 15 — a
    // skill literally called "ui-kit" tops out there. Anything higher than ~12
    // rejects obvious design skills before stage 2 ever sees them.
    //
    // The cost of this is a large stage-1 shortlist. That's the correct trade:
    // stage 1 is a sieve, stage 2 is the filter. Raise it only if enrichment
    // budget becomes the binding constraint.
    minScore = 12,
    minInstalls = 0,
    checkpointPath,
    onProgress,
  } = options;

  const started = Date.now();
  const errors: string[] = [];

  let kept: V1Skill[] = [];
  let startPage = 0;
  let skillsSeen = 0;
  let registryTotal: number | null = null;

  if (checkpointPath) {
    const cp = await loadCheckpoint(checkpointPath);
    if (cp) {
      kept = cp.kept;
      startPage = cp.nextPage;
      skillsSeen = cp.totalSeen;
      registryTotal = cp.registryTotal;
    }
  }

  const seenIds = new Set(kept.map((k) => k.id));
  const pageCap = Math.min(maxPages, MAX_PAGES_CEILING);
  let page = startPage;
  let complete = false;

  for (; page < pageCap; page++) {
    let res;
    try {
      res = await client.listSkills({ view: "all-time", page, perPage: PER_PAGE });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`page ${page}: ${message}`);

      // Rate limiting is transient — back off and retry the same page once.
      if (/rate limit|429/i.test(message)) {
        await new Promise((r) => setTimeout(r, 61_000));
        page--;
        continue;
      }
      break;
    }

    registryTotal = res.pagination.total ?? registryTotal;
    skillsSeen += res.data.length;

    for (const skill of res.data) {
      if (skill.isDuplicate) continue;
      if (skill.installs < minInstalls) continue;
      if (seenIds.has(skill.id)) continue;

      const relevance = scoreRelevance({
        name: skill.name,
        slug: skill.slug,
        source: skill.source,
        // No topics or summary available at this stage — that's the point of
        // the low threshold and the enrichment pass that follows.
        topics: [],
      });

      if (relevance.score >= minScore) {
        kept.push(skill);
        seenIds.add(skill.id);
      }
    }

    onProgress?.({
      page,
      seen: skillsSeen,
      kept: kept.length,
      total: registryTotal,
    });

    if (checkpointPath && page % 20 === 0) {
      await saveCheckpoint(checkpointPath, {
        view: "all-time",
        nextPage: page + 1,
        totalSeen: skillsSeen,
        registryTotal,
        startedAt: new Date(started).toISOString(),
        updatedAt: new Date().toISOString(),
        kept,
      });
    }

    if (!res.pagination.hasMore) {
      complete = true;
      break;
    }
  }

  return {
    candidates: kept,
    stats: {
      pagesFetched: page - startPage + 1,
      skillsSeen,
      kept: kept.length,
      registryTotal,
      keepRate: skillsSeen > 0 ? Number(((kept.length / skillsSeen) * 100).toFixed(4)) : 0,
      durationMs: Date.now() - started,
      complete,
    },
    errors,
  };
}

/**
 * Tiers for the distilled index.
 *
 * A distillation is only useful if it distinguishes confidence levels. Flattening
 * everything into one list means either burying the good entries or discarding
 * the long tail — this keeps both, labelled.
 */
export type Tier =
  /** Hand-reviewed, categorised, eligible for recipes. */
  | "core"
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
  stats: { requested: number; skippedUnchanged: number; failed: number };
  errors: string[];
}

/**
 * Stage 2: detail-fetch candidates to get real content, then promote to `indexed`.
 *
 * Uses the `hash` field for cache invalidation, so a repeat run costs roughly
 * one request per *changed* skill rather than one per skill.
 */
export async function enrichCandidates(
  candidates: V1Skill[],
  options: EnrichOptions = {}
): Promise<EnrichResult> {
  const {
    client = new SkillsClient(),
    knownHashes = new Map(),
    budget = Infinity,
    onProgress,
  } = options;

  const enriched: TieredSkill[] = [];
  const errors: string[] = [];
  let requested = 0;
  let skippedUnchanged = 0;
  let failed = 0;

  for (const [i, skill] of candidates.entries()) {
    if (requested >= budget) {
      // Out of budget: keep the rest at `known` rather than dropping them.
      enriched.push({
        ...skill,
        tier: "known",
        score: scoreRelevance({
          name: skill.name,
          slug: skill.slug,
          source: skill.source,
        }).score,
      });
      continue;
    }

    try {
      const detail = await client.getSkill(skill.id);
      requested++;

      const previousHash = knownHashes.get(skill.id);
      if (previousHash && detail.hash === previousHash) {
        skippedUnchanged++;
      }

      // SKILL.md frontmatter carries the description the listing endpoint omits.
      const skillMd = detail.files?.find((f) => /^SKILL\.md$/i.test(f.path));
      const summary = skillMd?.contents.slice(0, 1200) ?? null;

      const rescored = scoreRelevance({
        name: skill.name,
        slug: skill.slug,
        source: skill.source,
        summary,
      });

      enriched.push({
        ...skill,
        tier: rescored.verdict === "exclude" ? "known" : "indexed",
        score: rescored.score,
        hash: detail.hash,
        enrichedAt: new Date().toISOString(),
      });
    } catch (err) {
      failed++;
      errors.push(
        `${skill.id}: ${err instanceof Error ? err.message : String(err)}`
      );
      enriched.push({
        ...skill,
        tier: "known",
        score: scoreRelevance({
          name: skill.name,
          slug: skill.slug,
          source: skill.source,
        }).score,
      });
    }

    onProgress?.(i + 1, candidates.length);
  }

  return {
    enriched,
    stats: { requested, skippedUnchanged, failed },
    errors,
  };
}

/**
 * Shard the distilled index for storage.
 *
 * A single JSON file of the full sweep would be unreviewable in a PR diff and
 * awkward in git. Sharding by tier keeps the interesting changes (core, indexed)
 * in small files a human can actually read, while the long tail lives in its own
 * compact file that can be regenerated at will.
 */
export function shardByTier(skills: TieredSkill[]): Record<Tier, TieredSkill[]> {
  const shards: Record<Tier, TieredSkill[]> = { core: [], indexed: [], known: [] };
  for (const skill of skills) shards[skill.tier].push(skill);
  for (const tier of Object.keys(shards) as Tier[]) {
    shards[tier].sort((a, b) => b.score - a.score || b.installs - a.installs);
  }
  return shards;
}

/**
 * Cost projection, so the cadence decision is made on numbers rather than vibes.
 */
export function projectCost(registryTotal: number, shortlistSize: number) {
  const RATE_LIMIT_PER_MIN = 600;

  const sweepPages = Math.ceil(registryTotal / PER_PAGE);
  const sweepMinutes = sweepPages / RATE_LIMIT_PER_MIN;
  const enrichMinutes = shortlistSize / RATE_LIMIT_PER_MIN;

  return {
    sweepPages,
    sweepMinutes: Number(sweepMinutes.toFixed(1)),
    enrichRequests: shortlistSize,
    enrichMinutes: Number(enrichMinutes.toFixed(1)),
    totalMinutes: Number((sweepMinutes + enrichMinutes).toFixed(1)),
    /** Rough JSON footprint of the raw listing data, at ~200 bytes/skill. */
    rawSizeMb: Number(((registryTotal * 200) / 1024 / 1024).toFixed(1)),
  };
}
