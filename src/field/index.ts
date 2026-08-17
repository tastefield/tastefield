import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { loadField, templatesDir, writeYaml } from "../utils/fs.js";
import type { Field } from "../schema/index.js";

export interface InitFieldOptions {
  dir: string;
  name?: string;
  id?: string;
  force?: boolean;
}

export function initField(opts: InitFieldOptions): Field {
  const name = opts.name ?? "my-field";
  const id = opts.id ?? name;
  const root = opts.dir;

  if (existsSync(join(root, "field.yaml")) && !opts.force) {
    throw new Error(
      `Field already exists at ${root}. Use --force to overwrite templates.`,
    );
  }

  const dirs = [
    "sources",
    "skills",
    "examples/accepted",
    "examples/rejected",
    "methods",
    "evals",
  ];
  for (const d of dirs) {
    mkdirSync(join(root, d), { recursive: true });
  }

  const tpl = templatesDir();
  const field: Field = {
    name,
    id,
    version: "0.1.0",
    description: "A Tastefield Field — creative world for Skills and Methods.",
    skills: [],
    sources: [],
  };

  writeFileSync(join(root, "field.yaml"), writeYaml(field), "utf8");

  const rulesSrc = join(tpl, "rules.md");
  if (existsSync(rulesSrc)) {
    cpSync(rulesSrc, join(root, "rules.md"));
  } else {
    writeFileSync(
      join(root, "rules.md"),
      "# Rules\n\nThese constraints are inviolable.\n",
      "utf8",
    );
  }

  const methodTpl = readFileSync(join(tpl, "method.yaml"), "utf8")
    .replaceAll("example-method", "starter")
    .replace(
      "Outcome this Method produces.",
      "Starter Method — replace with your outcome.",
    );
  writeFileSync(join(root, "methods", "starter.yaml"), methodTpl, "utf8");

  const evalsTpl = readFileSync(join(tpl, "evals.json"), "utf8").replaceAll(
    "example-method",
    "starter",
  );
  writeFileSync(join(root, "evals", "evals.json"), evalsTpl, "utf8");

  writeFileSync(join(root, "sources", ".gitkeep"), "", "utf8");
  writeFileSync(join(root, "examples", "accepted", ".gitkeep"), "", "utf8");
  writeFileSync(join(root, "examples", "rejected", ".gitkeep"), "", "utf8");
  writeFileSync(
    join(root, "sources", "README.md"),
    "# Sources\n\nAttach markdown, research, and creative reference material here.\n",
    "utf8",
  );

  return field;
}

export function readField(fieldRoot: string): Field {
  return loadField(fieldRoot);
}

export function addSkillRef(
  fieldRoot: string,
  ref: {
    name: string;
    path: string;
    version?: string;
    origin?: string;
  },
): Field {
  const field = loadField(fieldRoot);
  const existing = field.skills.findIndex((s) => s.name === ref.name);
  const next = {
    name: ref.name,
    path: ref.path,
    version: ref.version ?? "0.0.0",
    origin: ref.origin,
    enabled: true,
  };
  if (existing >= 0) {
    field.skills[existing] = { ...field.skills[existing], ...next };
  } else {
    field.skills.push(next);
  }
  writeFileSync(join(fieldRoot, "field.yaml"), writeYaml(field), "utf8");
  return field;
}

export function addSource(fieldRoot: string, sourcePath: string): Field {
  const field = loadField(fieldRoot);
  if (!field.sources.includes(sourcePath)) {
    field.sources.push(sourcePath);
  }
  writeFileSync(join(fieldRoot, "field.yaml"), writeYaml(field), "utf8");
  return field;
}
