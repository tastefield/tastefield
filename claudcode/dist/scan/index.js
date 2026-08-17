import { readFile } from "node:fs/promises";
import path from "node:path";
import { scanCss } from "./css.js";
import { scanComponents } from "./components.js";
import { exists } from "./walk.js";
/**
 * Read the import alias from tsconfig paths, e.g. `"@/*": ["./src/*"]` -> "@/".
 * Falls back to null, in which case component contracts use relative paths.
 */
async function readAlias(repoRoot) {
    for (const name of ["tsconfig.json", "jsconfig.json"]) {
        const file = path.join(repoRoot, name);
        if (!(await exists(file)))
            continue;
        try {
            const raw = await readFile(file, "utf8");
            // tsconfig routinely contains comments and trailing commas, so JSON.parse
            // is unreliable here. A targeted regex is more robust than a JSONC parser
            // dependency for the one field we need.
            const match = /["']([^"']*)\/\*["']\s*:\s*\[/.exec(raw);
            if (match)
                return `${match[1]}/`;
        }
        catch {
            // fall through
        }
    }
    return null;
}
async function detectFramework(repoRoot) {
    const pkgPath = path.join(repoRoot, "package.json");
    if (!(await exists(pkgPath)))
        return "unknown";
    try {
        const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps.next)
            return "next";
        if (deps["@remix-run/react"])
            return "remix";
        if (deps.vite)
            return "vite";
    }
    catch {
        // Malformed package.json shouldn't abort the whole scan.
    }
    return "unknown";
}
/**
 * Tailwind v3 keeps its theme in a JS config. We deliberately do NOT execute
 * that file — running arbitrary code from a scanned repo is a security problem,
 * and the config often imports plugins that won't resolve in our process.
 * Detecting its presence is enough to classify the stack; tokens still come
 * from CSS custom properties, which is where shadcn-style setups put them.
 */
async function detectTailwindV3Config(repoRoot) {
    for (const name of [
        "tailwind.config.js",
        "tailwind.config.ts",
        "tailwind.config.mjs",
        "tailwind.config.cjs",
    ]) {
        if (await exists(path.join(repoRoot, name)))
            return true;
    }
    return false;
}
export async function scan(repoRoot) {
    const warnings = [];
    const alias = await readAlias(repoRoot);
    const [css, framework, hasV3Config] = await Promise.all([
        scanCss(repoRoot),
        detectFramework(repoRoot),
        detectTailwindV3Config(repoRoot),
    ]);
    const { components, hasShadcn } = await scanComponents(repoRoot, alias);
    let tailwind = css.tailwind;
    if (!tailwind && hasV3Config)
        tailwind = "v3";
    if (css.tokens.length === 0) {
        warnings.push("No CSS custom properties found. Tastefield reads design tokens from `--token: value` declarations; " +
            "if your tokens live only in a tailwind.config.js theme object, they won't be picked up in this version.");
    }
    if (components.length === 0) {
        warnings.push("No components found. Looked for .tsx/.jsx files under a components/ directory or containing cva() variant definitions.");
    }
    if (tailwind === "v3" && css.tokens.length === 0) {
        warnings.push("Detected a Tailwind v3 config. Theme values declared in JS config are not read (the config is never executed, by design).");
    }
    return {
        repoRoot,
        tokens: css.tokens,
        components,
        stack: { tailwind, hasShadcn, framework, alias },
        warnings,
    };
}
//# sourceMappingURL=index.js.map