#!/usr/bin/env node
/**
 * Build on install when sources are present (git / local clones).
 * Skip when consuming a packed publish that already ships dist/.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

if (!existsSync("src") || !existsSync("tsconfig.json")) {
  process.exit(0);
}

const require = createRequire(import.meta.url);
let tsc;
try {
  tsc = require.resolve("typescript/bin/tsc");
} catch {
  console.error(
    "tastefield prepare: typescript is required to build from source. Run npm install with devDependencies.",
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [tsc, "-p", "tsconfig.json"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
