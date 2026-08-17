import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { CONTEXT_DIR } from "../compile/index.js";
import { SkillsClient, fetchSkillFromGitHub } from "./client.js";
import { findSkill } from "./curate.js";
const MANIFEST = "manifest.json";
function skillDirName(id) {
    return id.replace(/\//g, "__");
}
async function readManifest(repoRoot) {
    const file = path.join(repoRoot, CONTEXT_DIR, "skills", MANIFEST);
    try {
        return JSON.parse(await readFile(file, "utf8"));
    }
    catch {
        return { version: "0.1", skills: [] };
    }
}
async function writeManifest(repoRoot, manifest) {
    const dir = path.join(repoRoot, CONTEXT_DIR, "skills");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}
export async function importSkill(repoRoot, idOrSlug, options = {}) {
    const curated = findSkill(idOrSlug);
    if (!curated) {
        throw new Error(`"${idOrSlug}" is not in the curated set. Run \`tastefield skills list\` to see what is.`);
    }
    let files;
    let via = "api";
    let hash = null;
    const tryGitHub = async () => {
        via = "github";
        return fetchSkillFromGitHub(curated.id, options.fetchImpl);
    };
    if (options.preferGitHub) {
        files = await tryGitHub();
    }
    else {
        const client = options.client ?? new SkillsClient();
        try {
            const detail = await client.getSkill(curated.id);
            if (!detail.files?.length) {
                // A skill with no snapshot yet — GitHub still has the source.
                files = await tryGitHub();
            }
            else {
                files = detail.files;
                hash = detail.hash;
            }
        }
        catch {
            // Any API failure (no token, rate limit, outage) degrades to the public
            // source rather than failing the import.
            files = await tryGitHub();
        }
    }
    const dirName = skillDirName(curated.id);
    const dir = path.join(repoRoot, CONTEXT_DIR, "skills", dirName);
    await mkdir(dir, { recursive: true });
    const written = [];
    for (const file of files) {
        // Guard against path traversal in upstream-supplied filenames.
        const safe = path
            .normalize(file.path)
            .replace(/^(\.\.(\/|\\|$))+/, "")
            .replace(/^[/\\]+/, "");
        if (!safe)
            continue;
        const target = path.join(dir, safe);
        if (!target.startsWith(dir))
            continue;
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, file.contents, "utf8");
        written.push(safe);
    }
    const record = {
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
export async function listImported(repoRoot) {
    return (await readManifest(repoRoot)).skills;
}
//# sourceMappingURL=import.js.map