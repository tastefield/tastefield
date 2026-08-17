#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Command } from "commander";
import { discoverSkills, formatSkillTable } from "./discover/index.js";
import { doctorField, formatDoctorReport } from "./doctor/index.js";
import {
  defaultExportDir,
  exportMethod,
  suggestInstallPath,
  type ExportTarget,
} from "./export/index.js";
import { addSkillRef, addSource, initField, readField } from "./field/index.js";
import { lockMethod, resolveMethodPath } from "./method/index.js";
import {
  listSkillResources,
  loadEvals,
  loadMethod,
  loadSkillFrontmatter,
  resolveFieldRoot,
} from "./utils/fs.js";

const program = new Command();

program
  .name("tastefield")
  .description(
    "Tastefield brings your Skills, knowledge and creative judgment into one portable working environment.",
  )
  .version("0.1.0");

program
  .command("scan")
  .description("Discover Skills installed for Cursor, Codex, and Claude")
  .option("--cwd <path>", "Working directory to scan from", process.cwd())
  .option("--field <path>", "Also include skills/ under a Field")
  .action((opts: { cwd: string; field?: string }) => {
    const fieldPath = opts.field
      ? resolve(opts.cwd, opts.field)
      : existsSync(join(opts.cwd, "field.yaml"))
        ? opts.cwd
        : undefined;
    const skills = discoverSkills({
      cwd: opts.cwd,
      fieldPath,
      includeLocalFieldSkills: true,
    });
    console.log(formatSkillTable(skills));
    console.log(`\n${skills.length} Skill(s) found.`);
  });

