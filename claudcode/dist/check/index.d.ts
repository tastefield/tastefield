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
export declare function check(code: string, rules: Rule[]): Violation[];
export interface Score {
    total: number;
    errors: number;
    warnings: number;
    /** Violations per 100 lines — comparable across differently sized samples. */
    density: number;
}
export declare function score(code: string, rules: Rule[]): Score;
