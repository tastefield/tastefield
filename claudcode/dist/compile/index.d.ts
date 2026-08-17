import type { CompiledContext, ScanResult } from "../types.js";
export declare const CONTEXT_DIR = ".tastefield";
export declare function compile(scan: ScanResult): CompiledContext;
/**
 * Write the compiled context to disk.
 *
 * Split across several files rather than one blob because the MCP server serves
 * them independently — an agent asking about copy tone shouldn't pull the entire
 * component contract set into its context window.
 */
export declare function writeContext(repoRoot: string, ctx: CompiledContext): Promise<string[]>;
