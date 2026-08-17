import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import {
  MethodSchema,
  EvalsFileSchema,
  FieldSchema,
  SkillFrontmatterSchema,
  type Method,
  type EvalsFile,
  type Field,
  type SkillFrontmatter,
} from "../schema/index.js";

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function parseFrontmatter(content: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const parsed = matter(content);
  return { data: parsed.data as Record<string, unknown>, content: parsed.content };
}

export function loadSkillFrontmatter(skillMdPath: string): SkillFrontmatter {
  const { data } = parseFrontmatter(readText(skillMdPath));
  return SkillFrontmatterSchema.parse(data);
}

export function loadField(fieldPath: string): Field {
  const yamlPath = fieldPath.endsWith("field.yaml")
    ? fieldPath
    : join(fieldPath, "field.yaml");
  const raw = parseYaml(readText(yamlPath));
  return FieldSchema.parse(raw);
}

export function loadMethod(methodPath: string): Method {
  const raw = parseYaml(readText(methodPath));
  return MethodSchema.parse(raw);
}

export function loadEvals(evalsPath: string): EvalsFile {
  const raw = JSON.parse(readText(evalsPath)) as unknown;
  return EvalsFileSchema.parse(raw);
}

export function writeYaml(value: unknown): string {
  return stringifyYaml(value, { lineWidth: 100 });
}

export function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

export function fileHash(path: string): string {
  return contentHash(readText(path));
}

export function listSkillResources(skillDir: string): string[] {
  const resources: string[] = [];
  for (const entry of ["scripts", "references", "assets", "agents", "evals"]) {
    const dir = join(skillDir, entry);
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      resources.push(entry);
    }
  }
  return resources;
}

export function walkDirs(root: string, maxDepth = 4): string[] {
  if (!existsSync(root) || !statSync(root).isDirectory()) return [];
  const results: string[] = [];

  function walk(dir: string, depth: number): void {
    if (depth > maxDepth) return;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry === "node_modules" || entry === ".git") continue;
      const full = join(dir, entry);
      let st;
      try {
        st = statSync(full);
      } catch {
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

export function findSkillMdFiles(root: string, maxDepth = 5): string[] {
  const dirs = [root, ...walkDirs(root, maxDepth)];
  const found: string[] = [];
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

export function resolveFieldRoot(cwd: string, maybePath?: string): string {
  const target = maybePath ? join(cwd, maybePath) : cwd;
  if (existsSync(join(target, "field.yaml"))) return target;
  if (existsSync(target) && target.endsWith("field.yaml")) return dirname(target);
  throw new Error(`No field.yaml found at ${target}`);
}

export function packageRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // src/utils -> repo root in dev; dist/utils -> repo root after build
  return join(here, "..", "..");
}

export function templatesDir(): string {
  return join(packageRoot(), "templates");
}

export function rel(from: string, to: string): string {
  return relative(from, to) || ".";
}
