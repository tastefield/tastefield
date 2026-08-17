/**
 * Register the local MCP server with whichever agents are present.
 *
 * Two deliberate constraints:
 *
 * 1. Project-scoped only. We write `.cursor/mcp.json` and `.mcp.json` inside the
 *    repo, never the user's home directory. A CLI that silently edits global
 *    machine config is exactly the kind of thing that gets uninstalled.
 *
 * 2. Merge, never clobber. Existing MCP server entries are preserved.
 */
export interface RegistrationTarget {
    agent: string;
    file: string;
}
export interface RegistrationResult {
    agent: string;
    file: string;
    action: "created" | "updated" | "already-present";
}
export declare function registerAgents(repoRoot: string): Promise<RegistrationResult[]>;
