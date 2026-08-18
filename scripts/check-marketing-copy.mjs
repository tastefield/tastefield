#!/usr/bin/env node
/**
 * Run Tastefield voice rules (especially no-marketing-filler) against a
 * marketing copy draft. Uses the same check() / deriveRules() as MCP / CLI / bench.
 *
 * Usage: node scripts/check-marketing-copy.mjs <path-to-draft.md>
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const draftPath = process.argv[2];
if (!draftPath) {
  process.stderr.write("Usage: node scripts/check-marketing-copy.mjs <draft.md>\n");
  process.exit(2);
}

const root = resolve(import.meta.dirname, "..");

async function load(rel) {
  return import(pathToFileURL(resolve(root, rel)).href);
}

let check;
let deriveRules;
try {
  ({ check } = await load("dist/check/index.js"));
  ({ deriveRules } = await load("dist/compile/rules.js"));
} catch (err) {
  process.stderr.write(
    `Could not load dist/ modules (${err?.message ?? err}). Run: npm run build\n`,
  );
  process.exit(1);
}

const emptyScan = {
  repoRoot: root,
  tokens: [],
  components: [],
  stack: {
    tailwind: null,
    hasShadcn: false,
    framework: "unknown",
    alias: null,
  },
  warnings: [],
};

const voice = deriveRules(emptyScan).filter((r) => r.category === "voice" && r.pattern);
const text = readFileSync(resolve(draftPath), "utf8");

// Only score the user-facing copy block when present, so meta/review notes
// mentioning forbidden words don't false-positive.
const start = text.indexOf("## User-facing copy");
const endMarkers = [
  "## Alternates",
  "## Visual notes",
  "## Review notes",
  "## Rule gaps",
  "## Notes",
];
let slice = text;
if (start !== -1) {
  let end = text.length;
  for (const marker of endMarkers) {
    const i = text.indexOf(marker, start + 1);
    if (i !== -1 && i < end) end = i;
  }
  slice = text.slice(start, end);
}

const violations = check(slice, voice);

const dashHits = [];
slice.split("\n").forEach((line, i) => {
  if (line.includes("—") || line.includes("–")) {
    dashHits.push({ line: i + 1, excerpt: line.trim() });
  }
});

const failCount = violations.length + dashHits.length;
if (failCount === 0) {
  process.stdout.write(`PASS  ${draftPath}  (0 voice violations in user-facing copy)\n`);
  process.exit(0);
}

process.stdout.write(`FAIL  ${draftPath}  (${failCount} issue(s) in user-facing copy)\n`);
for (const v of violations) {
  process.stdout.write(`  L${v.line}  ${v.ruleId}  "${v.excerpt}"\n`);
  process.stdout.write(`       ${v.message}\n`);
  if (v.fix) process.stdout.write(`       fix: ${v.fix}\n`);
}
for (const d of dashHits) {
  process.stdout.write(`  L${d.line}  no-em-dash  em dash or en dash\n`);
  process.stdout.write(`       ${d.excerpt}\n`);
  process.stdout.write(`       fix: Use a period, a comma, or a new sentence. See docs/marketing-copy/FORBIDDEN.md\n`);
}
process.exit(1);
