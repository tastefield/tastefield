import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileHash, loadMethod, loadSkillFrontmatter, writeYaml, } from "../utils/fs.js";
export function resolveMethodPath(fieldRoot, nameOrPath) {
    if (nameOrPath.endsWith(".yaml") || nameOrPath.endsWith(".yml")) {
        const direct = join(fieldRoot, nameOrPath);
        if (existsSync(direct))
            return direct;
        if (existsSync(nameOrPath))
            return nameOrPath;
    }
    const candidates = [
        join(fieldRoot, "methods", `${nameOrPath}.yaml`),
        join(fieldRoot, "methods", `${nameOrPath}.yml`),
        join(fieldRoot, nameOrPath),
    ];
    for (const c of candidates) {
        if (existsSync(c))
            return c;
    }
    throw new Error(`Method not found: ${nameOrPath}`);
}
/** Validate a Method and lock participating Skill versions. */
export function lockMethod(fieldRoot, nameOrPath) {
    const methodPath = resolveMethodPath(fieldRoot, nameOrPath);
    const method = loadMethod(methodPath);
    const rulesPath = join(fieldRoot, method.rules);
    if (!existsSync(rulesPath)) {
        throw new Error(`Rules file missing: ${method.rules}`);
    }
    const lockedSkills = [];
    for (const skill of method.skills) {
        const skillDir = join(fieldRoot, skill.path);
        const skillMd = existsSync(join(skillDir, "SKILL.md"))
            ? join(skillDir, "SKILL.md")
            : join(skillDir, "skill.md");
        if (!existsSync(skillMd)) {
            throw new Error(`Skill missing SKILL.md at ${skill.path}`);
        }
        const frontmatter = loadSkillFrontmatter(skillMd);
        if (frontmatter.name !== skill.name) {
            throw new Error(`Skill name mismatch: method declares "${skill.name}" but SKILL.md has "${frontmatter.name}"`);
        }
        const versionMeta = frontmatter.metadata?.version;
        const version = skill.version !== "0.0.0"
            ? skill.version
            : typeof versionMeta === "string"
                ? versionMeta
                : skill.version;
        lockedSkills.push({
            name: skill.name,
            path: skill.path,
            version,
            origin: skill.origin,
            content_hash: fileHash(skillMd),
        });
    }
    for (const name of method.precedence) {
        if (!method.skills.some((s) => s.name === name)) {
            throw new Error(`Precedence references unknown skill: ${name}`);
        }
    }
    const lock = {
        method: method.id,
        locked_at: new Date().toISOString(),
        skills: lockedSkills,
        rules: method.rules,
        rules_hash: fileHash(rulesPath),
    };
    const lockPath = join(fieldRoot, "methods", `${method.id}.lock.json`);
    writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n", "utf8");
    const updated = {
        ...method,
        skills: method.skills.map((s) => {
            const locked = lockedSkills.find((l) => l.name === s.name);
            return locked ? { ...s, version: locked.version } : s;
        }),
    };
    writeFileSync(methodPath, writeYaml(updated), "utf8");
    return {
        method: updated,
        lock,
        lockPath,
        methodPath,
    };
}
//# sourceMappingURL=index.js.map