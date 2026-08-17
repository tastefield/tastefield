import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { exists } from "../scan/walk.js";

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

const TARGETS: RegistrationTarget[] = [
  { agent: "Cursor", file: path.join(".cursor", "mcp.json") },
  // Claude Code reads project-scoped servers from .mcp.json at the repo root.
  { agent: "Claude Code", file: ".mcp.json" },
];

interface McpConfig {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

function serverEntry() {
  return {
    command: "npx",
    args: ["-y", "@tastefield/mcp", "serve"],
  };
}

export interface RegistrationResult {
  agent: string;
  file: string;
  action: "created" | "updated" | "already-present";
}

export async function registerAgents(
  repoRoot: string
): Promise<RegistrationResult[]> {
  const results: RegistrationResult[] = [];

  for (const target of TARGETS) {
    const full = path.join(repoRoot, target.file);
    let config: McpConfig = {};
    let existed = false;

    if (await exists(full)) {
      existed = true;
      try {
        config = JSON.parse(await readFile(full, "utf8")) as McpConfig;
      } catch {
        // Rather than overwrite a file we can't parse — which might contain
        // config the user cares about — skip it and report.
        results.push({
          agent: target.agent,
          file: target.file,
          action: "already-present",
        });
        continue;
      }
    }

    config.mcpServers ??= {};

    const current = config.mcpServers["tastefield"];
    if (current && JSON.stringify(current) === JSON.stringify(serverEntry())) {
      results.push({
        agent: target.agent,
        file: target.file,
        action: "already-present",
      });
      continue;
    }

    config.mcpServers["tastefield"] = serverEntry();

    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, `${JSON.stringify(config, null, 2)}\n`, "utf8");

    results.push({
      agent: target.agent,
      file: target.file,
      action: existed ? "updated" : "created",
    });
  }

  return results;
}
