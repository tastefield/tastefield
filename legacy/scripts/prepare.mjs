#!/usr/bin/env node
/**
 * Build on install when sources are present and dist is missing.
 * Skip when dist/ already ships (git clones with committed build, or packed publishes).
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

const distCli = join(process.cwd(), "dist", "cli.js");
if (existsSync(distCli) && !process.env.TASTEFIELD_FORCE_BUILD) {
  process.exit(0);
}

if (!existsSync("src") || !existsSync("tsconfig.json")) {
  if (existsSync(distCli)) process.exit(0);
  console.error("tastefield prepare: missing src/ and dist/cli.js; cannot build.");
  process.exit(1);
}

const require = createRequire(join(process.cwd(), "package.json"));
let tsc;
try {
  tsc = require.resolve("typescript/bin/tsc");
} catch {
  const fallback = join(process.cwd(), "node_modules", "typescript", "bin", "tsc");
  if (!existsSync(fallback)) {
    console.error(
      "tastefield prepare: typescript is required to build from source. Run npm install.",
    );
    process.exit(1);
  }
  tsc = fallback;
}

const result = spawnSync(process.execPath, [tsc, "-p", "tsconfig.json"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
