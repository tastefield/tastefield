import { readFile } from "node:fs/promises";
import path from "node:path";
import { walk } from "./walk.js";
/**
 * class-variance-authority is the de facto standard for typed component
 * variants in the shadcn/ui ecosystem, which makes it the highest-signal
 * place to read a component's real contract from.
 *
 * We look for:  const buttonVariants = cva("...", { variants: {...}, defaultVariants: {...} })
 */
const CVA_CALL = /\bcva\s*\(/;
/** `export function Button(` / `export const Button = ` / `export default function Button(` */
const NAMED_EXPORT = /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g;
const DEFAULT_EXPORT = /export\s+default\s+(?:async\s+)?(?:function\s+)?([A-Z][A-Za-z0-9_]*)/;
/**
 * Extract a balanced `{...}` block starting at the given index of `source`.
 * Returns the inner text, or null if braces never balance.
 *
 * Needed because variant objects nest, so a regex can't reliably find the end.
 */
function extractBlock(source, openBraceIndex) {
    let depth = 0;
    for (let i = openBraceIndex; i < source.length; i++) {
        const ch = source[i];
        if (ch === "{")
            depth++;
        else if (ch === "}") {
            depth--;
            if (depth === 0)
                return source.slice(openBraceIndex + 1, i);
        }
    }
    return null;
}
/**
 * Parse the `variants: { variant: { default: ..., ghost: ... }, size: {...} }`
 * shape into { variant: ["default", "ghost"], size: [...] }.
 */
function parseVariants(cvaBody) {
    const result = {};
    const variantsIdx = cvaBody.search(/\bvariants\s*:\s*\{/);
    if (variantsIdx === -1)
        return result;
    const openIdx = cvaBody.indexOf("{", variantsIdx);
    const variantsBlock = extractBlock(cvaBody, openIdx);
    if (!variantsBlock)
        return result;
    // Each top-level key inside `variants` is a prop name whose own block
    // contains the legal values for that prop.
    const propRe = /([A-Za-z_$][\w$]*)\s*:\s*\{/g;
    let m;
    while ((m = propRe.exec(variantsBlock)) !== null) {
        const propName = m[1];
        const blockStart = variantsBlock.indexOf("{", m.index + m[0].length - 1);
        const block = extractBlock(variantsBlock, blockStart);
        if (!block)
            continue;
        // Only take keys at depth 0 of this block — nested objects are class
        // definitions, not additional variant values.
        //
        // String literals must be skipped wholesale: Tailwind class values contain
        // colons (`ghost: "hover:bg-muted"`), and a naive scan reads that inner
        // `hover:` as another variant key.
        const values = [];
        let depth = 0;
        let keyBuffer = "";
        let quote = null;
        let stringBuffer = "";
        for (let i = 0; i < block.length; i++) {
            const ch = block[i];
            if (quote) {
                if (ch === "\\") {
                    i++; // skip the escaped character
                    continue;
                }
                if (ch === quote) {
                    quote = null;
                    // A quoted key (`"default": ...`) is legal, so keep the contents as a
                    // candidate. If this was a value instead, the following comma clears it.
                    if (depth === 0)
                        keyBuffer = stringBuffer;
                    stringBuffer = "";
                }
                else {
                    stringBuffer += ch;
                }
                continue;
            }
            if (ch === '"' || ch === "'" || ch === "`") {
                quote = ch;
                stringBuffer = "";
                continue;
            }
            if (ch === "{" || ch === "[") {
                depth++;
                continue;
            }
            if (ch === "}" || ch === "]") {
                depth--;
                continue;
            }
            if (depth === 0 && ch === ":") {
                const key = keyBuffer.trim();
                if (/^[\w-]+$/.test(key))
                    values.push(key);
                keyBuffer = "";
                continue;
            }
            if (depth === 0 && ch === ",") {
                keyBuffer = "";
                continue;
            }
            if (depth === 0)
                keyBuffer += ch;
        }
        if (values.length)
            result[propName] = values;
        // Advance past this block so the outer regex doesn't descend into it.
        propRe.lastIndex = blockStart + block.length + 2;
    }
    return result;
}
function parseDefaults(cvaBody) {
    const idx = cvaBody.search(/\bdefaultVariants\s*:\s*\{/);
    if (idx === -1)
        return {};
    const openIdx = cvaBody.indexOf("{", idx);
    const block = extractBlock(cvaBody, openIdx);
    if (!block)
        return {};
    const out = {};
    const pairRe = /([A-Za-z_$][\w$]*)\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = pairRe.exec(block)) !== null)
        out[m[1]] = m[2];
    return out;
}
/**
 * Turn an absolute file path into the import specifier an agent should write.
 * Prefers the tsconfig alias (e.g. "@/components/ui/button") because that's
 * what the codebase's own imports look like.
 */
function toImportPath(repoRoot, file, alias) {
    let rel = path.relative(repoRoot, file).replace(/\\/g, "/");
    rel = rel.replace(/\.(tsx|ts|jsx|js)$/, "");
    rel = rel.replace(/\/index$/, "");
    if (alias) {
        // Alias usually maps to ./src or repo root. Strip a leading src/ so the
        // emitted specifier matches how the project actually imports.
        const withoutSrc = rel.replace(/^src\//, "");
        return `${alias}${withoutSrc}`;
    }
    return `./${rel}`;
}
export async function scanComponents(repoRoot, alias) {
    const files = await walk(repoRoot, {
        extensions: [".tsx", ".jsx"],
        maxFiles: 2000,
    });
    const components = [];
    let hasShadcn = false;
    for (const file of files) {
        let content;
        try {
            content = await readFile(file, "utf8");
        }
        catch {
            continue;
        }
        const normalized = file.replace(/\\/g, "/");
        if (/\/components\/ui\//.test(normalized))
            hasShadcn = true;
        const hasCva = CVA_CALL.test(content);
        // Components live in a components/ dir, or declare variants via cva.
        // Anything else is application code, not a reusable contract.
        const looksLikeComponent = /\/components?\//.test(normalized) || hasCva;
        if (!looksLikeComponent)
            continue;
        let variants = {};
        let defaults = {};
        if (hasCva) {
            const cvaIdx = content.search(CVA_CALL);
            const openIdx = content.indexOf("{", cvaIdx);
            if (openIdx !== -1) {
                const body = extractBlock(content, openIdx);
                if (body) {
                    variants = parseVariants(body);
                    defaults = parseDefaults(body);
                }
            }
        }
        const rel = path.relative(repoRoot, file);
        const importPath = toImportPath(repoRoot, file, alias);
        const defaultMatch = DEFAULT_EXPORT.exec(content);
        if (defaultMatch) {
            components.push({
                name: defaultMatch[1],
                importPath,
                exportKind: "default",
                variants,
                defaults,
                source: rel,
            });
            continue;
        }
        NAMED_EXPORT.lastIndex = 0;
        const seen = new Set();
        let m;
        while ((m = NAMED_EXPORT.exec(content)) !== null) {
            const name = m[1];
            // Skip the `buttonVariants` style cva export — it's an implementation
            // detail, not something an agent should be rendering.
            if (/Variants$/.test(name) || seen.has(name))
                continue;
            seen.add(name);
            components.push({
                name,
                importPath,
                exportKind: "named",
                // Attribute variants to the first exported component in the file;
                // co-located subcomponents (CardHeader, CardFooter) share the module
                // but not the cva definition.
                variants: seen.size === 1 ? variants : {},
                defaults: seen.size === 1 ? defaults : {},
                source: rel,
            });
        }
    }
    return { components, hasShadcn };
}
//# sourceMappingURL=components.js.map