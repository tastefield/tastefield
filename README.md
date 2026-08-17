# Tastefield

Tastefield brings your Skills, knowledge and creative judgment into one portable working environment.

Local-first CLI for discovering agent Skills, attaching creative Fields, and composing them into reusable executable systems you can export to Cursor, Codex, or Claude.

## Glossary

| Term | Meaning |
| --- | --- |
| **Field** | Everything that constitutes a creator’s world — writing, notes, research, references, judgments, and preferences. |
| **Skill** | A procedure for doing something within that world (an Agent Skills `SKILL.md` bundle). |
| **Composition** | A reusable creative system built from Skills, Constants, knowledge, examples, and evals. It is an *executable* arrangement — not a finished artifact. |
| **Constants** | What the creator never wants violated (`constants.md`). |
| **Signals** | What choices reveal through accepted and rejected work. |
| **Evals** | Evidence that a Composition works and continues working. |
| **Experience** | An interactive interface powered by one or more Compositions (future). |

A Field contains what you know, value, and notice. A Skill contains how to do something. A **Composition** connects the two for a particular outcome.

## Install

```bash
npm install -g .
# or during development:
npm install
npm run tastefield -- --help
```

Requires Node.js 20+.

## Commands

```bash
tastefield scan                          # Find Skills in Cursor, Codex, Claude
tastefield inspect <path-or-name>        # Show Skill / Field / Composition details
tastefield init [dir]                    # Create a Field skeleton
tastefield add skill|source <target>     # Attach a Skill ref or source folder
tastefield compose <name>                # Validate Composition + lock versions
tastefield doctor [dir]                  # Flag overlaps, duplicates, broken refs
tastefield test [composition]            # Load eval set (stub runner in v0)
tastefield export <composition> [-o out] # Emit a thin orchestrating Skill
```

## Field layout

```text
my-field/
├── field.yaml
├── constants.md
├── sources/
├── skills/
├── examples/
│   ├── accepted/
│   └── rejected/
├── compositions/
│   └── reality-check.yaml
└── evals/
```

## Export contract

`tastefield export` does **not** merge every Skill into one enormous file. It generates a thin orchestrating `SKILL.md` that:

1. Declares the Composition outcome as its trigger
2. Instructs the agent to load Constants first
3. Progressively loads subordinate Skills in precedence order
4. Points at Field sources and examples on demand

Versions are locked in `compositions/<name>.lock.json`.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Status

Core v0: scan, inspect, init, compose, doctor, export, and eval loading. Experiences, publishing, and full Signals are intentionally out of scope.
