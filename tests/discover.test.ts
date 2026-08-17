import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultSkillRoots, discoverSkills } from "../src/discover/index.js";

describe("discover", () => {
  it("lists default roots that exist", () => {
    const home = mkdtempSync(join(tmpdir(), "tf-home-"));
    const cwd = mkdtempSync(join(tmpdir(), "tf-cwd-"));
    mkdirSync(join(cwd, ".cursor", "skills"), { recursive: true });
    mkdirSync(join(home, ".claude", "skills"), { recursive: true });

    const roots = defaultSkillRoots({ cwd, home });
    expect(roots.some((r) => r.origin === "cursor")).toBe(true);
    expect(roots.some((r) => r.origin === "claude")).toBe(true);
  });

  it("discovers Skills with frontmatter", () => {
    const cwd = mkdtempSync(join(tmpdir(), "tf-scan-"));
    const skillDir = join(cwd, ".cursor", "skills", "demo-skill");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(
      join(skillDir, "SKILL.md"),
      `---
name: demo-skill
description: Demo skill used when scanning fixtures.
metadata:
  version: "1.2.3"
---

# Demo
`,
      "utf8",
    );

    const skills = discoverSkills({ cwd, home: mkdtempSync(join(tmpdir(), "tf-empty-home-")) });
    expect(skills.some((s) => s.name === "demo-skill")).toBe(true);
    const demo = skills.find((s) => s.name === "demo-skill")!;
    expect(demo.origin).toBe("cursor");
    expect(demo.version).toBe("1.2.3");
    expect(demo.description).toContain("Demo skill");
  });

  it("includes Field local skills when fieldPath is set", () => {
    const field = mkdtempSync(join(tmpdir(), "tf-field-"));
    const skillDir = join(field, "skills", "local-skill");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(
      join(skillDir, "SKILL.md"),
      `---
name: local-skill
description: Local field skill.
---

# Local
`,
      "utf8",
    );

    const skills = discoverSkills({
      cwd: mkdtempSync(join(tmpdir(), "tf-cwd2-")),
      home: mkdtempSync(join(tmpdir(), "tf-home2-")),
      fieldPath: field,
    });
    expect(skills.map((s) => s.name)).toContain("local-skill");
  });
});
