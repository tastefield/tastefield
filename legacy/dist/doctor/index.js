import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { resolveMethodPath } from "../method/index.js";
import { loadMethod, loadField, loadSkillFrontmatter, } from "../utils/fs.js";
function tokenize(text) {
    return new Set(text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2));
}
function jaccard(a, b) {
    if (a.size === 0 && b.size === 0)
        return 0;
    let inter = 0;
    for (const t of a)
        if (b.has(t))
            inter++;
    const union = a.size + b.size - inter;
    return union === 0 ? 0 : inter / union;
}
export function doctorField(fieldRoot, discovered = []) {
    const findings = [];
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
    if (!existsSync(join(fieldRoot, "rules.md"))) {
        findings.push({
            severity: "error",
            code: "missing-rules",
            message: "rules.md is required",
            path: join(fieldRoot, "rules.md"),
        });
    }
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
    const byName = new Map();
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
    for (let i = 0; i < discovered.length; i++) {
        for (let j = i + 1; j < discovered.length; j++) {
            const a = discovered[i];
            const b = discovered[j];
            if (a.name === b.name)
                continue;
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
    const methodsDir = join(fieldRoot, "methods");
    if (existsSync(methodsDir)) {
        for (const file of readdirSync(methodsDir)) {
            if (!file.endsWith(".yaml") && !file.endsWith(".yml"))
                continue;
            try {
                const method = loadMethod(join(methodsDir, file));
                findings.push(...doctorMethod(fieldRoot, method, file));
            }
            catch (err) {
                findings.push({
                    severity: "error",
                    code: "invalid-method",
                    message: `Failed to load ${file}: ${err instanceof Error ? err.message : String(err)}`,
                    path: join(methodsDir, file),
                });
            }
        }
    }
    const ok = !findings.some((f) => f.severity === "error");
    return { ok, findings };
}
export function doctorMethod(fieldRoot, method, pathHint) {
    const findings = [];
    const rulesPath = join(fieldRoot, method.rules);
    if (!existsSync(rulesPath)) {
        findings.push({
            severity: "error",
            code: "missing-rules",
            message: `Method "${method.id}" rules missing: ${method.rules}`,
            path: pathHint,
        });
    }
    const names = new Set();
    for (const skill of method.skills) {
        if (names.has(skill.name)) {
            findings.push({
                severity: "error",
                code: "duplicate-responsibility",
                message: `Method "${method.id}" lists skill "${skill.name}" more than once`,
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
                message: `Method "${method.id}" skill "${skill.name}" missing at ${skill.path}`,
                path: pathHint,
            });
        }
        else {
            try {
                const fm = loadSkillFrontmatter(skillMd);
                if (fm.name !== skill.name) {
                    findings.push({
                        severity: "error",
                        code: "name-mismatch",
                        message: `Method declares "${skill.name}" but SKILL.md has "${fm.name}"`,
                        path: skill.path,
                    });
                }
            }
            catch (err) {
                findings.push({
                    severity: "error",
                    code: "invalid-skill",
                    message: `Invalid SKILL.md for "${skill.name}": ${err instanceof Error ? err.message : String(err)}`,
                    path: skill.path,
                });
            }
        }
    }
    for (const name of method.precedence) {
        if (!names.has(name)) {
            findings.push({
                severity: "error",
                code: "broken-precedence",
                message: `Precedence entry "${name}" is not a participating skill`,
                path: pathHint,
            });
        }
    }
    const overrideSkills = method.skills.filter((s) => s.role === "override");
    if (overrideSkills.length > 1) {
        findings.push({
            severity: "warning",
            code: "multiple-overrides",
            message: `Method "${method.id}" has multiple override-role skills; declare explicit precedence`,
            path: pathHint,
        });
    }
    const evalsPath = join(fieldRoot, method.evals);
    if (!existsSync(evalsPath)) {
        findings.push({
            severity: "warning",
            code: "missing-evals",
            message: `Evals file missing: ${method.evals}`,
            path: pathHint,
        });
    }
    return findings;
}
export function doctorMethodByName(fieldRoot, nameOrPath) {
    const path = resolveMethodPath(fieldRoot, nameOrPath);
    const method = loadMethod(path);
    const findings = doctorMethod(fieldRoot, method, path);
    return {
        ok: !findings.some((f) => f.severity === "error"),
        findings,
    };
}
export function formatDoctorReport(report) {
    if (report.findings.length === 0) {
        return "doctor: ok — no issues found";
    }
    const lines = report.findings.map((f) => `${f.severity.toUpperCase()} [${f.code}] ${f.message}`);
    lines.push("");
    lines.push(report.ok ? "doctor: ok (warnings only)" : "doctor: failed");
    return lines.join("\n");
}
//# sourceMappingURL=index.js.map