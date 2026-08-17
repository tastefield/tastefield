import type { Rule, Violation } from "../types.js";

/**
 * Run compiled rules against a block of code.
 *
 * This one function is the measurement backbone of Phase 1a. It powers:
 *   - the MCP `check_compliance` tool (an agent can self-check before writing)
 *   - `tastefield check` in CI
 *   - the benchmark harness that scores governed vs. ungoverned generations
 *
 * Because the same checker produces all three, the headline claim is a measured
 * number rather than an assertion.
 */
export function check(code: string, rules: Rule[]): Violation[] {
  const violations: Violation[] = [];
  const lines = code.split("\n");

  for (const rule of rules) {
    if (!rule.pattern) continue;

    let re: RegExp;
    try {
      // Force the global flag so we can walk every match, not just the first.
      const flags = rule.patternFlags?.includes("g")
        ? rule.patternFlags
        : `${rule.patternFlags ?? ""}g`;
      re = new RegExp(rule.pattern, flags);
    } catch {
      // A malformed pattern shouldn't take down the whole check.
      continue;
    }

    lines.forEach((lineText, i) => {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(lineText)) !== null) {
        violations.push({
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.statement,
          fix: rule.fix,
          line: i + 1,
          excerpt: m[0],
        });
        // Zero-length matches would loop forever otherwise.
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    });
  }

  return violations.sort((a, b) => a.line - b.line);
}

export interface Score {
  total: number;
  errors: number;
  warnings: number;
  /** Violations per 100 lines — comparable across differently sized samples. */
  density: number;
}

export function score(code: string, rules: Rule[]): Score {
  const violations = check(code, rules);
  const lineCount = Math.max(code.split("\n").length, 1);

  return {
    total: violations.length,
    errors: violations.filter((v) => v.severity === "error").length,
    warnings: violations.filter((v) => v.severity === "warn").length,
    density: Number(((violations.length / lineCount) * 100).toFixed(2)),
  };
}
