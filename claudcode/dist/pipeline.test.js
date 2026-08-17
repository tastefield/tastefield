import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scan } from "./scan/index.js";
import { compile } from "./compile/index.js";
import { check } from "./check/index.js";
import { classifyToken } from "./scan/css.js";
const here = path.dirname(fileURLToPath(import.meta.url));
// dist/ sits alongside test/, so climb out of dist to reach the fixture.
const FIXTURE = path.resolve(here, "..", "test", "fixtures", "sample-app");
test("classifies tokens by name", () => {
    assert.equal(classifyToken("color-primary"), "color");
    assert.equal(classifyToken("radius-md"), "radius");
    assert.equal(classifyToken("shadow-card"), "shadow");
    assert.equal(classifyToken("font-sans"), "typography");
    assert.equal(classifyToken("duration-fast"), "motion");
    assert.equal(classifyToken("spacing-gutter"), "spacing");
});
test("scans the fixture app", async () => {
    const result = await scan(FIXTURE);
    assert.equal(result.stack.tailwind, "v4", "should detect @theme as Tailwind v4");
    assert.equal(result.stack.framework, "next");
    assert.equal(result.stack.hasShadcn, true, "components/ui/ implies shadcn layout");
    assert.equal(result.stack.alias, "@/", "should read alias from jsonc tsconfig");
    const names = result.tokens.map((t) => t.name);
    assert.ok(names.includes("color-primary"));
    assert.ok(names.includes("radius-md"));
    assert.ok(names.includes("sidebar-width"), "should read :root vars too");
    const colors = result.tokens.filter((t) => t.kind === "color");
    assert.ok(colors.length >= 5);
});
test("extracts component variant contracts from cva", async () => {
    const result = await scan(FIXTURE);
    const button = result.components.find((c) => c.name === "Button");
    assert.ok(button, "Button should be discovered");
    assert.equal(button.importPath, "@/components/ui/button");
    assert.deepEqual(button.variants.variant, [
        "default",
        "secondary",
        "ghost",
        "destructive",
    ]);
    assert.deepEqual(button.variants.size, ["sm", "md", "lg"]);
    assert.equal(button.defaults.variant, "default");
    assert.equal(button.defaults.size, "md");
    // buttonVariants is an implementation detail, not a renderable component.
    assert.ok(!result.components.some((c) => c.name === "buttonVariants"));
    const card = result.components.find((c) => c.name === "Card");
    assert.ok(card);
    assert.deepEqual(card.variants.elevation, ["flat", "raised"]);
});
test("compiles rules that reference real tokens", async () => {
    const ctx = compile(await scan(FIXTURE));
    const ids = ctx.rules.map((r) => r.id);
    assert.ok(ids.includes("no-raw-hex"));
    assert.ok(ids.includes("no-arbitrary-values"));
    assert.ok(ids.includes("no-invented-variants"));
    const hex = ctx.rules.find((r) => r.id === "no-raw-hex");
    assert.ok(hex?.fix?.includes("var(--color-"), "fix should cite real tokens");
});
test("checker catches the failure modes the rules describe", async () => {
    const ctx = compile(await scan(FIXTURE));
    const slop = `
export function Banner() {
  return (
    <div className="bg-blue-500 p-[17px]" style={{ borderRadius: "9px" }}>
      <span style={{ color: "#ff0055" }}>Seamlessly unlock your workflow</span>
    </div>
  );
}`;
    const violations = check(slop, ctx.rules);
    const hit = (id) => violations.some((v) => v.ruleId === id);
    assert.ok(hit("no-arbitrary-color-utility"), "bg-blue-500");
    assert.ok(hit("no-arbitrary-values"), "p-[17px]");
    assert.ok(hit("no-raw-hex"), "#ff0055");
    assert.ok(hit("no-marketing-filler"), "seamlessly/unlock");
    assert.ok(hit("no-inline-border-radius"), "inline borderRadius");
});
test("checker passes compliant code", async () => {
    const ctx = compile(await scan(FIXTURE));
    const good = `
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Banner() {
  return (
    <Card elevation="raised" className="p-6">
      <p className="text-muted-foreground">Analytics are now available.</p>
      <Button variant="default" size="md">View analytics</Button>
    </Card>
  );
}`;
    const violations = check(good, ctx.rules);
    assert.deepEqual(violations.map((v) => `${v.ruleId}:${v.excerpt}`), [], "compliant sample should produce no violations");
});
test("checker reports line numbers", async () => {
    const ctx = compile(await scan(FIXTURE));
    const code = ["line one", "const c = '#abcdef';", "line three"].join("\n");
    const violations = check(code, ctx.rules);
    assert.equal(violations.length, 1);
    assert.equal(violations[0].line, 2);
});
//# sourceMappingURL=pipeline.test.js.map