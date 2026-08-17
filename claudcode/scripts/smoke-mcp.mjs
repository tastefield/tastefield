/**
 * Live smoke test of the MCP server: spawns `cli.js serve` as a real subprocess
 * and drives it over stdio with an actual MCP client.
 *
 * This is the check that matters most in Phase 1a — unit tests can pass while
 * the protocol handshake or tool registration is broken, and that failure would
 * only surface inside someone's IDE.
 *
 * Usage: node scripts/smoke-mcp.mjs <repo-with-.tastefield>
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cli = path.resolve(here, "..", "dist", "cli.js");
const repo = path.resolve(process.argv[2] ?? ".");

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [cli, "serve", "--dir", repo],
});

const client = new Client({ name: "smoke", version: "0" }, { capabilities: {} });

let failures = 0;
function assert(label, condition, detail = "") {
  const mark = condition ? "\x1b[32m✔\x1b[0m" : "\x1b[31m✖\x1b[0m";
  if (!condition) failures++;
  console.log(`${mark} ${label}${detail ? `\n    ${detail}` : ""}`);
}

await client.connect(transport);
console.log("connected\n");

const { tools } = await client.listTools();
assert(
  `lists 4 tools`,
  tools.length === 4,
  tools.map((t) => t.name).join(", ")
);

async function callText(name, args) {
  const res = await client.callTool({ name, arguments: args });
  return res.content.map((c) => c.text).join("\n");
}

// --- get_component_contract ---
const contract = await callText("get_component_contract", { name: "Button" });
assert(
  "get_component_contract returns the real import specifier",
  contract.includes('import { Button } from "@/components/ui/button"')
);
assert(
  "get_component_contract enumerates legal variants",
  contract.includes('"default" | "secondary" | "ghost" | "destructive"'),
  contract.split("\n").find((l) => l.trim().startsWith("variant:"))
);
assert(
  "get_component_contract surfaces defaults",
  contract.includes('(default: "md")')
);

const unknown = await callText("get_component_contract", { name: "Carousel" });
assert(
  "unknown component is refused rather than invented",
  unknown.startsWith('No component named "Carousel"')
);

// --- get_design_tokens ---
const radius = await callText("get_design_tokens", { kind: "radius" });
assert(
  "get_design_tokens scopes to the requested kind",
  radius.includes("--radius-md: 0.5rem") && !radius.includes("--color-primary"),
  radius.replace(/\n/g, " | ")
);

// --- get_brand_standards ---
const voice = await callText("get_brand_standards", { category: "voice" });
assert(
  "get_brand_standards filters by category",
  voice.includes("no-marketing-filler") && !voice.includes("no-raw-hex")
);

// --- check_compliance ---
const bad = await callText("check_compliance", {
  code: `<div className="bg-blue-500 p-[17px]"><span style={{color:"#ff0055"}}>Seamlessly unlock more</span></div>`,
});
assert("check_compliance fails slop", bad.startsWith("FAIL"));
for (const rule of [
  "no-arbitrary-color-utility",
  "no-arbitrary-values",
  "no-raw-hex",
  "no-marketing-filler",
]) {
  assert(`  └ caught ${rule}`, bad.includes(rule));
}

const good = await callText("check_compliance", {
  code: `import { Button } from "@/components/ui/button";\nexport const A = () => <Button variant="ghost" size="sm">Save</Button>;`,
});
assert("check_compliance passes clean code", good.startsWith("PASS"), good);

await client.close();

console.log(
  failures === 0
    ? "\n\x1b[32mMCP smoke test passed\x1b[0m"
    : `\n\x1b[31m${failures} assertion(s) failed\x1b[0m`
);
process.exit(failures === 0 ? 0 : 1);
