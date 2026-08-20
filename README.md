# @tastefield/mcp — Phase 1a

Compiles a repository's existing design system into executable context, and serves it to local AI coding agents over MCP.

No account, no server, no network calls. Everything runs on the developer's machine.

---

## Quick start

```bash
npm install && npm run build

cd path/to/your/app
node /path/to/tastefield/dist/cli.js init
```

Then restart Cursor or Claude Code and ask it to build a UI component.

## Commands

| Command | What it does |
| --- | --- |
| `init` | Scan repo → compile `.tastefield/` → register with local agents |
| `sync` | Re-scan and recompile; leaves agent config alone |
| `serve` | Start the MCP server over stdio (agents invoke this, not you) |
| `check <files>` | Check files against compiled standards. Exits `1` on errors — CI-ready |
| `skills` | Browse and import the curated skills.sh set |

Flags: `--dir <path>` to target another repo, `--no-register` to compile without touching agent config.

---

## Curated skills (skills.sh wrapper)

```bash
tastefield skills list [--category boundary] [--live]
tastefield skills playbooks
tastefield skills discover
tastefield skills import polish [--github]
tastefield skills imported
tastefield skills export --out curated.json [--live]
```

### Domain taxonomy

The index is not design-only. Tastefield compiles *brand* into executable context, and brand is vocabulary, tone, naming and positioning as much as it is spacing and colour.

This is a strategic call, not a taxonomic one. Aesthetic governance has a shelf life — base models keep getting better at spacing and type on their own. Voice and business-logic governance doesn't expire: a model will never independently know that a company can't say "cheap", can't use red on a checkout button for compliance reasons, or names its plans a particular way.

Two axes, deliberately not merged:

| Axis | Answers | Values |
| --- | --- | --- |
| `domain` | What is the skill *about*? | visual, brand, copy, motion, architecture, content, conversion, process |
| `category` | What kind of *rule* does it compile into? | structure, boundary, voice, motion, process |

Skills are frequently multi-domain and are not forced into one bucket. `popup-cro` — "intent-based popup design and copy that converts without degrading UX" — genuinely scores on conversion, visual *and* copy.

| Domain | Why it's indexed |
| --- | --- |
| `visual` | The original core: what compiled token and component rules govern |
| `brand` | The most durable governance layer — models never learn it independently |
| `copy` | Voice and microcopy compile into enforceable rules and outlive aesthetic ones |
| `motion` | Thinnest category in the compiled ruleset — import rather than reinvent |
| `architecture` | Cleaner component architecture upstream produces cleaner contracts for the scanner |
| `content` | Structured content is the schema-side neighbour of a design system |
| `conversion` | Where copy and visual meet revenue — the surface agencies are paid for |
| `process` | Review and extraction workflows that wrap around the compiler |

Scoring weights name matches above summary matches (skill names are short and deliberate), gives partial credit for breadth so a multi-domain skill outranks a single-domain one without letting three weak signals beat one strong one, and applies global disqualifiers that outweigh domain hits — so "deploy your design system to Kubernetes" doesn't read as design work.

Note what is deliberately *not* disqualifying: `email`, `social` and `seo` are weak copy signals, not negatives. A copywriting skill that mentions email is still a copywriting skill.

Not everything that scores gets in. Cold-email sequencing registers on the copy domain and still lands below the review threshold — it's copywriting, but it produces no rule that governs a codebase. A test enforces that outcome so nobody "fixes" it later.

### Finding candidates in a 600k-skill registry

Two shortcuts that don't work on their own:

**"Index Official."** Official is a *provenance* signal — built by the company that makes the tech — not a topic. It spans ~99 orgs including AWS, Bitwarden, MongoDB and Coinbase. Useful as a trust weight, useless as a category filter.

**"Use the topic pages."** They're hand-curated highlights, not a taxonomy. All eight topics together hold ~94 skills. Design & UI has 16 — and contains none of Figma's 20 design skills (`implement-design`, `figma-generate-design`, `figma-use`). High precision, poor recall.

