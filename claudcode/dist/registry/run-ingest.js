#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import process from "node:process";
import { ingest } from "./ingest.js";
/**
 * CI entrypoint for the scheduled registry refresh.
 *
 * Exit codes matter here: a partial sweep still writes a snapshot (useful), but
 * a total failure must fail the job loudly rather than silently committing an
 * empty index over a good one.
 */
function arg(flag, fallback) {
    const i = process.argv.indexOf(flag);
    return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
async function main() {
    const depth = Number(arg("--depth", "5000"));
    const root = arg("--root", process.cwd());
    const changelogPath = arg("--changelog", "");
    const dryRun = process.argv.includes("--dry-run");
    const result = await ingest({ depth, root, dryRun });
    const { stats, diff, snapshot } = result;
    process.stdout.write(`snapshot ${snapshot.version}\n` +
        `  swept:           ${stats.swept.toLocaleString()}\n` +
        `  design-relevant: ${stats.designRelevant.toLocaleString()}\n` +
        `  momentum:        ${Object.entries(stats.byMomentum).map(([k, v]) => `${k}=${v}`).join(" ")}\n` +
        `  verdict:         ${Object.entries(stats.byVerdict).map(([k, v]) => `${k}=${v}`).join(" ")}\n` +
        `  added:           ${diff.added.length}\n` +
        `  removed:         ${diff.removed.length}\n` +
        `  noop:            ${diff.noop}\n`);
    if (result.errors.length) {
        process.stderr.write(`\n${result.errors.length} error(s) during sweep:\n`);
        for (const e of result.errors)
            process.stderr.write(`  ${e}\n`);
    }
    // Nothing usable came back — fail rather than overwrite a good snapshot.
    if (stats.designRelevant === 0) {
        process.stderr.write("\nNo design-relevant skills found. Refusing to write an empty snapshot.\n");
        process.exitCode = 1;
        return;
    }
    if (changelogPath) {
        await writeFile(changelogPath, result.changelog, "utf8");
        process.stdout.write(`\nchangelog → ${changelogPath}\n`);
    }
    if (result.written) {
        process.stdout.write(`snapshot  → ${result.written}\n`);
    }
}
main().catch((err) => {
    process.stderr.write(`${err?.stack ?? err}\n`);
    process.exitCode = 1;
});
//# sourceMappingURL=run-ingest.js.map