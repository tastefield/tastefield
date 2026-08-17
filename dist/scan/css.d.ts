import type { Token, TokenKind } from "../types.js";
/**
 * Classify a token by its name. Name-based heuristics beat value-based ones
 * here because design systems are fairly consistent about prefixes, and a bare
 * value like "0.5rem" is genuinely ambiguous between spacing and radius.
 */
export declare function classifyToken(name: string): TokenKind;
export interface CssScanResult {
    tokens: Token[];
    tailwind: "v3" | "v4" | null;
}
/**
 * Extract design tokens from CSS custom properties across the repo.
 *
 * This is intentionally regex-based rather than a full CSS parse. Token
 * declarations are a simple, well-behaved subset of CSS, and avoiding a parser
 * dependency keeps `npx @tastefield/mcp` install-and-run fast — which is the
 * whole point of the 10-second hook.
 */
export declare function scanCss(repoRoot: string): Promise<CssScanResult>;
