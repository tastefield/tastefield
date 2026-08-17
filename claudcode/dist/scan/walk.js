import { readdir, stat } from "node:fs/promises";
import path from "node:path";
const IGNORED_DIRS = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "out",
    "coverage",
    ".turbo",
    ".vercel",
    ".tastefield",
]);
/**
 * Depth-first file walk that skips build output and vendor directories.
 * Returns absolute paths.
 */
export async function walk(root, options) {
    const { extensions, maxFiles = 5000 } = options;
    const found = [];
    async function visit(dir) {
        if (found.length >= maxFiles)
            return;
        let entries;
        try {
            entries = await readdir(dir, { withFileTypes: true });
        }
        catch {
            // Unreadable directory (permissions, broken symlink) — skip rather than fail the scan.
            return;
        }
        for (const entry of entries) {
            if (found.length >= maxFiles)
                return;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (IGNORED_DIRS.has(entry.name))
                    continue;
                if (entry.name.startsWith(".") && entry.name !== ".config")
                    continue;
                await visit(full);
            }
            else if (entry.isFile()) {
                if (extensions.some((ext) => entry.name.endsWith(ext))) {
                    found.push(full);
                }
            }
        }
    }
    await visit(root);
    return found;
}
export async function exists(p) {
    try {
        await stat(p);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=walk.js.map