import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { doctorField } from "../src/doctor/index.js";
import { exportMethod } from "../src/export/index.js";
import { initField } from "../src/field/index.js";
import { lockMethod } from "../src/method/index.js";
import { loadEvals, loadMethod } from "../src/utils/fs.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureField = join(repoRoot, "fixtures", "minimal-field");

function copyFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), "tf-fixture-"));
  rmSync(dir, { recursive: true, force: true });
  cpSync(fixtureField, dir, { recursive: true });
  return dir;
}

describe("field init", () => {
  it("creates a Field skeleton", () => {
    const dir = mkdtempSync(join(tmpdir(), "tf-init-"));
    const field = initField({ dir, name: "demo-field", id: "demo-field" });
    expect(field.id).toBe("demo-field");
    expect(existsSync(join(dir, "field.yaml"))).toBe(true);
    expect(existsSync(join(dir, "rules.md"))).toBe(true);
    expect(existsSync(join(dir, "methods", "starter.yaml"))).toBe(true);
    expect(existsSync(join(dir, "evals", "evals.json"))).toBe(true);
  });
});

describe("lock / doctor / export on fixture", () => {
  it("locks Method versions", () => {
    const field = copyFixture();
    const result = lockMethod(field, "reality-check");
    expect(result.lock.skills).toHaveLength(1);
    expect(result.lock.skills[0]?.name).toBe("reality-check");
    expect(result.lock.skills[0]?.version).toBe("0.1.0");
    expect(existsSync(result.lockPath)).toBe(true);
    expect(result.lock.rules_hash).toBeTruthy();
  });

  it("doctor passes on the minimal field", () => {
    const report = doctorField(fixtureField);
    expect(report.ok).toBe(true);
  });

  it("exports a thin orchestrator without merging skill body as only content", () => {
    const field = copyFixture();
    const outDir = join(field, "exports", "reality-check-cursor");

    const result = exportMethod({
      fieldRoot: field,
      method: "reality-check",
      outDir,
      target: "cursor",
    });

    const skillMd = readFileSync(result.skillMdPath, "utf8");
    expect(skillMd).toContain("name: reality-check");
    expect(skillMd).toContain("Progressive load order");
    expect(skillMd).toContain("references/rules.md");
    expect(skillMd).toContain("skills/reality-check");
    expect(skillMd).toContain("Never concatenate");
    expect(skillMd).toContain("structured expertise");

    expect(existsSync(join(outDir, "skills", "reality-check", "SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(outDir, "references", "rules.md"))).toBe(true);
    expect(existsSync(join(outDir, "references", "field-map.md"))).toBe(true);
    expect(existsSync(join(outDir, "evals", "evals.json"))).toBe(true);
    expect(skillMd.length).toBeLessThan(8000);
  });

  it("loads fixture method and evals", () => {
    const method = loadMethod(
      join(fixtureField, "methods", "reality-check.yaml"),
    );
    expect(method.id).toBe("reality-check");
    const evals = loadEvals(join(fixtureField, method.evals));
    expect(evals.evals.length).toBeGreaterThanOrEqual(2);
  });
});
