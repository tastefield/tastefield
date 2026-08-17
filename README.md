# Tastefield

Tastefield brings your Skills, knowledge and creative judgment into one portable working environment.

Local-first CLI for discovering agent Skills, attaching creative Fields, and packaging them into Methods you can export to Cursor, Codex, or Claude.

## Glossary

| Term | Meaning |
| --- | --- |
| **Field** | Everything that constitutes a creator’s world — writing, notes, research, references, judgments, and preferences. |
| **Skill** | A procedure for doing something within that world (an Agent Skills `SKILL.md` bundle). |
| **Method** | Your structured expertise—Skills, Rules, and knowledge—packaged into an executable workflow. |
| **Rules** | What the creator never wants violated (`rules.md`). |
| **Signals** | What choices reveal through accepted and rejected work. |
| **Evals** | Evidence that a Method works and continues working. |
| **Experience** | An interactive interface powered by one or more Methods (future). |

A Field contains what you know, value, and notice. A Skill contains how to do something. A **Method** packages the two into an executable workflow.

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
tastefield inspect <path-or-name>        # Show Skill / Field / Method details
tastefield init [dir]                    # Create a Field skeleton
tastefield add skill|source <target>     # Attach a Skill ref or source folder
tastefield lock <name>                   # Validate Method + lock versions
tastefield doctor [dir]                  # Flag overlaps, duplicates, broken refs
tastefield test [method]                 # Load eval set (stub runner in v0)
tastefield export <method> [-o out]      # Emit a thin orchestrating Skill
```

## Field layout

```text
my-field/
├── field.yaml
├── rules.md
├── sources/
├── skills/
├── examples/
│   ├── accepted/
│   └── rejected/
├── methods/
│   └── reality-check.yaml
└── evals/
```

## Export contract

`tastefield export` does **not** merge every Skill into one enormous file. It generates a thin orchestrating `SKILL.md` that:

1. Declares the Method outcome as its trigger
2. Instructs the agent to load Rules first
3. Progressively loads subordinate Skills in precedence order
4. Points at Field sources and examples on demand

Versions are locked in `methods/<name>.lock.json`.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Status

Core v0: scan, inspect, init, lock, doctor, export, and eval loading. Experiences, publishing, and full Signals are intentionally out of scope.
