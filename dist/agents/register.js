import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { exists } from "../scan/walk.js";
const TARGETS = [
    { agent: "Cursor", file: path.join(".cursor", "mcp.json") },
    // Claude Code reads project-scoped servers from .mcp.json at the repo root.
    { agent: "Claude Code", file: ".mcp.json" },
];
function serverEntry() {
    return {
        command: "npx",
        args: ["-y", "@tastefield/mcp", "serve"],
    };
}
export async function registerAgents(repoRoot) {
    const results = [];
    for (const target of TARGETS) {
        const full = path.join(repoRoot, target.file);
        let config = {};
        let existed = false;
        if (await exists(full)) {
            existed = true;
            try {
                config = JSON.parse(await readFile(full, "utf8"));
            }
            catch {
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
//# sourceMappingURL=register.js.map