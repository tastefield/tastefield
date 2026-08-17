/**
 * Core data model for Tastefield Phase 1a.
 *
 * The pipeline is:  scan(repo) -> ScanResult -> compile() -> CompiledContext
 * CompiledContext is what gets written to .tastefield/ and served over MCP.
 */
export type TokenKind = "color" | "spacing" | "radius" | "typography" | "shadow" | "motion" | "other";
export interface Token {
    /** CSS custom property name, without the leading `--`. e.g. "color-primary" */
    name: string;
    /** Raw declared value, e.g. "oklch(0.21 0.006 285.9)" or "0.5rem" */
    value: string;
    kind: TokenKind;
    /** Where this was found, relative to repo root. */
    source: string;
}
/**
 * A component's public contract as far as an AI agent is concerned:
 * what to import, and which prop values are legal.
 */
export interface ComponentContract {
    name: string;
    /** Import specifier an agent should use, e.g. "@/components/ui/button" */
    importPath: string;
    /** Whether the component is a default or named export. */
    exportKind: "default" | "named";
    /** Variant prop -> allowed values. Extracted from cva() definitions. */
    variants: Record<string, string[]>;
    /** Default variant values where declared. */
    defaults: Record<string, string>;
    source: string;
}
export type RuleSeverity = "error" | "warn";
/**
 * A single enforceable rule. `pattern` is a serialized RegExp source that the
 * compliance checker runs against generated code.
 *
 * Deliberately named "standards"/"rules" rather than "negative restraints" —
 * this vocabulary is what shows up in product surfaces and enterprise conversations.
 */
export interface Rule {
    id: string;
    /** Human-readable statement of the rule, phrased for an LLM to follow. */
    statement: string;
    severity: RuleSeverity;
    /** Optional machine-checkable pattern. Rules without one are advisory only. */
    pattern?: string;
    patternFlags?: string;
    /** What to do instead, shown in violation messages. */
    fix?: string;
    category: "structure" | "boundary" | "voice";
}
export interface ScanResult {
    repoRoot: string;
    tokens: Token[];
    components: ComponentContract[];
    /** Detected stack signals, used to tailor rules. */
    stack: {
        tailwind: "v3" | "v4" | null;
        hasShadcn: boolean;
        framework: "next" | "vite" | "remix" | "unknown";
        /** Import alias prefix, e.g. "@/" — read from tsconfig paths when present. */
        alias: string | null;
    };
    warnings: string[];
}
export interface CompiledContext {
    version: string;
    generatedAt: string;
    repoRoot: string;
    tokens: Token[];
    components: ComponentContract[];
    rules: Rule[];
    stack: ScanResult["stack"];
}
export interface Violation {
    ruleId: string;
    severity: RuleSeverity;
    message: string;
    fix?: string;
    line: number;
    excerpt: string;
}