`skills discover` harvests from three independent sources and ranks the union:

1. **Semantic search battery** — 18 deliberately multi-word queries (single words fall back to fuzzy matching and defeat the purpose)
2. **Owner allowlist** — 18 design-tooling publishers from Official, each with a written justification
3. **Topic pages** — high editorial quality, used as ground truth for calibration

`scoreRelevance()` scores 0–100 from topic tags, owner trust, name terms, summary terms, and negative terms. Thresholds lean toward `review` on purpose: a human sees the review pile and never sees the excluded pile, so a false negative costs more than a false positive.

Measured separation on known data — all 16 curated design skills score 40–100, while real infrastructure skills (Postgres migrations, Vault secrets, Stripe payments) score 0. Negative weighting is what makes that hold: `deploy-design-system` on AWS scores 0 despite "design system" in the name, because deployment terms outweigh an incidental mention.

Discovery produces a **shortlist, not a decision**. Category, status, rationale and playbook membership are assigned by hand — that judgement is the product.

16 hand-picked design & UI skills, verified against [skills.sh/topic/design](https://www.skills.sh/topic/design). IDs, sources and URLs are real; `summary` and `rationale` are our own editorial copy.

**Why curate rather than mirror.** skills.sh indexes 600k+ skills with Vercel's distribution behind it. Competing on catalogue size is unwinnable and beside the point. What isn't replicable is the editorial layer — a categorised, argued-for set that composes into your playbook — plus what happens *after* import: bundling, and serving over MCP with progressive disclosure instead of dumping every installed skill into the context window at once.

**Install counts.** Seed entries carry `installs: null` wherever a figure wasn't verified. Null renders as `—`, never `0` — a fabricated install count in a pitch deck is a credibility problem, and a test enforces this. Real counts come from `--live`.

**Auth and the fallback.** The skills.sh API authenticates with a Vercel OIDC token (short-lived, ~12h, resolved per request — never hoisted to module scope). Since that ties us to an API we don't control, `fetchSkillFromGitHub()` pulls the same public `SKILL.md` files straight from GitHub with no auth. A rate-limit change, terms change, or outage degrades the registry instead of breaking it. `hydrateInstalls()` never throws; it returns seed data with an error string.

Imported skills land in `.tastefield/skills/<owner>__<repo>__<slug>/` and are **never rewritten** — they install as-is. Third-party skills are prose instructions, not parameters, so there's nothing for a slider to move. Only first-party token-derived content is parametrically tweakable. Upstream filenames are path-traversal guarded on write.

### Categories

| Category | Skills |
| --- | --- |
| `structure` | frontend-design, vercel-composition-patterns, ui-ux-pro-max, sleek-design-mobile-apps |
| `boundary` | web-design-guidelines, polish, distill, quieter, bolder, design-taste-frontend, high-end-visual-design |
| `motion` | delight, emil-design-eng |
| `process` | extract-design-system, critique, canvas-design |

### Your playbook

`tastefield/frontend-baseline`, `tastefield/enterprise-saas`, `tastefield/editorial-minimal`, `tastefield/bold-marketing`, `tastefield/motion-craft`, `tastefield/review-pass`

---

## How it works

```
scan(repo) ──▶ ScanResult ──▶ compile() ──▶ .tastefield/ ──▶ MCP server ──▶ agent
```

**1. Scan** (`src/scan/`) reads what's already in the repo:

- **Tokens** — CSS custom properties, including Tailwind v4 `@theme` blocks. Classified into color / spacing / radius / typography / shadow / motion by name heuristics.
- **Components** — `cva()` variant definitions, which is where the real prop contract lives in shadcn-style codebases. Import specifiers resolve through the tsconfig alias so emitted imports match the project's own conventions.
- **Stack** — framework, Tailwind version, shadcn layout, alias.

A Tailwind v3 `tailwind.config.js` is **detected but never executed**. Running arbitrary code from a scanned repo is a security problem, and configs routinely import plugins that won't resolve. Tokens come from CSS, which is where shadcn-style setups keep them. If a v3 project has tokens only in the JS theme object, the scan warns rather than silently returning nothing.

**2. Compile** (`src/compile/`) derives standards from what was found — rules cite the project's actual tokens and components, so a violation message names a real replacement. Output:

```
.tastefield/
├── contracts.json    component contracts (import path, legal props, defaults)
├── tokens.json       tokens grouped by kind
├── rules.json        compiled standards, machine-readable
├── standards.md      human-readable — this is what gets reviewed in a PR
└── voice.json        copy/editorial rules
```

**3. Serve** (`src/mcp/`) exposes four tools over stdio:

| Tool | Purpose |
| --- | --- |
| `get_brand_standards` | Rules the generated code must satisfy, filterable by category |
| `get_component_contract` | Import specifier + legal prop values for one component |
| `get_design_tokens` | Tokens, filterable by kind |
| `check_compliance` | Agent self-checks its own output before presenting it |

Deliberately **not** one fat `get_everything` tool. The agent pulls the specific contract it needs, when it needs it. Piping an entire design system at an LLM is the failure mode this product exists to fix.

Context reloads per call, so edits to `.tastefield/` take effect without restarting the server.

---

## Enforcement, not advice

Rules carry a machine-checkable regex wherever one is expressible. A rule an agent merely reads is advisory; a rule that can be verified is enforcement.

The same checker (`src/check/`) powers all three consumers — the MCP `check_compliance` tool, `tastefield check` in CI, and the benchmark harness. One implementation, so the claim and the measurement can't drift apart.

Currently enforceable: `no-raw-hex`, `no-arbitrary-color-utility`, `no-arbitrary-values`, `no-inline-border-radius`, `no-marketing-filler`.

Advisory (needs semantic judgment): `prefer-design-system-components`, `no-invented-variants`, `no-restyling-primitives`, `empty-states-need-action`.

Rules are phrased as standards in product-legible language — "Never use hype words in UI copy" — not prompt-engineering jargon.

---

## Measuring whether it works

`src/bench/` scores agent output with and without the MCP server connected.

```
bench-runs/
├── baseline/     # same prompts, same model, MCP server NOT connected
└── governed/     # MCP server connected
```

```bash
node dist/bench/run.js --runs ./bench-runs --dir path/to/app
```

Reports error counts and **violation density** (violations per 100 lines) per arm, plus a per-rule breakdown. Density rather than raw count, so a governed run isn't rewarded merely for producing less code.

The harness deliberately does not call a model. It scores generations you collect yourself, so anyone can inspect exactly what was produced and re-score it.

**No real benchmark numbers exist yet.** Producing them requires running `src/bench/tasks.ts` against a real agent in both configurations. Report the measured reduction — not "100% compliance on Pass 1," which is unfalsifiable and won't survive a live demo.

---

## Testing

```bash
npm test                                              # unit — 7 tests
node scripts/smoke-mcp.mjs ./test/fixtures/sample-app # live MCP handshake
```

The smoke test spawns the CLI as a real subprocess and drives it with an actual MCP client. Unit tests can pass while protocol registration is broken, and that failure would only surface inside someone's IDE.

`test/fixtures/sample-app` is a Next.js + Tailwind v4 + shadcn app with a deliberately JSONC tsconfig (comments, trailing commas) and cva variants whose class strings contain colons (`ghost: "hover:bg-muted"`) — both of which broke naive parsing during development.

---

## Known limits

- Tailwind v3 JS theme objects aren't read (by design — see above)
- Token overrides in media queries / dark mode are skipped; first declaration wins
- Variant contracts attach to the first exported component in a file, so co-located subcomponents (`CardHeader`) show no variants
- Component detection requires a `components/` directory or a `cva()` call
- `check` takes explicit file paths, no glob expansion beyond what the shell provides

## Telemetry

None. Nothing is sent anywhere. Git history is not read, and no data leaves the machine.
