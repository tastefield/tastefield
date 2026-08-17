import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { resolveMethodPath } from "../method/index.js";
import type { Method } from "../schema/index.js";
import { loadMethod, readText } from "../utils/fs.js";

export type ExportTarget = "cursor" | "codex" | "claude" | "generic";

export interface ExportOptions {
  fieldRoot: string;
  method: string;
  outDir: string;
  target?: ExportTarget;
}

export interface ExportResult {
  outDir: string;
  skillMdPath: string;
  method: Method;
}

function orderedSkills(method: Method): Method["skills"] {
  if (method.precedence.length === 0) {
    const rank = { override: 0, primary: 1, supporting: 2 } as const;
    return [...method.skills].sort(
      (a, b) => rank[a.role] - rank[b.role] || a.name.localeCompare(b.name),
    );
  }
  const byName = new Map(method.skills.map((s) => [s.name, s]));
  const ordered: Method["skills"] = [];
  for (const name of method.precedence) {
    const skill = byName.get(name);
    if (skill) ordered.push(skill);
  }
  for (const skill of method.skills) {
    if (!method.precedence.includes(skill.name)) ordered.push(skill);
  }
  return ordered;
}

function buildOrchestratorMarkdown(
  method: Method,
  relativeRules: string,
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
name: ${method.id}
description: ${method.description.trim().replace(/\n+/g, " ")}
metadata:
  tastefield:
    kind: method
    method_id: ${method.id}
    method_version: "${method.version}"
    target: ${target}
---

# ${method.name}

${targetNote}

A **Method** is your structured expertise—Skills, Rules, and knowledge—packaged into an executable workflow. Follow the load order below.

## Progressive load order

1. Read Rules first: \`${relativeRules}\`
2. Load subordinate Skills in precedence order (do not invent merged instructions):
${skillList || "   _(no subordinate Skills declared)_"}
3. When needed, consult Field sources and examples listed under \`references/\`.
4. Respect Rules over any Skill when instructions conflict. Higher precedence Skills override lower ones only where Rules are silent.

## Operating rules

- Never concatenate or rewrite subordinate Skill bodies into this file.
- Load each Skill's \`SKILL.md\` only when that stage of the procedure begins.
- Load \`references/\` material on demand — not all at once.
- If a claim requires evidence, use Field sources before improvising.

## Rules (summary pointer)

Full Rules live at \`${relativeRules}\`. Treat them as inviolable.

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

function buildFieldMap(method: Method): string {
  return `# Field map

This Method was exported from a Tastefield Field.

## Sources

${method.sources.map((s) => `- \`${s}\``).join("\n") || "- _(none)_"}

## Examples

- Accepted: \`${method.examples.accepted}\`
- Rejected: \`${method.examples.rejected}\`

## Evals

- \`${method.evals}\`

Load these paths from the Field root when evaluating or grounding output. Prefer accepted examples as positive style references; treat rejected examples as anti-patterns.
`;
}

export function exportMethod(opts: ExportOptions): ExportResult {
  const methodPath = resolveMethodPath(opts.fieldRoot, opts.method);
  const method = loadMethod(methodPath);
  const target = opts.target ?? "generic";
  const outDir = opts.outDir;

  mkdirSync(outDir, { recursive: true });
  mkdirSync(join(outDir, "references"), { recursive: true });
  mkdirSync(join(outDir, "skills"), { recursive: true });

  const rulesSrc = join(opts.fieldRoot, method.rules);
  if (!existsSync(rulesSrc)) {
    throw new Error(`Rules missing: ${method.rules}`);
  }
  const rulesDest = join(outDir, "references", "rules.md");
  writeFileSync(rulesDest, readText(rulesSrc), "utf8");

  const skillEntries: Array<{
    name: string;
    role: string;
    version: string;
    relativeSkillMd: string;
    relativeDir: string;
  }> = [];

  for (const skill of orderedSkills(method)) {
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
    buildFieldMap(method),
    "utf8",
  );

  const evalsSrc = join(opts.fieldRoot, method.evals);
  if (existsSync(evalsSrc)) {
    mkdirSync(join(outDir, "evals"), { recursive: true });
    writeFileSync(
      join(outDir, "evals", "evals.json"),
      readText(evalsSrc),
      "utf8",
    );
  }

  const skillMdBody = buildOrchestratorMarkdown(
    method,
    "references/rules.md",
    skillEntries,
    target,
  );
  const skillMdPath = join(outDir, "SKILL.md");
  writeFileSync(skillMdPath, skillMdBody, "utf8");

  writeFileSync(
    join(outDir, "tastefield.export.json"),
    JSON.stringify(
      {
        method_id: method.id,
        method_version: method.version,
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

  return { outDir, skillMdPath, method };
}

export function defaultExportDir(
  fieldRoot: string,
  methodId: string,
  target: ExportTarget,
): string {
  return join(fieldRoot, "exports", `${methodId}-${target}`);
}

export function suggestInstallPath(
  methodId: string,
  target: ExportTarget,
): string {
  switch (target) {
    case "cursor":
      return join(".cursor", "skills", methodId);
    case "claude":
      return join(".claude", "skills", methodId);
    case "codex":
      return join(".codex", "skills", methodId);
    default:
      return join("skills", methodId);
  }
}

export function exportLabel(outDir: string): string {
  return `Exported Method Skill → ${outDir} (${basename(outDir)})`;
}
