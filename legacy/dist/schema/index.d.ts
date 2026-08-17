import { z } from "zod";
/** Agent Skill frontmatter (Agent Skills / SKILL.md). */
export declare const SkillFrontmatterSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    license: z.ZodOptional<z.ZodString>;
    compatibility: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    "allowed-tools": z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    license?: string | undefined;
    compatibility?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    "allowed-tools"?: string | undefined;
}, {
    name: string;
    description: string;
    license?: string | undefined;
    compatibility?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    "allowed-tools"?: string | undefined;
}>;
export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;
export declare const SkillRefSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    origin: z.ZodOptional<z.ZodString>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    role: z.ZodOptional<z.ZodEnum<["primary", "supporting", "override"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path: string;
    version: string;
    enabled: boolean;
    origin?: string | undefined;
    role?: "primary" | "supporting" | "override" | undefined;
}, {
    name: string;
    path: string;
    version?: string | undefined;
    origin?: string | undefined;
    enabled?: boolean | undefined;
    role?: "primary" | "supporting" | "override" | undefined;
}>;
export type SkillRef = z.infer<typeof SkillRefSchema>;
export declare const FieldSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        version: z.ZodDefault<z.ZodString>;
        origin: z.ZodOptional<z.ZodString>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        role: z.ZodOptional<z.ZodEnum<["primary", "supporting", "override"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        version: string;
        enabled: boolean;
        origin?: string | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }, {
        name: string;
        path: string;
        version?: string | undefined;
        origin?: string | undefined;
        enabled?: boolean | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }>, "many">>;
    sources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    id: string;
    skills: {
        name: string;
        path: string;
        version: string;
        enabled: boolean;
        origin?: string | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }[];
    sources: string[];
    description?: string | undefined;
}, {
    name: string;
    id: string;
    description?: string | undefined;
    version?: string | undefined;
    skills?: {
        name: string;
        path: string;
        version?: string | undefined;
        origin?: string | undefined;
        enabled?: boolean | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }[] | undefined;
    sources?: string[] | undefined;
}>;
export type Field = z.infer<typeof FieldSchema>;
export declare const MethodSkillSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    origin: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["primary", "supporting", "override"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path: string;
    version: string;
    role: "primary" | "supporting" | "override";
    origin?: string | undefined;
}, {
    name: string;
    path: string;
    version?: string | undefined;
    origin?: string | undefined;
    role?: "primary" | "supporting" | "override" | undefined;
}>;
/** A Method is structured expertise—Skills, Rules, and knowledge—packaged into an executable workflow. */
export declare const MethodSchema: z.ZodObject<{
    name: z.ZodString;
    id: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    description: z.ZodString;
    skills: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        version: z.ZodDefault<z.ZodString>;
        origin: z.ZodOptional<z.ZodString>;
        role: z.ZodDefault<z.ZodEnum<["primary", "supporting", "override"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        version: string;
        role: "primary" | "supporting" | "override";
        origin?: string | undefined;
    }, {
        name: string;
        path: string;
        version?: string | undefined;
        origin?: string | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }>, "many">>;
    precedence: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Path to Rules (inviolable constraints). */
    rules: z.ZodDefault<z.ZodString>;
    sources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    examples: z.ZodDefault<z.ZodObject<{
        accepted: z.ZodDefault<z.ZodString>;
        rejected: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        accepted: string;
        rejected: string;
    }, {
        accepted?: string | undefined;
        rejected?: string | undefined;
    }>>;
    evals: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    version: string;
    id: string;
    skills: {
        name: string;
        path: string;
        version: string;
        role: "primary" | "supporting" | "override";
        origin?: string | undefined;
    }[];
    sources: string[];
    precedence: string[];
    rules: string;
    examples: {
        accepted: string;
        rejected: string;
    };
    evals: string;
}, {
    name: string;
    description: string;
    id: string;
    version?: string | undefined;
    skills?: {
        name: string;
        path: string;
        version?: string | undefined;
        origin?: string | undefined;
        role?: "primary" | "supporting" | "override" | undefined;
    }[] | undefined;
    sources?: string[] | undefined;
    precedence?: string[] | undefined;
    rules?: string | undefined;
    examples?: {
        accepted?: string | undefined;
        rejected?: string | undefined;
    } | undefined;
    evals?: string | undefined;
}>;
export type Method = z.infer<typeof MethodSchema>;
export declare const MethodLockSchema: z.ZodObject<{
    method: z.ZodString;
    locked_at: z.ZodString;
    skills: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        version: z.ZodString;
        origin: z.ZodOptional<z.ZodString>;
        content_hash: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        version: string;
        origin?: string | undefined;
        content_hash?: string | undefined;
    }, {
        name: string;
        path: string;
        version: string;
        origin?: string | undefined;
        content_hash?: string | undefined;
    }>, "many">;
    rules: z.ZodString;
    rules_hash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skills: {
        name: string;
        path: string;
        version: string;
        origin?: string | undefined;
        content_hash?: string | undefined;
    }[];
    rules: string;
    method: string;
    locked_at: string;
    rules_hash?: string | undefined;
}, {
    skills: {
        name: string;
        path: string;
        version: string;
        origin?: string | undefined;
        content_hash?: string | undefined;
    }[];
    rules: string;
    method: string;
    locked_at: string;
    rules_hash?: string | undefined;
}>;
export type MethodLock = z.infer<typeof MethodLockSchema>;
export declare const EvalCaseSchema: z.ZodObject<{
    id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    prompt: z.ZodString;
    expected_output: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    expectations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string | number;
    prompt: string;
    expectations: string[];
    expected_output?: string | undefined;
    files?: string[] | undefined;
}, {
    id: string | number;
    prompt: string;
    expected_output?: string | undefined;
    files?: string[] | undefined;
    expectations?: string[] | undefined;
}>;
export declare const EvalsFileSchema: z.ZodObject<{
    skill_name: z.ZodString;
    evals: z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
        prompt: z.ZodString;
        expected_output: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        expectations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string | number;
        prompt: string;
        expectations: string[];
        expected_output?: string | undefined;
        files?: string[] | undefined;
    }, {
        id: string | number;
        prompt: string;
        expected_output?: string | undefined;
        files?: string[] | undefined;
        expectations?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    evals: {
        id: string | number;
        prompt: string;
        expectations: string[];
        expected_output?: string | undefined;
        files?: string[] | undefined;
    }[];
    skill_name: string;
}, {
    evals: {
        id: string | number;
        prompt: string;
        expected_output?: string | undefined;
        files?: string[] | undefined;
        expectations?: string[] | undefined;
    }[];
    skill_name: string;
}>;
export type EvalsFile = z.infer<typeof EvalsFileSchema>;
export declare const DiscoveredSkillSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    path: z.ZodString;
    origin: z.ZodEnum<["cursor", "claude", "codex", "agents", "local", "unknown"]>;
    resources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    path: string;
    origin: "unknown" | "cursor" | "claude" | "codex" | "agents" | "local";
    resources: string[];
    version?: string | undefined;
}, {
    name: string;
    description: string;
    path: string;
    origin: "unknown" | "cursor" | "claude" | "codex" | "agents" | "local";
    version?: string | undefined;
    resources?: string[] | undefined;
}>;
export type DiscoveredSkill = z.infer<typeof DiscoveredSkillSchema>;
//# sourceMappingURL=index.d.ts.map