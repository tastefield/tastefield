import { existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import { findSkillMdFiles, listSkillResources, loadSkillFrontmatter, } from "../utils/fs.js";
function uniquePaths(specs) {
    const seen = new Set();
    const out = [];
    for (const spec of specs) {
        const key = spec.path;
        if (seen.has(key))
            continue;
        seen.add(key);
        out.push(spec);
    }
    return out;
}
/** Known Skill discovery roots for Cursor, Claude, Codex, and Agents. */
export function defaultSkillRoots(opts = {}) {
    const home = opts.home ?? homedir();
    const cwd = opts.cwd ?? process.cwd();
    const specs = [
        { origin: "cursor", path: join(cwd, ".cursor", "skills") },
        { origin: "claude", path: join(cwd, ".claude", "skills") },
        { origin: "codex", path: join(cwd, ".codex", "skills") },
        { origin: "agents", path: join(cwd, ".agents", "skills") },
        { origin: "cursor", path: join(home, ".cursor", "skills") },
        { origin: "claude", path: join(home, ".claude", "skills") },
        { origin: "codex", path: join(home, ".codex", "skills") },
        { origin: "codex", path: join(home, ".agents", "skills") },
        { origin: "agents", path: join(home, ".agents", "skills") },
    ];
    if (opts.fieldPath) {
        specs.push({ origin: "local", path: join(opts.fieldPath, "skills") });
    }
    else if (opts.includeLocalFieldSkills && existsSync(join(cwd, "skills"))) {
        specs.push({ origin: "local", path: join(cwd, "skills") });
    }
    for (const extra of opts.extraRoots ?? []) {
        specs.push({ origin: "unknown", path: extra });
    }
    return uniquePaths(specs.filter((s) => existsSync(s.path)));
}
function walkAgentSkillRoots(cwd) {
    // Codex scans .agents/skills from cwd up to repo root; approximate with a few parents.
    const specs = [];
    let dir = cwd;
    for (let i = 0; i < 6; i++) {
        const agents = join(dir, ".agents", "skills");
        if (existsSync(agents)) {
            specs.push({ origin: "agents", path: agents });
        }
        const parent = dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    return specs;
}
export function discoverSkills(opts = {}) {
    const cwd = opts.cwd ?? process.cwd();
    const roots = uniquePaths([
        ...defaultSkillRoots(opts),
        ...walkAgentSkillRoots(cwd),
    ]);
    const byNameAndPath = new Map();
    for (const root of roots) {
        if (!existsSync(root.path) || !statSync(root.path).isDirectory())
            continue;
        // Prefer direct children that look like skill folders, but also find nested SKILL.md.
        const skillMdFiles = findSkillMdFiles(root.path, 3);
        for (const skillMd of skillMdFiles) {
            const skillDir = dirname(skillMd);
            try {
                const frontmatter = loadSkillFrontmatter(skillMd);
                const key = `${frontmatter.name}::${skillDir}`;
                if (byNameAndPath.has(key))
                    continue;
                const versionMeta = frontmatter.metadata?.version;
                byNameAndPath.set(key, {
                    name: frontmatter.name,
                    description: frontmatter.description,
                    path: skillDir,
                    origin: root.origin,
                    resources: listSkillResources(skillDir),
                    version: typeof versionMeta === "string" ? versionMeta : undefined,
                });
            }
            catch {
                // Skip invalid skill manifests during scan.
                const fallbackName = basename(skillDir);
                byNameAndPath.set(`${fallbackName}::${skillDir}`, {
                    name: fallbackName,
                    description: "(invalid or missing frontmatter)",
                    path: skillDir,
                    origin: root.origin,
                    resources: listSkillResources(skillDir),
                });
            }
        }
        // Also list immediate subdirs even if find missed somehow
        try {
            for (const entry of readdirSync(root.path)) {
                const skillDir = join(root.path, entry);
                if (!statSync(skillDir).isDirectory())
                    continue;
                // already covered by findSkillMdFiles when SKILL.md exists
            }
        }
        catch {
            // ignore unreadable roots
        }
    }
    return [...byNameAndPath.values()].sort((a, b) => a.name.localeCompare(b.name));
}
export function formatSkillTable(skills) {
    if (skills.length === 0) {
        return "No Skills found in known Cursor, Codex, Claude, or Agents paths.";
    }
    const rows = skills.map((s) => {
        const resources = s.resources.length ? s.resources.join(",") : "-";
        const version = s.version ?? "-";
        return `${s.name}\t${s.origin}\t${version}\t${resources}\t${s.path}`;
    });
    return ["NAME\tORIGIN\tVERSION\tRESOURCES\tPATH", ...rows].join("\n");
}
//# sourceMappingURL=index.js.map