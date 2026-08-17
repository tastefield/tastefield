import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Token, TokenKind } from "../types.js";
import { walk } from "./walk.js";

/**
 * Matches a CSS custom property declaration: `--name: value;`
 * Value capture is non-greedy up to the first semicolon or closing brace,
 * which is good enough for token declarations (they don't contain raw `;`).
 */
const CUSTOM_PROP = /--([\w-]+)\s*:\s*([^;}]+)[;}]/g;

/**
 * Tailwind v4 declares its theme in a `@theme { ... }` at-rule rather than a
 * JS config file. Detecting this is how we tell v4 from v3.
 */
const THEME_BLOCK = /@theme\s*(?:inline\s*)?\{/;

/** Tailwind v3 projects import the framework with @tailwind directives. */
const TAILWIND_V3_DIRECTIVE = /@tailwind\s+(base|components|utilities)/;

/**
 * Classify a token by its name. Name-based heuristics beat value-based ones
 * here because design systems are fairly consistent about prefixes, and a bare
 * value like "0.5rem" is genuinely ambiguous between spacing and radius.
 */
export function classifyToken(name: string): TokenKind {
  const n = name.toLowerCase();

  if (/^(color|bg|background|foreground|fg|text|border|ring|accent|primary|secondary|muted|destructive|success|warning|danger|info|chart|sidebar)/.test(n))
    return "color";
  if (/(^|-)(radius|rounded)/.test(n)) return "radius";
  if (/(^|-)(shadow|elevation)/.test(n)) return "shadow";
  if (/(^|-)(font|text-size|leading|tracking|letter|weight)/.test(n))
    return "typography";
  if (/(^|-)(duration|ease|easing|transition|animate|spring)/.test(n))
    return "motion";
  if (/(^|-)(space|spacing|gap|size|width|height|inset)/.test(n))
    return "spacing";

  return "other";
}

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
export async function scanCss(repoRoot: string): Promise<CssScanResult> {
  const files = await walk(repoRoot, { extensions: [".css"], maxFiles: 500 });

  const tokens = new Map<string, Token>();
  let tailwind: "v3" | "v4" | null = null;

  for (const file of files) {
    let content: string;
    try {
      content = await readFile(file, "utf8");
    } catch {
      continue;
    }

    if (THEME_BLOCK.test(content)) {
      tailwind = "v4";
    } else if (tailwind === null && TAILWIND_V3_DIRECTIVE.test(content)) {
      tailwind = "v3";
    }

    const rel = path.relative(repoRoot, file);

    CUSTOM_PROP.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = CUSTOM_PROP.exec(content)) !== null) {
      const name = match[1];
      const value = match[2].trim();

      // Skip tokens that just alias another token — they add context-window
      // weight without telling the agent anything it can't already resolve.
      if (value.startsWith("var(")) continue;

      // First declaration wins. Later ones are usually dark-mode or media-query
      // overrides; capturing every override would bloat the compiled context.
      if (!tokens.has(name)) {
        tokens.set(name, { name, value, kind: classifyToken(name), source: rel });
      }
    }
  }

  return { tokens: [...tokens.values()], tailwind };
}
