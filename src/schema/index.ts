import { z } from "zod";

/** Agent Skill frontmatter (Agent Skills / SKILL.md). */
export const SkillFrontmatterSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Skill name must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1).max(1024),
  license: z.string().optional(),
  compatibility: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
  "allowed-tools": z.string().optional(),
});

export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;

export const SkillRefSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  version: z.string().default("0.0.0"),
  origin: z.string().optional(),
  enabled: z.boolean().default(true),
  role: z.enum(["primary", "supporting", "override"]).optional(),
});

export type SkillRef = z.infer<typeof SkillRefSchema>;

export const FieldSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
  version: z.string().default("0.1.0"),
  description: z.string().optional(),
  skills: z.array(SkillRefSchema).default([]),
  sources: z.array(z.string()).default([]),
});

export type Field = z.infer<typeof FieldSchema>;

export const CompositionSkillSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  version: z.string().default("0.0.0"),
  origin: z.string().optional(),
  role: z.enum(["primary", "supporting", "override"]).default("supporting"),
});

export const CompositionSchema = z.object({
  name: z.string().min(1),
  id: z.string().min(1),
  version: z.string().default("0.1.0"),
  description: z.string().min(1),
  skills: z.array(CompositionSkillSchema).default([]),
  precedence: z.array(z.string()).default([]),
  constants: z.string().default("constants.md"),
  sources: z.array(z.string()).default(["sources/**"]),
  examples: z
    .object({
      accepted: z.string().default("examples/accepted/**"),
      rejected: z.string().default("examples/rejected/**"),
    })
    .default({}),
  evals: z.string().default("evals/evals.json"),
});

export type Composition = z.infer<typeof CompositionSchema>;

export const CompositionLockSchema = z.object({
  composition: z.string(),
  locked_at: z.string(),
  skills: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      version: z.string(),
      origin: z.string().optional(),
      content_hash: z.string().optional(),
    }),
  ),
  constants: z.string(),
  constants_hash: z.string().optional(),
});

export type CompositionLock = z.infer<typeof CompositionLockSchema>;

export const EvalCaseSchema = z.object({
  id: z.union([z.number(), z.string()]),
  prompt: z.string(),
  expected_output: z.string().optional(),
  files: z.array(z.string()).optional(),
  expectations: z.array(z.string()).default([]),
});

export const EvalsFileSchema = z.object({
  skill_name: z.string(),
  evals: z.array(EvalCaseSchema).min(1),
});

export type EvalsFile = z.infer<typeof EvalsFileSchema>;

export const DiscoveredSkillSchema = z.object({
  name: z.string(),
  description: z.string(),
  path: z.string(),
  origin: z.enum(["cursor", "claude", "codex", "agents", "local", "unknown"]),
  resources: z.array(z.string()).default([]),
  version: z.string().optional(),
});

export type DiscoveredSkill = z.infer<typeof DiscoveredSkillSchema>;
