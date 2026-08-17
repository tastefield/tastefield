import type {
  V1AuditResponse,
  V1ListResponse,
  V1SearchResponse,
  V1SkillDetail,
  V1SkillFile,
} from "./types.js";

/**
 * Client for the skills.sh v1 API.
 * Reference: https://www.skills.sh/docs/api
 *
 * Auth is a Vercel OIDC token. Two consequences worth being deliberate about:
 *
 * 1. The token is short-lived (~12h) and request-scoped, so it is resolved per
 *    call and never cached as a string. Hoisting it to module scope is the
 *    documented way to get mysterious 401s in production.
 *
 * 2. It ties us to Vercel's infrastructure for an API we don't control. The
 *    GitHub fallback below exists so that a rate-limit change, a terms change,
 *    or an outage degrades the curated registry instead of breaking it — the
 *    underlying SKILL.md files are public either way.
 */

const BASE_URL = "https://skills.sh";
const USER_AGENT = "tastefield-mcp/0.1";

export class SkillsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string
  ) {
    super(message);
    this.name = "SkillsApiError";
  }
}

export interface SkillsClientOptions {
  /**
   * Resolves a bearer token per request. In a Vercel app pass
   * `() => getVercelOidcToken()` from `@vercel/oidc`.
   */
  getToken?: () => Promise<string | undefined> | string | undefined;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export class SkillsClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly getToken: SkillsClientOptions["getToken"];

  /** Rate limit state from the most recent response. 600/min per team+project. */
  lastRateLimit: RateLimit | null = null;

  constructor(options: SkillsClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? BASE_URL;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.getToken =
      options.getToken ?? (() => process.env.VERCEL_OIDC_TOKEN);
  }

  private async request<T>(path: string): Promise<T> {
    const token = await this.getToken?.();
    if (!token) {
      throw new SkillsApiError(
        "No Vercel OIDC token. Set VERCEL_OIDC_TOKEN (`vercel env pull`) or pass getToken. " +
          "Falling back to the local seed set.",
        401,
        "no_token"
      );
    }

    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    const limit = res.headers.get("X-RateLimit-Limit");
    if (limit) {
      this.lastRateLimit = {
        limit: Number(limit),
        remaining: Number(res.headers.get("X-RateLimit-Remaining") ?? 0),
        resetSeconds: Number(res.headers.get("X-RateLimit-Reset") ?? 0),
      };
    }

    if (!res.ok) {
      // Documented error shape: { error, message }
      let code: string | undefined;
      let message = `skills.sh returned ${res.status}`;
      try {
        const body = (await res.json()) as { error?: string; message?: string };
        code = body.error;
        if (body.message) message = body.message;
      } catch {
        // Non-JSON error body — keep the status-based message.
      }

      if (res.status === 429) {
        const retry = res.headers.get("Retry-After");
        message += retry ? ` Retry after ${retry}s.` : "";
      }
      throw new SkillsApiError(message, res.status, code);
    }

    return (await res.json()) as T;
  }

  /** GET /api/v1/skills — paginated leaderboard. */
  listSkills(
    options: {
      view?: "all-time" | "trending" | "hot";
      page?: number;
      perPage?: number;
    } = {}
  ): Promise<V1ListResponse> {
    const params = new URLSearchParams();
    if (options.view) params.set("view", options.view);
    if (options.page !== undefined) params.set("page", String(options.page));
    if (options.perPage !== undefined)
      params.set("per_page", String(options.perPage));

    const qs = params.toString();
    return this.request<V1ListResponse>(`/api/v1/skills${qs ? `?${qs}` : ""}`);
  }

  /**
   * GET /api/v1/skills/search
   * Single-word queries match fuzzily; multi-word queries use semantic search.
   */
  search(
    query: string,
    options: { limit?: number; owner?: string } = {}
  ): Promise<V1SearchResponse> {
    const params = new URLSearchParams({ q: query });
    if (options.limit) params.set("limit", String(options.limit));
    if (options.owner) params.set("owner", options.owner);

    return this.request<V1SearchResponse>(
      `/api/v1/skills/search?${params.toString()}`
    );
  }

  /** GET /api/v1/skills/{id} — install count plus the full file tree. */
  getSkill(id: string): Promise<V1SkillDetail> {
    return this.request<V1SkillDetail>(`/api/v1/skills/${id}`);
  }

  /**
   * GET /api/v1/skills/audit/{id}
   * Returns null on 404 — "not audited yet" is an expected state, not an error.
   */
  async getAudit(id: string): Promise<V1AuditResponse | null> {
    try {
      return await this.request<V1AuditResponse>(`/api/v1/skills/audit/${id}`);
    } catch (err) {
      if (err instanceof SkillsApiError && err.status === 404) return null;
      throw err;
    }
  }
}

/**
 * Fallback: fetch a skill's files straight from GitHub.
 *
 * Every skills.sh GitHub entry is just a public repo with SKILL.md files, so
 * this needs no auth. Unauthenticated GitHub allows 60 requests/hour per IP,
 * which is fine for importing a curated set of ~20 and useless for crawling —
 * an acceptable trade for not being single-homed on someone else's API.
 */
export async function fetchSkillFromGitHub(
  id: string,
  fetchImpl: typeof fetch = globalThis.fetch
): Promise<V1SkillFile[]> {
  // id is "{owner}/{repo}/{slug}"
  const [owner, repo, ...rest] = id.split("/");
  const slug = rest.join("/");
  if (!owner || !repo || !slug) {
    throw new Error(`Malformed skill id: "${id}". Expected "owner/repo/slug".`);
  }

  const headers = { "User-Agent": USER_AGENT, Accept: "application/vnd.github+json" };

  // Skills live at either skills/<slug>/SKILL.md or <slug>/SKILL.md depending
  // on the repo's layout, so try both rather than assuming one convention.
  for (const dir of [`skills/${slug}`, slug]) {
    const res = await fetchImpl(
      `https://api.github.com/repos/${owner}/${repo}/contents/${dir}`,
      { headers }
    );
    if (!res.ok) continue;

    const entries = (await res.json()) as Array<{
      name: string;
      type: string;
      download_url: string | null;
    }>;
    if (!Array.isArray(entries)) continue;

    const files: V1SkillFile[] = [];
    for (const entry of entries) {
      if (entry.type !== "file" || !entry.download_url) continue;
      const contents = await (await fetchImpl(entry.download_url, { headers })).text();
      files.push({ path: entry.name, contents });
    }
    if (files.length) return files;
  }

  throw new Error(
    `Could not locate skill "${slug}" in ${owner}/${repo} (tried skills/${slug}/ and ${slug}/).`
  );
}
