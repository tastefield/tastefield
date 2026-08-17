import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { resolveCompositionPath } from "../compose/index.js";
import type { Composition } from "../schema/index.js";
import { loadComposition, readText } from "../utils/fs.js";

export type ExportTarget = "cursor" | "codex" | "claude" | "generic";

export interface ExportOptions {
  fieldRoot: string;
  composition: string;
  outDir: string;
  target?: ExportTarget;
}

export interface ExportResult {
  outDir: string;
  skillMdPath: string;
  composition: Composition;
}

function orderedSkills(composition: Composition): Composition["skills"] {
  if (composition.precedence.length === 0) {
    // Overrides first, then primary, then supporting
    const rank = { override: 0, primary: 1, supporting: 2 } as const;
    return [...composition.skills].sort(
      (a, b) => rank[a.role] - rank[b.role] || a.name.localeCompare(b.name),
    );
  }
  const byName = new Map(composition.skills.map((s) => [s.name, s]));
  const ordered: Composition["skills"] = [];
  for (const name of composition.precedence) {
    const skill = byName.get(name);
    if (skill) ordered.push(skill);
  }
  for (const skill of composition.skills) {
    if (!composition.precedence.includes(skill.name)) ordered.push(skill);
  }
  return ordered;
}

function buildOrchestratorMarkdown(
  composition: Composition,
  fieldRoot: string,
  relativeConstants: string,
  skillEntries: Array<{
    name: string;
    role: string;
    version: string;
    relativeSkillMd: string;
    relativeDir: string;
  }>,
  target: ExportTarget,
): string {
  const skillList = skillEntries
    .map(
      (s) =>
        `   - **${s.name}** (${s.role}, v${s.version}) — load \`${s.relativeSkillMd}\``,
    )
    .join("\n");

  const targetNote =
    target === "generic"
      ? "This Skill was exported by Tastefield for any Agent Skills–compatible host."
      : `This Skill was exported by Tastefield for **${target}**.`;

  return `---
name: ${composition.id}
description: ${composition.description.trim().replace(/\n+/g, " ")}
metadata:
  tastefield:
    kind: composition
    composition_id: ${composition.id}
    composition_version: "${composition.version}"
    target: ${target}
---

# ${composition.name}

${targetNote}

A **Composition** is a reusable creative system: an executable arrangement of Skills, Constants, knowledge, examples, and evals. Do **not** treat this file as a finished artifact — follow the load order below.

## Progressive load order

1. Read Constants first: \`${relativeConstants}\`
2. Load subordinate Skills in precedence order (do not invent merged instructions):
${skillList || "   _(no subordinate Skills declared)_"}
3. When needed, consult Field sources and examples listed under \`references/\`.
4. Respect Constants over any Skill when instructions conflict. Higher precedence Skills override lower ones only where Constants are silent.

## Operating rules

- Never concatenate or rewrite subordinate Skill bodies into this file.
- Load each Skill's \`SKILL.md\` only when that stage of the procedure begins.
- Load \`references/\` material on demand — not all at once.
- If a claim requires evidence, use Field sources before improvising.

## Constants (summary pointer)

Full Constants live at \`${relativeConstants}\`. Treat them as inviolable.

## Subordinate Skills

| Skill | Role | Version | Path |
| --- | --- | --- | --- |
${
  skillEntries
    .map(
      (s) =>
        `| ${s.name} | ${s.role} | ${s.version} | \`${s.relativeDir}\` |`,
    )
    .join("\n") || "| _(none)_ | | | |"
}

## Field knowledge

See \`references/field-map.md\` for source and example globs from the originating Field.
`;
}

function buildFieldMap(composition: Composition): string {
  return `# Field map

This Composition was exported from a Tastefield Field.

## Sources

${composition.sources.map((s) => `- \`${s}\``).join("\n") || "- _(none)_"}

## Examples

