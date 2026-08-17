import type { V1AuditResponse, V1ListResponse, V1SearchResponse, V1SkillDetail, V1SkillFile } from "./types.js";
export declare class SkillsApiError extends Error {
    readonly status: number;
    readonly code?: string | undefined;
    constructor(message: string, status: number, code?: string | undefined);
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
export declare class SkillsClient {
    private readonly baseUrl;
    private readonly fetchImpl;
    private readonly getToken;
    /** Rate limit state from the most recent response. 600/min per team+project. */
    lastRateLimit: RateLimit | null;
    constructor(options?: SkillsClientOptions);
    private request;
    /** GET /api/v1/skills — paginated leaderboard. */
    listSkills(options?: {
        view?: "all-time" | "trending" | "hot";
        page?: number;
        perPage?: number;
    }): Promise<V1ListResponse>;
    /**
     * GET /api/v1/skills/search
     * Single-word queries match fuzzily; multi-word queries use semantic search.
     */
    search(query: string, options?: {
        limit?: number;
        owner?: string;
    }): Promise<V1SearchResponse>;
    /** GET /api/v1/skills/{id} — install count plus the full file tree. */
    getSkill(id: string): Promise<V1SkillDetail>;
    /**
     * GET /api/v1/skills/audit/{id}
     * Returns null on 404 — "not audited yet" is an expected state, not an error.
     */
    getAudit(id: string): Promise<V1AuditResponse | null>;
}
/**
 * Fallback: fetch a skill's files straight from GitHub.
 *
 * Every skills.sh GitHub entry is just a public repo with SKILL.md files, so
 * this needs no auth. Unauthenticated GitHub allows 60 requests/hour per IP,
 * which is fine for importing a curated set of ~20 and useless for crawling —
 * an acceptable trade for not being single-homed on someone else's API.
 */
export declare function fetchSkillFromGitHub(id: string, fetchImpl?: typeof fetch): Promise<V1SkillFile[]>;
