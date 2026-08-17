/**
 * Types mirroring the skills.sh v1 API.
 * Source: https://www.skills.sh/docs/api
 */

/** The base skill shape returned by listing and search endpoints. */
export interface V1Skill {
  /** Stable identifier, format "{source}/{slug}". Use to build detail paths. */
  id: string;
  slug: string;
  name: string;
  /** GitHub "owner/repo", or a domain for well-known sources. */
  source: string;
  installs: number;
  sourceType: "github" | "well-known";
  installUrl: string | null;
  url: string;
  /** Present and true when the skill is a detected fork/copy of another. */
  isDuplicate?: boolean;
}

/** `view=hot` adds hour-over-hour comparison fields. */
export interface V1HotSkill extends V1Skill {
  installsYesterday: number;
  change: number;
}

export interface V1Pagination {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}

export interface V1ListResponse {
  data: V1Skill[];
  pagination: V1Pagination;
}

export interface V1SearchResponse {
  data: V1Skill[];
  query: string;
  searchType: "fuzzy" | "semantic";
  count: number;
  durationMs: number;
}

export interface V1SkillFile {
  path: string;
  contents: string;
}

/** The detail endpoint returns a different, minimal shape. */
export interface V1SkillDetail {
  id: string;
  source: string;
  slug: string;
  installs: number;
  /** SHA-256 of file contents — use for cache invalidation. Null if no snapshot. */
  hash: string | null;
  files: V1SkillFile[] | null;
}

export interface V1Audit {
  provider: string;
  slug: string;
  status: "pass" | "warn" | "fail";
  summary: string;
  auditedAt: string;
  riskLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categories?: string[];
}

export interface V1AuditResponse {
  id: string;
  source: string;
  slug: string;
  audits: V1Audit[];
}

/** Normalised audit verdict, as shown on a skill's detail page. */
export interface CuratedAudit {
  provider: string;
  status: "pass" | "warn" | "fail";
}

/**
 * Editorial status. The point of a curated set is that some things don't make
 * the cut — a list that recommends everything recommends nothing.
 */
export type CurationStatus =
  /** Safe to bundle into a recipe. */
  | "recommended"
  /** Carried for comparison or completeness, deliberately not in a recipe. */
  | "watch"
  /** Has a concrete problem a user should see before installing. */
  | "flagged";

/**
 * A skill after Tastefield curation.
 *
 * Fields fall into three groups:
 *   - Registry facts, verified against skills.sh (id, installs, stars, audits…)
 *   - skills.sh's own copy (officialSummary, summaryBullets, skillMdExcerpt)
 *   - Tastefield's editorial layer (category, rationale, status, recipes)
 *
 * Anyone can mirror the first two. The third is the product.
 */
export interface CuratedSkill {
  id: string;
  slug: string;
  name: string;
  source: string;
  url: string;
  installUrl: string | null;

  /** Verified against the skill's detail page. Null when it could not be read. */
  installs: number | null;
  /** Stars on the source repo — note this is repo-wide, not per-skill. */
  githubStars: number | null;
  githubUrl: string;
  /** ISO date the registry first indexed the skill. */
  firstSeen: string | null;

  /** skills.sh topic tags, e.g. ["Design & UI", "React"]. */
  topics: string[];
  /** The exact command skills.sh publishes for this skill. */
  installCommand: string;

  /** skills.sh's own one-line summary. Their copy, not ours. */
  officialSummary: string | null;
  /** skills.sh's own bullet breakdown. Their copy, not ours. */
  summaryBullets: string[];
  /** Opening lines of the skill's SKILL.md, for preview. */
  skillMdExcerpt: string | null;

  /** Security audit verdicts from the detail page. */
  audits: CuratedAudit[];

  /** Tastefield's own categorisation, aligned to the compiler's rule categories. */
  category: "structure" | "boundary" | "voice" | "motion" | "process";

  /** Tastefield's editorial verdict. */
  status: CurationStatus;
  /** Why this earned a slot, or why it's flagged. Ours. */
  rationale: string;

  /** Recipes that bundle this skill. Flagged skills stay out of recipes. */
  recipes: string[];

  /**
   * Third-party prose skills install as-is. Only first-party token-derived
   * content is parametrically tweakable — a slider needs a number behind it,
   * and prose instructions don't have one.
   */
  tweakable: false;

  /** False when the detail page could not be read and fields are incomplete. */
  verified: boolean;
}
