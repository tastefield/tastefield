#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { Rule } from "../types.js";
import { score, check } from "../check/index.js";
import { CONTEXT_DIR } from "../compile/index.js";
import { TASKS } from "./tasks.js";

/**
 * Benchmark harness — the answer to "how do we know governance actually worked?"
 *
 * This intentionally does NOT call a model. It scores generations you collect
 * yourself, which keeps the measurement honest and reproducible: whoever runs it
 * can inspect exactly what was generated and re-score it.
 *
 * Expected layout:
 *
 *   bench-runs/
 *     baseline/           # agent WITHOUT the Tastefield MCP server connected
 *       pricing-card.tsx
 *       settings-form.tsx
 *     governed/           # same prompts, same model, MCP server connected
 *       pricing-card.tsx
 *       settings-form.tsx
 *
 * Run:  node dist/bench/run.js --runs ./bench-runs --dir <repo-with-.tastefield>
 *
 * The headline metric is violation density (violations per 100 lines) rather than
 * a raw count, so a governed run isn't rewarded merely for producing less code.
 */

interface ArmResult {
  name: string;
  files: number;
  lines: number;
  errors: number;
  warnings: number;
  density: number;
  perRule: Map<string, number>;
}

async function loadRules(repoRoot: string): Promise<Rule[]> {
  const raw = await readFile(
    path.join(repoRoot, CONTEXT_DIR, "rules.json"),
    "utf8"
  );
  return (JSON.parse(raw).rules ?? []) as Rule[];
}

async function scoreArm(dir: string, rules: Rule[], name: string): Promise<ArmResult> {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    throw new Error(`Missing benchmark arm directory: ${dir}`);
  }

  const result: ArmResult = {
    name,
    files: 0,
    lines: 0,
    errors: 0,
    warnings: 0,
    density: 0,
    perRule: new Map(),
  };

  for (const entry of entries) {
    if (!/\.(tsx|jsx|ts|js|css|html)$/.test(entry)) continue;

    const content = await readFile(path.join(dir, entry), "utf8");
    const s = score(content, rules);

    result.files++;
    result.lines += content.split("\n").length;
    result.errors += s.errors;
    result.warnings += s.warnings;

    for (const v of check(content, rules)) {
      result.perRule.set(v.ruleId, (result.perRule.get(v.ruleId) ?? 0) + 1);
    }
  }

  const total = result.errors + result.warnings;
  result.density = Number(
    ((total / Math.max(result.lines, 1)) * 100).toFixed(2)
  );

  return result;
}

function pct(before: number, after: number): string {
  if (before === 0) return after === 0 ? "n/a (both clean)" : "regression";
  const change = ((before - after) / before) * 100;
  return `${change >= 0 ? "-" : "+"}${Math.abs(change).toFixed(1)}%`;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const get = (flag: string, fallback: string): string => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
  };

  const runsDir = path.resolve(get("--runs", "./bench-runs"));
  const repoRoot = path.resolve(get("--dir", process.cwd()));

  let rules: Rule[];
  try {
    rules = await loadRules(repoRoot);
  } catch {
    process.stderr.write(
      `No compiled rules at ${path.join(repoRoot, CONTEXT_DIR)}. Run \`tastefield init\` there first.\n`
    );
    process.exitCode = 1;
    return;
  }

  const baseline = await scoreArm(path.join(runsDir, "baseline"), rules, "baseline");
  const governed = await scoreArm(path.join(runsDir, "governed"), rules, "governed");

  if (baseline.files !== governed.files) {
    process.stderr.write(
      `Warning: arms have different file counts (${baseline.files} vs ${governed.files}). ` +
        `Comparison assumes the same prompts were run in both.\n\n`
    );
  }

  const line = "─".repeat(64);
  process.stdout.write(`\n${line}\n`);
  process.stdout.write(`Tastefield benchmark — ${TASKS.length} tasks defined\n`);
  process.stdout.write(`Rules applied: ${rules.filter((r) => r.pattern).length} enforceable\n`);
  process.stdout.write(`${line}\n\n`);

  process.stdout.write(
    `${"".padEnd(14)}${"files".padStart(7)}${"lines".padStart(8)}${"errors".padStart(9)}${"warns".padStart(8)}${"density".padStart(10)}\n`
  );
  for (const arm of [baseline, governed]) {
    process.stdout.write(
      `${arm.name.padEnd(14)}${String(arm.files).padStart(7)}${String(arm.lines).padStart(8)}` +
        `${String(arm.errors).padStart(9)}${String(arm.warnings).padStart(8)}${String(arm.density).padStart(10)}\n`
    );
  }

  process.stdout.write(`\n${line}\n`);
  process.stdout.write(`Error reduction:     ${pct(baseline.errors, governed.errors)}\n`);
  process.stdout.write(`Density reduction:   ${pct(baseline.density, governed.density)}\n`);
  process.stdout.write(`${line}\n\n`);

  const allRuleIds = new Set([...baseline.perRule.keys(), ...governed.perRule.keys()]);
  if (allRuleIds.size) {
    process.stdout.write(`Per-rule breakdown\n`);
    for (const id of [...allRuleIds].sort()) {
      const b = baseline.perRule.get(id) ?? 0;
      const g = governed.perRule.get(id) ?? 0;
      process.stdout.write(
        `  ${id.padEnd(32)} ${String(b).padStart(4)} → ${String(g).padStart(4)}  ${pct(b, g)}\n`
      );
    }
    process.stdout.write("\n");
  }

  process.stdout.write(
    `Note: density is violations per 100 lines. Report this number, not "100% compliance" —\n` +
      `models are stochastic and an absolute claim will not survive contact with a demo.\n\n`
  );
}

main().catch((err) => {
  process.stderr.write(`${err?.stack ?? err}\n`);
  process.exitCode = 1;
});
