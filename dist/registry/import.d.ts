import { SkillsClient } from "./client.js";
/**
 * Import a curated skill into the local repo.
 *
 * Imported skills are stored separately from compiled output and are never
 * rewritten — they install as-is. Third-party skills are prose instructions,
 * not parameters, so there is nothing meaningful for a slider to move. Only
 * first-party token-derived content is parametrically tweakable.
 *
 * Layout:
 *   .tastefield/skills/<owner>__<repo>__<slug>/SKILL.md
 *   .tastefield/skills/manifest.json
 */
export interface ImportedSkill {
    id: string;
    slug: string;
    source: string;
    dir: string;
    files: string[];
    importedAt: string;
    /** "api" (skills.sh) or "github" (fallback). */
    via: "api" | "github";
    /** Content hash from the API, when available. Used to detect upstream drift. */
    hash: string | null;
}
export interface Manifest {
    version: string;
    skills: ImportedSkill[];
}
export interface ImportOptions {
    client?: SkillsClient;
    /** Skip the API and go straight to GitHub. Useful without a Vercel token. */
    preferGitHub?: boolean;
    fetchImpl?: typeof fetch;
}
export declare function importSkill(repoRoot: string, idOrSlug: string, options?: ImportOptions): Promise<ImportedSkill>;
export declare function listImported(repoRoot: string): Promise<ImportedSkill[]>;
