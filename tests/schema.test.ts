import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MethodSchema,
  EvalsFileSchema,
  FieldSchema,
  SkillFrontmatterSchema,
} from "../src/schema/index.js";
import { loadSkillFrontmatter } from "../src/utils/fs.js";

describe("schemas", () => {
  it("parses Skill frontmatter", () => {
    const fm = SkillFrontmatterSchema.parse({
      name: "reality-check",
      description: "Verify claims against sources.",
    });
    expect(fm.name).toBe("reality-check");
  });

  it("rejects invalid skill names", () => {
    expect(() =>
      SkillFrontmatterSchema.parse({
        name: "Reality_Check",
        description: "bad",
      }),
    ).toThrow();
  });

  it("parses Field and Method", () => {
    const field = FieldSchema.parse({
      name: "demo",
      id: "demo",
      skills: [],
      sources: [],
    });
    expect(field.version).toBe("0.1.0");

    const method = MethodSchema.parse({
      name: "demo",
      id: "demo",
      description: "A demo method outcome.",
      skills: [
        {
          name: "reality-check",
          path: "skills/reality-check",
          role: "primary",
        },
      ],
    });
    expect(method.rules).toBe("rules.md");
    expect(method.skills[0]?.role).toBe("primary");
  });

  it("parses evals.json", () => {
    const evals = EvalsFileSchema.parse({
      skill_name: "reality-check",
      evals: [
        {
          id: 1,
          prompt: "Check this",
          expectations: ["Rules applied"],
        },
      ],
    });
    expect(evals.evals).toHaveLength(1);
  });

  it("loads frontmatter from a SKILL.md file", () => {
    const dir = mkdtempSync(join(tmpdir(), "tf-skill-"));
    const path = join(dir, "SKILL.md");
    writeFileSync(
      path,
      `---
name: sample-skill
description: A sample skill for tests.
---

# Sample
`,
      "utf8",
    );
    const fm = loadSkillFrontmatter(path);
    expect(fm.name).toBe("sample-skill");
  });
});
