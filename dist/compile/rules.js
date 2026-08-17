/**
 * Baseline rules, derived from what the scan actually found.
 *
 * Two deliberate design choices here:
 *
 * 1. Rules carry a machine-checkable `pattern` wherever possible. A rule an
 *    agent merely reads is advisory; a rule we can verify is enforcement. The
 *    same patterns power both the MCP `check_compliance` tool and the benchmark
 *    harness, so "did governance work" is measurable rather than asserted.
 *
 * 2. Rules are phrased as standards ("Use X", "Never Y") in product-legible
 *    language, not prompt-engineering jargon.
 */
export function deriveRules(scan) {
    const rules = [];
    const colorTokens = scan.tokens.filter((t) => t.kind === "color");
    const radiusTokens = scan.tokens.filter((t) => t.kind === "radius");
    // ---- Boundary rules (anti-slop) ----
    if (colorTokens.length > 0) {
        rules.push({
            id: "no-raw-hex",
            category: "boundary",
            severity: "error",
            statement: "Never write raw hex colors in markup or styles. Use the design system's color tokens.",
            // Matches #abc / #aabbcc / #aabbccdd in class strings, style props and CSS.
            pattern: "#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b",
            fix: `Use a defined color token instead, e.g. ${colorTokens
                .slice(0, 3)
                .map((t) => `var(--${t.name})`)
                .join(", ")}.`,
        });
        rules.push({
            id: "no-arbitrary-color-utility",
            category: "boundary",
            severity: "error",
            statement: "Never use Tailwind's built-in color palette utilities (bg-blue-500, text-red-600). Those colors are not part of this brand.",
            pattern: "\\b(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}\\b",
            fix: "Use a semantic token utility bound to the design system (e.g. bg-primary, text-muted-foreground).",
        });
    }
    rules.push({
        id: "no-arbitrary-values",
        category: "boundary",
        severity: "error",
        statement: "Never use Tailwind arbitrary-value brackets for spacing, sizing or color (p-[17px], w-[342px], bg-[#fff]). Every value must come from the scale.",
        pattern: "\\b[a-z-]+-\\[[^\\]]+\\]",
        fix: "Pick the nearest step on the defined spacing/sizing scale instead.",
    });
    if (radiusTokens.length > 0) {
        rules.push({
            id: "no-inline-border-radius",
            category: "boundary",
            severity: "warn",
            statement: "Never override border-radius inline. Radius is a system-level decision.",
            pattern: "borderRadius\\s*:|style=\\{\\{[^}]*border-radius",
            fix: `Use the radius tokens: ${radiusTokens
                .map((t) => `var(--${t.name})`)
                .join(", ")}.`,
        });
    }
    // ---- Structure rules ----
    if (scan.components.length > 0) {
        const withVariants = scan.components.filter((c) => Object.keys(c.variants).length > 0);
        rules.push({
            id: "prefer-design-system-components",
            category: "structure",
            severity: "error",
            statement: "Use the project's existing components instead of writing raw HTML elements for anything the system already covers. " +
                "Call get_component_contract before rendering a component to confirm its valid props.",
            fix: `Available components include: ${scan.components
                .slice(0, 12)
                .map((c) => c.name)
                .join(", ")}.`,
        });
        if (withVariants.length > 0) {
            rules.push({
                id: "no-invented-variants",
                category: "structure",
                severity: "error",
                statement: "Never pass a variant or size value that isn't declared in the component's contract. If the value you want doesn't exist, stop and ask rather than inventing one.",
                fix: withVariants
                    .slice(0, 4)
                    .map((c) => `${c.name}: ${Object.entries(c.variants)
                    .map(([prop, values]) => `${prop}=${values.join("|")}`)
                    .join(", ")}`)
                    .join(" · "),
            });
        }
        if (scan.stack.hasShadcn) {
            rules.push({
                id: "no-restyling-primitives",
                category: "structure",
                severity: "warn",
                statement: "Never apply layout or color utility classes directly to a UI primitive to change its appearance. Extend the component's variants instead.",
                fix: "If a new visual treatment is genuinely needed, add a variant to the component rather than overriding at the call site.",
            });
        }
    }
    // ---- Voice rules ----
    // Business and editorial rules matter more over time than pure visual rules:
    // base models keep getting better at aesthetics on their own, but they will
    // never independently know a given brand's vocabulary or legal constraints.
    rules.push({
        id: "no-marketing-filler",
        category: "voice",
        severity: "warn",
        statement: "Never use hype words in UI copy: seamless, effortless, unlock, revolutionize, supercharge, delight, magic, game-changing.",
        pattern: "\\b(seamless(?:ly)?|effortless(?:ly)?|unlock|revolutioniz\\w*|supercharge\\w*|game[- ]changing|delightful)\\b",
        patternFlags: "gi",
        fix: "State plainly what the thing does.",
    });
    rules.push({
        id: "empty-states-need-action",
        category: "voice",
        severity: "warn",
        statement: "Every empty state must end with a primary action the user can take. Never ship an empty state that only describes the absence of content.",
    });
    return rules;
}
//# sourceMappingURL=rules.js.map