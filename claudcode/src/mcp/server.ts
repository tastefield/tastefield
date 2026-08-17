import { readFile } from "node:fs/promises";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { ComponentContract, Rule, Token } from "../types.js";
import { CONTEXT_DIR } from "../compile/index.js";
import { check } from "../check/index.js";

/**
 * The local MCP server.
 *
 * The design principle here is progressive disclosure. We deliberately do NOT
 * expose one fat `get_everything` tool that dumps the whole design system into
 * the agent's context window — that's the failure mode of piping raw
 * documentation at an LLM. Instead the agent pulls the specific contract or
 * rule set it needs, when it needs it.
 */

interface LoadedContext {
  tokens: Record<string, Token[]>;
  components: ComponentContract[];
  rules: Rule[];
}

async function loadContext(repoRoot: string): Promise<LoadedContext> {
  const dir = path.join(repoRoot, CONTEXT_DIR);

  async function readJson<T>(name: string, fallback: T): Promise<T> {
    try {
      return JSON.parse(await readFile(path.join(dir, name), "utf8")) as T;
    } catch {
      return fallback;
    }
  }

  const contracts = await readJson<{ components?: ComponentContract[] }>(
    "contracts.json",
    {}
  );
  const tokens = await readJson<{ groups?: Record<string, Token[]> }>(
    "tokens.json",
    {}
  );
  const rules = await readJson<{ rules?: Rule[] }>("rules.json", {});

  return {
    components: contracts.components ?? [],
    tokens: tokens.groups ?? {},
    rules: rules.rules ?? [],
  };
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export async function startServer(repoRoot: string): Promise<void> {
  const server = new Server(
    { name: "tastefield", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_brand_standards",
        description:
          "Read this project's brand standards and guardrails before writing or editing any UI code. " +
          "Returns the rules the generated code must satisfy. Call this first for any UI task.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["structure", "boundary", "voice", "all"],
              description: "Which category of standards to return. Defaults to all.",
            },
          },
        },
      },
      {
        name: "get_component_contract",
        description:
          "Get the exact import path and legal prop values for a component before rendering it. " +
          "Call this instead of guessing props or writing raw HTML for something the design system already provides.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Component name, e.g. 'Button'. Omit to list every available component.",
            },
          },
        },
      },
      {
        name: "get_design_tokens",
        description:
          "Get this project's design tokens (colors, spacing, radius, typography, shadow, motion). " +
          "Use these values instead of hardcoding any color, size or radius.",
        inputSchema: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: [
                "color",
                "spacing",
                "radius",
                "typography",
                "shadow",
                "motion",
                "all",
              ],
              description: "Token category to return. Defaults to all.",
            },
          },
        },
      },
      {
        name: "check_compliance",
        description:
          "Check a block of code against this project's brand standards BEFORE presenting it to the user. " +
          "Returns any violations with the rule that was broken and how to fix it.",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string", description: "The code to check." },
          },
          required: ["code"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    // Reload per call so edits to .tastefield/ take effect without a restart —
    // a stale-context bug here would undermine the entire premise.
    const ctx = await loadContext(repoRoot);
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "get_brand_standards": {
        const category = (args as { category?: string }).category ?? "all";
        const rules =
          category === "all"
            ? ctx.rules
            : ctx.rules.filter((r) => r.category === category);

        if (!rules.length) {
          return textResult(
            "No standards compiled yet. Run `npx @tastefield/mcp init` in this repository first."
          );
        }

        const rendered = rules
          .map((r) => {
            const parts = [`[${r.severity}] ${r.id}: ${r.statement}`];
            if (r.fix) parts.push(`  Instead: ${r.fix}`);
            return parts.join("\n");
          })
          .join("\n\n");

        return textResult(rendered);
      }

      case "get_component_contract": {
        const wanted = (args as { name?: string }).name;

        if (!wanted) {
          if (!ctx.components.length) {
            return textResult("No components have been compiled for this project.");
          }
          return textResult(
            `Available components:\n${ctx.components
              .map((c) => `- ${c.name} (${c.importPath})`)
              .join("\n")}`
          );
        }

        const match = ctx.components.find(
          (c) => c.name.toLowerCase() === wanted.toLowerCase()
        );
        if (!match) {
          return textResult(
            `No component named "${wanted}". Available: ${ctx.components
              .map((c) => c.name)
              .join(", ")}`
          );
        }

        const lines = [
          `${match.name}`,
          `import: ${
            match.exportKind === "default"
              ? `import ${match.name} from "${match.importPath}"`
              : `import { ${match.name} } from "${match.importPath}"`
          }`,
        ];

        const variantEntries = Object.entries(match.variants);
        if (variantEntries.length) {
          lines.push("props:");
          for (const [prop, values] of variantEntries) {
            const def = match.defaults[prop];
            lines.push(
              `  ${prop}: ${values.map((v) => `"${v}"`).join(" | ")}${
                def ? ` (default: "${def}")` : ""
              }`
            );
          }
          lines.push(
            "These are the ONLY legal values. Do not pass anything else."
          );
        } else {
          lines.push("props: no variant contract declared for this component.");
        }

        return textResult(lines.join("\n"));
      }

      case "get_design_tokens": {
        const kind = (args as { kind?: string }).kind ?? "all";
        const groups =
          kind === "all" ? ctx.tokens : { [kind]: ctx.tokens[kind] ?? [] };

        const rendered = Object.entries(groups)
          .filter(([, tokens]) => tokens?.length)
          .map(
            ([groupName, tokens]) =>
              `${groupName}:\n${tokens
                .map((t) => `  --${t.name}: ${t.value}`)
                .join("\n")}`
          )
          .join("\n\n");

        return textResult(rendered || "No tokens compiled for this project.");
      }

      case "check_compliance": {
        const code = (args as { code?: string }).code ?? "";
        const violations = check(code, ctx.rules);

        if (!violations.length) {
          return textResult("PASS — no brand standard violations found.");
        }

        const rendered = violations
          .map(
            (v) =>
              `line ${v.line} [${v.severity}] ${v.ruleId}: found "${v.excerpt}"\n  ${v.message}${
                v.fix ? `\n  Instead: ${v.fix}` : ""
              }`
          )
          .join("\n\n");

        return textResult(
          `FAIL — ${violations.length} violation(s). Fix these before presenting the code:\n\n${rendered}`
        );
      }

      default:
        return textResult(`Unknown tool: ${name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
