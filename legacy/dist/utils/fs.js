import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { MethodSchema, EvalsFileSchema, FieldSchema, SkillFrontmatterSchema, } from "../schema/index.js";
export function readText(path) {
    return readFileSync(path, "utf8");
}
export function parseFrontmatter(content) {
    const parsed = matter(content);
    return { data: parsed.data, content: parsed.content };
}
export function loadSkillFrontmatter(skillMdPath) {
    const { data } = parseFrontmatter(readText(skillMdPath));
    return SkillFrontmatterSchema.parse(data);
}
export function loadField(fieldPath) {
    const yamlPath = fieldPath.endsWith("field.yaml")
        ? fieldPath
        : join(fieldPath, "field.yaml");
    const raw = parseYaml(readText(yamlPath));
    return FieldSchema.parse(raw);
}
export function loadMethod(methodPath) {
    const raw = parseYaml(readText(methodPath));
    return MethodSchema.parse(raw);
}
export function loadEvals(evalsPath) {
    const raw = JSON.parse(readText(evalsPath));
    return EvalsFileSchema.parse(raw);
}
export function writeYaml(value) {
    return stringifyYaml(value, { lineWidth: 100 });
}
export function contentHash(content) {
    return createHash("sha256").update(content).digest("hex").slice(0, 16);
}
export function fileHash(path) {
    return contentHash(readText(path));
}
export function listSkillResources(skillDir) {
    const resources = [];
    for (const entry of ["scripts", "references", "assets", "agents", "evals"]) {
        const dir = join(skillDir, entry);
        if (existsSync(dir) && statSync(dir).isDirectory()) {
            resources.push(entry);
        }
    }
    return resources;
}
export function walkDirs(root, maxDepth = 4) {
    if (!existsSync(root) || !statSync(root).isDirectory())
        return [];
    const results = [];
    function walk(dir, depth) {
        if (depth > maxDepth)
            return;
        let entries;
        try {
            entries = readdirSync(dir);
        }
        catch {
            return;
        }
        for (const entry of entries) {
            if (entry === "node_modules" || entry === ".git")
                continue;
            const full = join(dir, entry);
            let st;
            try {
                st = statSync(full);
            }
            catch {
                continue;
            }
            if (st.isDirectory()) {
                results.push(full);
                walk(full, depth + 1);
            }
        }
    }
    walk(root, 0);
    return results;
}
export function findSkillMdFiles(root, maxDepth = 5) {
    const dirs = [root, ...walkDirs(root, maxDepth)];
    const found = [];
    for (const dir of dirs) {
        for (const name of ["SKILL.md", "skill.md"]) {
            const candidate = join(dir, name);
            if (existsSync(candidate) && statSync(candidate).isFile()) {
                found.push(candidate);
            }
        }
    }
    return found;
}
export function resolveFieldRoot(cwd, maybePath) {
    const target = maybePath ? join(cwd, maybePath) : cwd;
    if (existsSync(join(target, "field.yaml")))
        return target;
    if (existsSync(target) && target.endsWith("field.yaml"))
        return dirname(target);
    throw new Error(`No field.yaml found at ${target}`);
}
export function packageRoot() {
    const here = dirname(fileURLToPath(import.meta.url));
    // src/utils -> repo root in dev; dist/utils -> repo root after build
    return join(here, "..", "..");
}
export function templatesDir() {
    return join(packageRoot(), "templates");
}
export function rel(from, to) {
    return relative(from, to) || ".";
}
//# sourceMappingURL=fs.js.map