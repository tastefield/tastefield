import type { Rule, ScanResult } from "../types.js";
/**
 * Baseline rules, derived from what the scan actually found.
 *
 * Two deliberate design choices here:
 *
 * 1. Rules carry a machine-checkable `pattern` wherever possible. A rule an
 *    agent merely reads is advisory; a rule we can verify is enforcement. The
 *    same patterns power both the MCP `check_compliance` tool and the benchmark
 *    harness, so "did governance work" is measurable rather than asserted.
 *
 * 2. Rules are phrased as standards ("Use X", "Never Y") in product-legible
 *    language, not prompt-engineering jargon.
 */
export declare function deriveRules(scan: ScanResult): Rule[];
