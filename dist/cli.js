#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { scan } from "./scan/index.js";
import { compile, writeContext, CONTEXT_DIR } from "./compile/index.js";
import { registerAgents } from "./agents/register.js";
import { check } from "./check/index.js";
import { startServer } from "./mcp/server.js";
import { CURATED, SEED_META, findSkill, formatInstalls, hydrateInstalls, recipes, } from "./registry/curate.js";
import { importSkill, listImported } from "./registry/import.js";
import { harvest } from "./registry/discover.js";
const c = {
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};
const HELP = `
${c.bold("tastefield")} — compiles your design system into executable context for AI coding agents

${c.bold("Usage")}
  npx @tastefield/mcp <command> [options]

${c.bold("Commands")}
  init            Scan this repo, compile ${CONTEXT_DIR}/, and register with local agents
  sync            Re-scan and recompile (does not touch agent config)
  serve           Start the local MCP server over stdio (agents call this)
  check [files]   Check files against compiled standards; exits 1 on error-severity violations
  skills          Browse and import the curated skills.sh set (see below)
  help            Show this message

${c.bold("Skills")}
  skills list [--category <c>] [--live]   List the curated set
  skills playbooks                        Show your playbooks and what they include
  skills recipes                          Legacy alias for skills playbooks
  skills discover                         Harvest + rank new candidates for review
  skills import <id|slug> [--github]      Import a skill into ${CONTEXT_DIR}/skills/
  skills imported                         Show what's already imported
  skills export [--out <file>] [--live]   Emit the curated set as JSON

${c.bold("Options")}
  --dir <path>    Repository root (default: cwd)
  --no-register   For init: compile only, don't write agent config
  --live          Fetch live install counts (needs VERCEL_OIDC_TOKEN)
  --github        Import via the public GitHub source instead of the skills.sh API

${c.dim("Telemetry: none. Tastefield sends nothing anywhere; everything runs locally.")}
`;
function parseArgs(argv) {
    const args = argv.slice(2);
    const command = args[0] && !args[0].startsWith("-") ? args[0] : "help";
    const flags = {};
    const positional = [];
    for (let i = command === "help" ? 0 : 1; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith("--")) {
            const key = arg.slice(2);
            const next = args[i + 1];
            if (next && !next.startsWith("--")) {
                flags[key] = next;
                i++;
            }
            else {
                flags[key] = true;
            }
        }
        else {
            positional.push(arg);
        }
    }
    return { command, flags, positional };
}
async function loadRules(repoRoot) {
    try {
        const raw = await readFile(path.join(repoRoot, CONTEXT_DIR, "rules.json"), "utf8");
        return (JSON.parse(raw).rules ?? []);
    }
    catch {
        return [];
    }
}
async function cmdInit(repoRoot, register) {
    const started = Date.now();
    process.stdout.write(`${c.dim("Scanning")} ${repoRoot}\n\n`);
    const result = await scan(repoRoot);
    const ctx = compile(result);
    const written = await writeContext(repoRoot, ctx);
    const tokenCount = ctx.tokens.length;
    const componentCount = ctx.components.length;
    const contractCount = ctx.components.filter((comp) => Object.keys(comp.variants).length > 0).length;
    const enforced = ctx.rules.filter((r) => r.pattern).length;
    const stackBits = [
        ctx.stack.framework !== "unknown" ? ctx.stack.framework : null,
        ctx.stack.tailwind ? `tailwind ${ctx.stack.tailwind}` : null,
        ctx.stack.hasShadcn ? "shadcn/ui" : null,
    ].filter(Boolean);
    if (stackBits.length) {
        process.stdout.write(`${c.green("✔")} Detected ${stackBits.join(" · ")}\n`);
    }
    process.stdout.write(`${c.green("✔")} ${tokenCount} design tokens\n` +
        `${c.green("✔")} ${componentCount} components (${contractCount} with variant contracts)\n` +
        `${c.green("✔")} ${ctx.rules.length} standards compiled (${enforced} machine-enforced)\n` +
        `${c.green("✔")} Wrote ${written.length} files to ${c.cyan(CONTEXT_DIR)}/\n`);
    if (register) {
        const registrations = await registerAgents(repoRoot);
        for (const r of registrations) {
            const verb = r.action === "already-present" ? "already registered in" : `${r.action} `;
            process.stdout.write(`${c.green("✔")} ${r.agent} — ${verb}${c.dim(r.file)}\n`);
        }
    }
    for (const warning of result.warnings) {
        process.stdout.write(`\n${c.yellow("!")} ${warning}\n`);
    }
    process.stdout.write(`\n${c.dim(`Done in ${Date.now() - started}ms.`)}\n` +
        `${c.bold("Next:")} restart Cursor or Claude Code so it picks up the MCP server, ` +
        `then ask it to build a UI component.\n`);
    return 0;
}
async function cmdCheck(repoRoot, files) {
    const rules = await loadRules(repoRoot);
    if (!rules.length) {
        process.stderr.write(`${c.red("✖")} No compiled standards found. Run ${c.bold("tastefield init")} first.\n`);
        return 1;
    }
    if (!files.length) {
        process.stderr.write(`${c.red("✖")} No files given. Usage: tastefield check src/**/*.tsx\n`);
        return 1;
    }
    let errors = 0;
    let warnings = 0;
    for (const file of files) {
        let content;
        try {
            content = await readFile(file, "utf8");
        }
        catch {
            process.stderr.write(`${c.yellow("!")} Could not read ${file}\n`);
            continue;
        }
        const violations = check(content, rules);
        if (!violations.length)
            continue;
        process.stdout.write(`\n${c.bold(file)}\n`);
        for (const v of violations) {
            const tag = v.severity === "error" ? c.red("error") : c.yellow("warn ");
            process.stdout.write(`  ${c.dim(String(v.line).padStart(4))}  ${tag}  ${v.ruleId}  ${c.dim(v.excerpt)}\n`);
            if (v.fix)
                process.stdout.write(`        ${c.dim(v.fix)}\n`);
            if (v.severity === "error")
                errors++;
            else
                warnings++;
        }
    }
    process.stdout.write(`\n${errors ? c.red(`${errors} error(s)`) : c.green("0 errors")}, ${warnings} warning(s)\n`);
    return errors > 0 ? 1 : 0;
}
async function cmdSkills(repoRoot, positional, flags) {
    const sub = positional[0] ?? "list";
    switch (sub) {
        case "list": {
            let skills = CURATED;
            let note = `${c.dim(`seed verified ${SEED_META.verifiedAt} · install counts not fetched`)}`;
            if (flags.live) {
                const res = await hydrateInstalls();
                skills = res.skills;
                note = res.error
                    ? `${c.yellow("!")} ${res.error}`
                    : c.dim(`${res.hydrated}/${skills.length} install counts refreshed from skills.sh`);
            }
            if (typeof flags.category === "string") {
                skills = skills.filter((s) => s.category === flags.category);
            }
            process.stdout.write(`\n${c.bold("Curated skills")} ${c.dim(`(${skills.length} of ${CURATED.length})`)}\n\n`);
            process.stdout.write(c.dim(`${"SKILL".padEnd(30)}${"SOURCE".padEnd(38)}${"CATEGORY".padEnd(11)}${"INSTALLS".padStart(9)}\n`));
            for (const s of skills) {
                process.stdout.write(`${s.slug.padEnd(30)}${c.dim(s.source.padEnd(38))}${s.category.padEnd(11)}${formatInstalls(s.installs).padStart(9)}\n`);
            }
            process.stdout.write(`\n${note}\n`);
            process.stdout.write(c.dim(`Install counts shown as "—" are unknown, not zero.\n`));
            return 0;
        }
        case "playbooks":
        case "recipes": {
            process.stdout.write(`\n${c.bold("Your playbooks")}\n\n`);
            for (const { name, skills } of recipes()) {
                process.stdout.write(`${c.cyan(name)} ${c.dim(`— ${skills.length} skills`)}\n`);
                for (const s of skills) {
                    process.stdout.write(`  ${s.slug.padEnd(30)}${c.dim(s.officialSummary ?? s.rationale)}\n`);
                }
                process.stdout.write("\n");
            }
            return 0;
        }
        case "import": {
            const target = positional[1];
            if (!target) {
                process.stderr.write(`${c.red("✖")} Usage: tastefield skills import <id|slug>\n`);
                return 1;
            }
            const curated = findSkill(target);
            if (!curated) {
                process.stderr.write(`${c.red("✖")} "${target}" is not in the curated set.\n` +
                    `${c.dim("Run `tastefield skills list` to see available skills.")}\n`);
                return 1;
            }
            process.stdout.write(`${c.dim("Importing")} ${curated.id}\n`);
            const record = await importSkill(repoRoot, target, {
                preferGitHub: flags.github === true,
            });
            process.stdout.write(`${c.green("✔")} ${record.files.length} file(s) → ${c.cyan(record.dir)}\n` +
                `${c.dim(`  via ${record.via}${record.hash ? ` · hash ${record.hash.slice(0, 12)}` : ""}`)}\n`);
            return 0;
        }
        case "imported": {
            const imported = await listImported(repoRoot);
            if (!imported.length) {
                process.stdout.write(`${c.dim("No skills imported yet. Try `tastefield skills import polish`.")}\n`);
                return 0;
            }
            for (const s of imported) {
                process.stdout.write(`${c.green("✔")} ${s.slug.padEnd(30)}${c.dim(`${s.files.length} file(s) · via ${s.via} · ${s.importedAt.slice(0, 10)}`)}\n`);
            }
            return 0;
        }
        case "discover": {
            process.stdout.write(`${c.dim("Harvesting candidates from search battery + owner allowlist…")}\n`);
            const result = await harvest();
            if (result.errors.length && result.candidates.length === 0) {
                process.stderr.write(`${c.red("✖")} Discovery needs a Vercel OIDC token.\n` +
                    `${c.dim("  Run `vercel env pull` in a linked project, or set VERCEL_OIDC_TOKEN.")}\n\n` +
                    `${c.dim("First error: " + result.errors[0])}\n`);
                return 1;
            }
            const { stats } = result;
            process.stdout.write(`\n${c.green("✔")} ${stats.unique} unique candidates ` +
                `${c.dim(`(${stats.fromSearch} via search, ${stats.fromOwners} via owners)`)}\n` +
                `  ${c.green(String(stats.include))} include · ${c.yellow(String(stats.review))} review · ${c.dim(String(stats.excluded) + " excluded")}\n\n`);
            const shortlist = result.candidates.filter((x) => x.relevance.verdict !== "exclude");
            process.stdout.write(c.dim(`${"SCORE".padStart(5)}  ${"VERDICT".padEnd(8)}${"SKILL".padEnd(32)}${"SOURCE".padEnd(34)}INSTALLS\n`));
            for (const x of shortlist.slice(0, 60)) {
                const tag = x.relevance.verdict === "include" ? c.green("include ") : c.yellow("review  ");
                process.stdout.write(`${String(x.relevance.score).padStart(5)}  ${tag}${x.slug.slice(0, 31).padEnd(32)}${c.dim(x.source.slice(0, 33).padEnd(34))}${formatInstalls(x.installs).padStart(8)}\n`);
            }
            if (result.errors.length) {
                process.stdout.write(`\n${c.yellow("!")} ${result.errors.length} query/owner lookup(s) failed; partial results shown.\n`);
            }
            process.stdout.write(`\n${c.dim("This is a shortlist, not a decision. Category, status, rationale and playbook")}\n` +
                `${c.dim("membership are assigned by hand — that judgement is the product.")}\n`);
            return 0;
        }
        case "export": {
            let skills = CURATED;
            let hydrated = 0;
            let error;
            if (flags.live) {
                const res = await hydrateInstalls();
                skills = res.skills;
                hydrated = res.hydrated;
                error = res.error;
            }
            const payload = {
                generatedAt: new Date().toISOString(),
                source: SEED_META.generatedFrom,
                seedVerifiedAt: SEED_META.verifiedAt,
                installsHydrated: hydrated,
                installsNote: "null means the count was not verified. Render as an em dash, never as 0.",
                categories: [...new Set(skills.map((s) => s.category))].sort(),
                recipes: recipes().map((r) => ({
                    name: r.name,
                    skillCount: r.skills.length,
                    skills: r.skills.map((s) => s.slug),
                })),
                skills,
            };
            const json = `${JSON.stringify(payload, null, 2)}\n`;
            const out = typeof flags.out === "string" ? flags.out : null;
            if (out) {
                const { writeFile: wf } = await import("node:fs/promises");
                await wf(path.resolve(out), json, "utf8");
                process.stdout.write(`${c.green("✔")} Wrote ${skills.length} skills → ${c.cyan(out)}\n`);
                if (error)
                    process.stdout.write(`${c.yellow("!")} ${error}\n`);
            }
            else {
                process.stdout.write(json);
            }
            return 0;
        }
        default:
            process.stderr.write(`${c.red("✖")} Unknown subcommand: skills ${sub}\n`);
            return 1;
    }
}
async function main() {
    const { command, flags, positional } = parseArgs(process.argv);
    const repoRoot = path.resolve(typeof flags.dir === "string" ? flags.dir : process.cwd());
    switch (command) {
        case "init":
            process.exitCode = await cmdInit(repoRoot, flags.register !== false && !flags["no-register"]);
            return;
        case "sync":
            process.exitCode = await cmdInit(repoRoot, false);
            return;
        case "serve":
            // stdout is the MCP transport here — anything written to it that isn't a
            // protocol message will corrupt the stream. Diagnostics go to stderr only.
            await startServer(repoRoot);
            return;
        case "check":
            process.exitCode = await cmdCheck(repoRoot, positional);
            return;
        case "skills":
            process.exitCode = await cmdSkills(repoRoot, positional, flags);
            return;
        case "help":
        default:
            process.stdout.write(HELP);
            return;
    }
}
main().catch((err) => {
    process.stderr.write(`${c.red("✖")} ${err?.stack ?? err}\n`);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map