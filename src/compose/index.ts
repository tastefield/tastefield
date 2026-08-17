import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Composition, CompositionLock } from "../schema/index.js";
import {
  fileHash,
  loadComposition,
  loadSkillFrontmatter,
  writeYaml,
} from "../utils/fs.js";

export interface ComposeResult {
  composition: Composition;
  lock: CompositionLock;
  lockPath: string;
  compositionPath: string;
}

export function resolveCompositionPath(
  fieldRoot: string,
  nameOrPath: string,
): string {
  if (nameOrPath.endsWith(".yaml") || nameOrPath.endsWith(".yml")) {
    const direct = join(fieldRoot, nameOrPath);
    if (existsSync(direct)) return direct;
    if (existsSync(nameOrPath)) return nameOrPath;
  }
  const candidates = [
    join(fieldRoot, "compositions", `${nameOrPath}.yaml`),
    join(fieldRoot, "compositions", `${nameOrPath}.yml`),
    join(fieldRoot, nameOrPath),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(`Composition not found: ${nameOrPath}`);
}

export function composeComposition(
  fieldRoot: string,
  nameOrPath: string,
): ComposeResult {
  const compositionPath = resolveCompositionPath(fieldRoot, nameOrPath);
  const composition = loadComposition(compositionPath);

  const constantsPath = join(fieldRoot, composition.constants);
  if (!existsSync(constantsPath)) {
    throw new Error(`Constants file missing: ${composition.constants}`);
  }

  const lockedSkills: CompositionLock["skills"] = [];
  for (const skill of composition.skills) {
    const skillDir = join(fieldRoot, skill.path);
    const skillMd = existsSync(join(skillDir, "SKILL.md"))
      ? join(skillDir, "SKILL.md")
      : join(skillDir, "skill.md");
    if (!existsSync(skillMd)) {
      throw new Error(`Skill missing SKILL.md at ${skill.path}`);
    }
    const frontmatter = loadSkillFrontmatter(skillMd);
    if (frontmatter.name !== skill.name) {
      throw new Error(
        `Skill name mismatch: composition declares "${skill.name}" but SKILL.md has "${frontmatter.name}"`,
      );
    }
    const versionMeta = frontmatter.metadata?.version;
    const version =
      skill.version !== "0.0.0"
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

  // Ensure precedence lists known skills
  for (const name of composition.precedence) {
    if (!composition.skills.some((s) => s.name === name)) {
      throw new Error(`Precedence references unknown skill: ${name}`);
    }
  }

  const lock: CompositionLock = {
    composition: composition.id,
    locked_at: new Date().toISOString(),
    skills: lockedSkills,
    constants: composition.constants,
    constants_hash: fileHash(constantsPath),
  };

  const lockPath = join(
    fieldRoot,
    "compositions",
    `${composition.id}.lock.json`,
  );
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n", "utf8");

  // Persist any inferred versions back into the composition YAML
  const updated = {
    ...composition,
    skills: composition.skills.map((s) => {
      const locked = lockedSkills.find((l) => l.name === s.name);
      return locked ? { ...s, version: locked.version } : s;
    }),
  };
  writeFileSync(compositionPath, writeYaml(updated), "utf8");

  return {
    composition: updated,
    lock,
    lockPath,
    compositionPath,
  };
}