program
  .command("inspect")
  .description("Inspect a Skill path, Field, or Method")
  .argument("<target>", "Path or Method name")
  .option("--field <path>", "Field root when inspecting a Method by name")
  .action((target: string, opts: { field?: string }) => {
    const abs = resolve(process.cwd(), target);

    const skillMd = abs.endsWith(".md")
      ? abs
      : existsSync(join(abs, "SKILL.md"))
        ? join(abs, "SKILL.md")
        : existsSync(join(abs, "skill.md"))
          ? join(abs, "skill.md")
          : null;

    if (skillMd && existsSync(skillMd)) {
      const fm = loadSkillFrontmatter(skillMd);
      const skillDir = dirname(skillMd);
      console.log(
        JSON.stringify(
          {
            kind: "skill",
            name: fm.name,
            description: fm.description,
            path: skillDir,
            resources: listSkillResources(skillDir),
            frontmatter: fm,
          },
          null,
          2,
        ),
      );
      return;
    }

    if (existsSync(join(abs, "field.yaml")) || abs.endsWith("field.yaml")) {
      const root = abs.endsWith("field.yaml") ? dirname(abs) : abs;
      const field = readField(root);
      console.log(JSON.stringify({ kind: "field", path: root, ...field }, null, 2));
      return;
    }

    try {
      const fieldRoot = opts.field
        ? resolveFieldRoot(process.cwd(), opts.field)
        : existsSync(join(process.cwd(), "field.yaml"))
          ? process.cwd()
          : null;
      if (!fieldRoot) {
        throw new Error(
          "Provide --field <dir> or run inside a Field to inspect a Method by name",
        );
      }
      const methodPath = resolveMethodPath(fieldRoot, target);
      const method = loadMethod(methodPath);
      console.log(
        JSON.stringify(
          {
            kind: "method",
            path: methodPath,
            ...method,
          },
          null,
          2,
        ),
      );
      return;
    } catch (err) {
      console.error(
        `Could not inspect "${target}": ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exitCode = 1;
    }
  });

program
  .command("init")
  .description("Create a new Field skeleton")
  .argument("[dir]", "Directory for the Field", ".")
  .option("--name <name>", "Field name")
  .option("--id <id>", "Field id")
  .option("--force", "Overwrite existing templates", false)
  .action(
    (
      dir: string,
      opts: { name?: string; id?: string; force?: boolean },
    ) => {
      const root = resolve(process.cwd(), dir);
      const field = initField({
        dir: root,
        name: opts.name,
        id: opts.id,
        force: opts.force,
      });
      console.log(`Initialized Field "${field.name}" at ${root}`);
      console.log(
        "Next: add Skills, edit rules.md, then tastefield lock <method>",
      );
    },
  );

program
  .command("add")
  .description("Add a Skill reference or source path to the Field")
  .argument("<kind>", "skill | source")
  .argument("<target>", "Skill directory or source path")
  .option("--field <path>", "Field root", ".")
  .option("--name <name>", "Skill name override")
  .option("--version <version>", "Skill version", "0.0.0")
  .option("--origin <origin>", "Skill origin label")
  .action(
    (
      kind: string,
      target: string,
      opts: {
        field: string;
        name?: string;
        version?: string;
        origin?: string;
      },
    ) => {
      const fieldRoot = resolveFieldRoot(process.cwd(), opts.field);
      if (kind === "skill") {
        const skillDir = resolve(process.cwd(), target);
        const skillMd = existsSync(join(skillDir, "SKILL.md"))
          ? join(skillDir, "SKILL.md")
          : join(skillDir, "skill.md");
        if (!existsSync(skillMd)) {
          console.error(`No SKILL.md in ${skillDir}`);
          process.exitCode = 1;
          return;
        }
        const fm = loadSkillFrontmatter(skillMd);
        const relPath = skillDir.startsWith(fieldRoot)
          ? skillDir.slice(fieldRoot.length).replace(/^\//, "")
          : target;
        const field = addSkillRef(fieldRoot, {
          name: opts.name ?? fm.name,
          path: relPath,
          version: opts.version,
          origin: opts.origin,
        });
        console.log(`Added Skill "${opts.name ?? fm.name}" to Field ${field.id}`);
        return;
      }
      if (kind === "source") {
        const field = addSource(fieldRoot, target);
        console.log(`Added source "${target}" to Field ${field.id}`);
        return;
      }
      console.error(`Unknown kind "${kind}". Use skill or source.`);
      process.exitCode = 1;
    },
  );

program
  .command("lock")
  .description("Validate a Method and lock participating Skill versions")
  .argument("<name>", "Method name or path")
  .option("--field <path>", "Field root", ".")
  .action((name: string, opts: { field: string }) => {
    try {
      const fieldRoot = resolveFieldRoot(process.cwd(), opts.field);
      const result = lockMethod(fieldRoot, name);
      console.log(
        `Locked Method "${result.method.id}" — ${result.lock.skills.length} Skill(s)`,
      );
      console.log(`Lockfile: ${result.lockPath}`);
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

// Back-compat alias for Composition-era CLI
program
  .command("compose", { hidden: true })
  .description("Alias for lock (deprecated)")
  .argument("<name>", "Method name or path")
  .option("--field <path>", "Field root", ".")
  .action((name: string, opts: { field: string }) => {
    console.error("tastefield compose is deprecated; use tastefield lock");
    const fieldRoot = resolveFieldRoot(process.cwd(), opts.field);
    const result = lockMethod(fieldRoot, name);
    console.log(
      `Locked Method "${result.method.id}" — ${result.lock.skills.length} Skill(s)`,
    );
    console.log(`Lockfile: ${result.lockPath}`);
  });

program
  .command("doctor")
  .description("Flag overlapping triggers, duplicates, and broken refs")
  .argument("[dir]", "Field directory", ".")
  .action((dir: string) => {
    try {
      const fieldRoot = resolveFieldRoot(process.cwd(), dir);
      const discovered = discoverSkills({
        cwd: process.cwd(),
        fieldPath: fieldRoot,
        includeLocalFieldSkills: true,
      });
      const report = doctorField(fieldRoot, discovered);
      console.log(formatDoctorReport(report));
      if (!report.ok) process.exitCode = 1;
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program
  .command("test")
  .description("Load and summarize Method evals (runner stub in v0)")
  .argument("[method]", "Method name", "starter")
  .option("--field <path>", "Field root", ".")
  .action((methodName: string, opts: { field: string }) => {
    try {
      const fieldRoot = resolveFieldRoot(process.cwd(), opts.field);
      const methodPath = resolveMethodPath(fieldRoot, methodName);
      const method = loadMethod(methodPath);
      const evalsPath = join(fieldRoot, method.evals);
      if (!existsSync(evalsPath)) {
        console.error(`Evals not found: ${method.evals}`);
        process.exitCode = 1;
        return;
      }
      const evals = loadEvals(evalsPath);
      console.log(
        `Loaded ${evals.evals.length} eval case(s) for "${evals.skill_name}"`,
      );
      for (const ev of evals.evals) {
        console.log(
          `  #${ev.id}: ${ev.prompt.slice(0, 80)}${ev.prompt.length > 80 ? "…" : ""}`,
        );
        console.log(`       expectations: ${ev.expectations.length}`);
      }
      console.log(
        "\n(v0 stub) Eval execution against agents is not implemented yet — cases validated only.",
      );
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program
  .command("export")
  .description("Export a Method as a thin orchestrating Skill")
  .argument("<method>", "Method name or path")
  .option("--field <path>", "Field root", ".")
  .option("-o, --out <dir>", "Output directory")
  .option(
    "--target <target>",
    "cursor | codex | claude | generic",
    "generic",
  )
  .action(
    (
      methodName: string,
      opts: { field: string; out?: string; target: string },
    ) => {
      try {
        const fieldRoot = resolveFieldRoot(process.cwd(), opts.field);
        const target = opts.target as ExportTarget;
        const methodPath = resolveMethodPath(fieldRoot, methodName);
        const method = loadMethod(methodPath);
        const outDir =
          opts.out ?? defaultExportDir(fieldRoot, method.id, target);
        const result = exportMethod({
          fieldRoot,
          method: methodName,
          outDir,
          target,
        });
        console.log(`Exported Method Skill → ${result.outDir}`);
        console.log(`Orchestrator: ${result.skillMdPath}`);
        console.log(
          `Suggested install path: ${suggestInstallPath(method.id, target)}`,
        );
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exitCode = 1;
      }
    },
  );

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