- Accepted: \`${composition.examples.accepted}\`
- Rejected: \`${composition.examples.rejected}\`

## Evals

- \`${composition.evals}\`

Load these paths from the Field root when evaluating or grounding output. Prefer accepted examples as positive style references; treat rejected examples as anti-patterns.
`;
}

export function exportComposition(opts: ExportOptions): ExportResult {
  const compositionPath = resolveCompositionPath(
    opts.fieldRoot,
    opts.composition,
  );
  const composition = loadComposition(compositionPath);
  const target = opts.target ?? "generic";
  const outDir = opts.outDir;

  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(outDir, "references"), { recursive: true });
  mkdirSync(join(outDir, "skills"), { recursive: true });

  // Copy constants into references
  const constantsSrc = join(opts.fieldRoot, composition.constants);
  if (!existsSync(constantsSrc)) {
    throw new Error(`Constants missing: ${composition.constants}`);
  }
  const constantsDest = join(outDir, "references", "constants.md");
  writeFileSync(constantsDest, readText(constantsSrc), "utf8");

  const skillEntries: Array<{
    name: string;
    role: string;
    version: string;
    relativeSkillMd: string;
    relativeDir: string;
  }> = [];

  for (const skill of orderedSkills(composition)) {
    const skillDir = join(opts.fieldRoot, skill.path);
    const skillMdName = existsSync(join(skillDir, "SKILL.md"))
      ? "SKILL.md"
      : "skill.md";
    const skillMd = join(skillDir, skillMdName);
    if (!existsSync(skillMd)) {
      throw new Error(`Cannot export; skill missing: ${skill.path}`);
    }

    const destDir = join(outDir, "skills", skill.name);
    mkdirSync(destDir, { recursive: true });
    // Copy the skill folder shallowly (SKILL.md + optional resource dirs)
    cpSync(skillDir, destDir, { recursive: true });

    const relativeDir = join("skills", skill.name);
    skillEntries.push({
      name: skill.name,
      role: skill.role,
      version: skill.version,
      relativeSkillMd: join(relativeDir, skillMdName),
      relativeDir,
    });
  }

  writeFileSync(
    join(outDir, "references", "field-map.md"),
    buildFieldMap(composition),
    "utf8",
  );

  // Optionally copy evals for portability
  const evalsSrc = join(opts.fieldRoot, composition.evals);
  if (existsSync(evalsSrc)) {
    mkdirSync(join(outDir, "evals"), { recursive: true });
    writeFileSync(
      join(outDir, "evals", "evals.json"),
      readText(evalsSrc),
      "utf8",
    );
  }

  const skillMdBody = buildOrchestratorMarkdown(
    composition,
    opts.fieldRoot,
    "references/constants.md",
    skillEntries,
    target,
  );
  const skillMdPath = join(outDir, "SKILL.md");
  writeFileSync(skillMdPath, skillMdBody, "utf8");

  // Manifest for Tastefield re-import / debugging
  writeFileSync(
    join(outDir, "tastefield.export.json"),
    JSON.stringify(
      {
        composition_id: composition.id,
        composition_version: composition.version,
        target,
        exported_at: new Date().toISOString(),
        field_root: relative(outDir, opts.fieldRoot),
        skills: skillEntries.map((s) => ({
          name: s.name,
          role: s.role,
          version: s.version,
          path: s.relativeDir,
        })),
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  return { outDir, skillMdPath, composition };
}

export function defaultExportDir(
  fieldRoot: string,
  compositionId: string,
  target: ExportTarget,
): string {
  return join(fieldRoot, "exports", `${compositionId}-${target}`);
}

export function suggestInstallPath(
  compositionId: string,
  target: ExportTarget,
): string {
  switch (target) {
    case "cursor":
      return join(".cursor", "skills", compositionId);
    case "claude":
      return join(".claude", "skills", compositionId);
    case "codex":
      return join(".codex", "skills", compositionId);
    default:
      return join("skills", compositionId);
  }
}

export function exportLabel(outDir: string): string {
  return `Exported Composition Skill → ${outDir} (${basename(outDir)})`;
}
