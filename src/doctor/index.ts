import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { resolveCompositionPath } from "../compose/index.js";
import type { Composition, DiscoveredSkill } from "../schema/index.js";
import {
  loadComposition,
  loadField,
  loadSkillFrontmatter,
} from "../utils/fs.js";

export type DoctorSeverity = "error" | "warning" | "info";

export interface DoctorFinding {
  severity: DoctorSeverity;
  code: string;
  message: string;
  path?: string;
}

export interface DoctorReport {
  ok: boolean;
  findings: DoctorFinding[];
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function doctorField(
  fieldRoot: string,
  discovered: DiscoveredSkill[] = [],
): DoctorReport {
  const findings: DoctorFinding[] = [];

  if (!existsSync(join(fieldRoot, "field.yaml"))) {
    findings.push({
      severity: "error",
      code: "missing-field",
      message: "field.yaml not found",
      path: fieldRoot,
    });
    return { ok: false, findings };
  }

  const field = loadField(fieldRoot);

  if (!existsSync(join(fieldRoot, "constants.md"))) {
    findings.push({
      severity: "error",
      code: "missing-constants",
      message: "constants.md is required",
      path: join(fieldRoot, "constants.md"),
    });
  }

  // Field skill refs
  for (const ref of field.skills) {
    const skillDir = join(fieldRoot, ref.path);
    const skillMd = existsSync(join(skillDir, "SKILL.md"))
      ? join(skillDir, "SKILL.md")
      : join(skillDir, "skill.md");
    if (!existsSync(skillMd) && !existsSync(ref.path)) {
      findings.push({
        severity: "error",
        code: "broken-skill-ref",
        message: `Skill ref "${ref.name}" path not found: ${ref.path}`,
        path: ref.path,
      });
    }
  }

  // Duplicate names among discovered skills
  const byName = new Map<string, DiscoveredSkill[]>();
  for (const s of discovered) {
    const list = byName.get(s.name) ?? [];
    list.push(s);
    byName.set(s.name, list);
  }
  for (const [name, list] of byName) {
    if (list.length > 1) {
      findings.push({
        severity: "warning",
        code: "duplicate-skill-name",
        message: `Skill name "${name}" appears ${list.length} times: ${list.map((s) => s.path).join(", ")}`,
      });
    }
  }

  // Overlapping triggers (description similarity)
  for (let i = 0; i < discovered.length; i++) {
    for (let j = i + 1; j < discovered.length; j++) {
      const a = discovered[i]!;
      const b = discovered[j]!;
      if (a.name === b.name) continue;
      const score = jaccard(tokenize(a.description), tokenize(b.description));
      if (score >= 0.45) {
        findings.push({
          severity: "warning",
          code: "overlapping-trigger",
          message: `Skills "${a.name}" and "${b.name}" have similar triggers (similarity ${score.toFixed(2)})`,
        });
      }
    }
  }

  // Compositions
  const compositionsDir = join(fieldRoot, "compositions");
  if (existsSync(compositionsDir)) {
    for (const file of readdirSync(compositionsDir)) {
      if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
      if (file.endsWith(".lock.json")) continue;
      try {
        const composition = loadComposition(join(compositionsDir, file));
        findings.push(...doctorComposition(fieldRoot, composition, file));
      } catch (err) {
        findings.push({
          severity: "error",
          code: "invalid-composition",
          message: `Failed to load ${file}: ${err instanceof Error ? err.message : String(err)}`,
          path: join(compositionsDir, file),
        });
      }
    }
  }

  const ok = !findings.some((f) => f.severity === "error");
  return { ok, findings };
}

export function doctorComposition(
  fieldRoot: string,
  composition: Composition,
  pathHint?: string,
): DoctorFinding[] {
  const findings: DoctorFinding[] = [];
  const constantsPath = join(fieldRoot, composition.constants);
  if (!existsSync(constantsPath)) {
    findings.push({
      severity: "error",
      code: "missing-constants",
      message: `Composition "${composition.id}" constants missing: ${composition.constants}`,
      path: pathHint,
    });
  }

  const names = new Set<string>();
  for (const skill of composition.skills) {
    if (names.has(skill.name)) {
      findings.push({
        severity: "error",
        code: "duplicate-responsibility",
        message: `Composition "${composition.id}" lists skill "${skill.name}" more than once`,
        path: pathHint,
      });
    }
    names.add(skill.name);

    const skillDir = join(fieldRoot, skill.path);
    const skillMd = existsSync(join(skillDir, "SKILL.md"))
      ? join(skillDir, "SKILL.md")
      : join(skillDir, "skill.md");
    if (!existsSync(skillMd)) {
      findings.push({
        severity: "error",
        code: "broken-skill-ref",
        message: `Composition "${composition.id}" skill "${skill.name}" missing at ${skill.path}`,
        path: pathHint,
      });
    } else {
      try {
        const fm = loadSkillFrontmatter(skillMd);
        if (fm.name !== skill.name) {
          findings.push({
            severity: "error",
            code: "name-mismatch",
            message: `Composition declares "${skill.name}" but SKILL.md has "${fm.name}"`,
            path: skill.path,
          });
        }
      } catch (err) {
        findings.push({
          severity: "error",
          code: "invalid-skill",
          message: `Invalid SKILL.md for "${skill.name}": ${err instanceof Error ? err.message : String(err)}`,
          path: skill.path,
        });
      }
    }
  }

  for (const name of composition.precedence) {
    if (!names.has(name)) {
      findings.push({
        severity: "error",
        code: "broken-precedence",
        message: `Precedence entry "${name}" is not a participating skill`,
        path: pathHint,
      });
    }
  }

  // Obvious contradiction heuristic: override role below a lower-precedence skill in list order
  const overrideSkills = composition.skills.filter((s) => s.role === "override");
  if (overrideSkills.length > 1) {
    findings.push({
      severity: "warning",
      code: "multiple-overrides",
      message: `Composition "${composition.id}" has multiple override-role skills; declare explicit precedence`,
      path: pathHint,
    });
  }

  const evalsPath = join(fieldRoot, composition.evals);
  if (!existsSync(evalsPath)) {
    findings.push({
      severity: "warning",
      code: "missing-evals",
      message: `Evals file missing: ${composition.evals}`,
      path: pathHint,
    });
  }

  return findings;
}

export function doctorCompositionByName(
  fieldRoot: string,
  nameOrPath: string,
): DoctorReport {
  const path = resolveCompositionPath(fieldRoot, nameOrPath);
  const composition = loadComposition(path);
  const findings = doctorComposition(fieldRoot, composition, path);
  return {
    ok: !findings.some((f) => f.severity === "error"),
    findings,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  if (report.findings.length === 0) {
    return "doctor: ok — no issues found";
  }
  const lines = report.findings.map(
    (f) => `${f.severity.toUpperCase()} [${f.code}] ${f.message}`,
  );
  lines.push("");
  lines.push(report.ok ? "doctor: ok (warnings only)" : "doctor: failed");
  return lines.join("\n");
}
