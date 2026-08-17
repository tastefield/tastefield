import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { CONTEXT_DIR } from "../compile/index.js";
import { SkillsClient, fetchSkillFromGitHub } from "./client.js";
import { findSkill } from "./curate.js";
import type { V1SkillFile } from "./types.js";

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

const MANIFEST = "manifest.json";

function skillDirName(id: string): string {
  return id.replace(/\//g, "__");
}

async function readManifest(repoRoot: string): Promise<Manifest> {
  const file = path.join(repoRoot, CONTEXT_DIR, "skills", MANIFEST);
  try {
    return JSON.parse(await readFile(file, "utf8")) as Manifest;
  } catch {
    return { version: "0.1", skills: [] };
  }
}

async function writeManifest(repoRoot: string, manifest: Manifest): Promise<void> {
  const dir = path.join(repoRoot, CONTEXT_DIR, "skills");
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, MANIFEST),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
}

export interface ImportOptions {
  client?: SkillsClient;
  /** Skip the API and go straight to GitHub. Useful without a Vercel token. */
  preferGitHub?: boolean;
  fetchImpl?: typeof fetch;
}

export async function importSkill(
  repoRoot: string,
  idOrSlug: string,
  options: ImportOptions = {}
): Promise<ImportedSkill> {
  const curated = findSkill(idOrSlug);
  if (!curated) {
    throw new Error(
      `"${idOrSlug}" is not in the curated set. Run \`tastefield skills list\` to see what is.`
    );
  }

  let files: V1SkillFile[];
  let via: ImportedSkill["via"] = "api";
  let hash: string | null = null;

  const tryGitHub = async (): Promise<V1SkillFile[]> => {
    via = "github";
    return fetchSkillFromGitHub(curated.id, options.fetchImpl);
  };

  if (options.preferGitHub) {
    files = await tryGitHub();
  } else {
    const client = options.client ?? new SkillsClient();
    try {
      const detail = await client.getSkill(curated.id);
      if (!detail.files?.length) {
        // A skill with no snapshot yet — GitHub still has the source.
        files = await tryGitHub();
      } else {
        files = detail.files;
        hash = detail.hash;
      }
    } catch {
      // Any API failure (no token, rate limit, outage) degrades to the public
      // source rather than failing the import.
      files = await tryGitHub();
    }
  }

  const dirName = skillDirName(curated.id);
  const dir = path.join(repoRoot, CONTEXT_DIR, "skills", dirName);
  await mkdir(dir, { recursive: true });

  const written: string[] = [];
  for (const file of files) {
    // Guard against path traversal in upstream-supplied filenames.
    const safe = path
      .normalize(file.path)
      .replace(/^(\.\.(\/|\\|$))+/, "")
      .replace(/^[/\\]+/, "");
    if (!safe) continue;

    const target = path.join(dir, safe);
    if (!target.startsWith(dir)) continue;

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.contents, "utf8");
    written.push(safe);
  }

  const record: ImportedSkill = {
    id: curated.id,
    slug: curated.slug,
    source: curated.source,
    dir: path.join(CONTEXT_DIR, "skills", dirName),
    files: written,
    importedAt: new Date().toISOString(),
    via,
    hash,
  };

  const manifest = await readManifest(repoRoot);
  manifest.skills = [
    ...manifest.skills.filter((s) => s.id !== record.id),
    record,
  ];
  await writeManifest(repoRoot, manifest);

  return record;
}

export async function listImported(repoRoot: string): Promise<ImportedSkill[]> {
  return (await readManifest(repoRoot)).skills;
}
