# Tastefield — working context

Read this before changing anything. It records decisions and the reasoning behind them, so they don't get quietly undone.

## What this is

Tastefield compiles a repository's existing design system into executable context and serves it to local AI coding agents over MCP. Positioning is **coexistence, not replacement**: zeroheight / Supernova / Storybook / Figma stay the human source of truth; Tastefield is the active layer that makes their rules stick inside Cursor, Claude Code and Windsurf.

Phase 1 (core engine + public registry): the core engine is **built and passing 59 tests**; the public registry (browsable first-party recipes, `npx` install) is not started. Phase 2 (Studio — Parametric Tweaker, landing page) and Phase 3 (agency workspace, CI/CD PR bot) are also not started. Renumbered 2026-08-13 — see "Roadmap reframe proposal" below for why.

## Vision — beyond code (not built, not roadmapped as a phase)

Today Tastefield only governs code — the AI writing components inside an IDE. The longer bet: as AI starts generating more than code (marketing graphics, social assets, ad copy), something has to keep all of that on-brand too, not just the codebase. Working name: **Creative & Brand Intelligence** — extends Taste DNA (tokens, negative restraints, voice rules) to any AI generating any output for a company, not just a coding agent in Cursor.

Further out: a multi-agent setup where specialist AIs (a design agent, a dev agent, a review agent) transact with each other autonomously to complete a task end-to-end — an "agent economy" for design and dev work. Tastefield's role doesn't change in kind if that happens: it's still the layer making sure whatever comes out — regardless of which agent produced it, or how many agents the task passed through — matches the company's actual brand rather than generic AI output.

Status: vision, not roadmap. No phase number, no committed work. Don't let this bleed into Phase 2/3 descriptions until it's actually decided.

## Non-negotiables

These exist for reasons that cost real effort to learn. Don't "fix" them.

1. **No telemetry.** Nothing is sent anywhere. Git history is not read. The original plan included selling RLHF telemetry to frontier labs — dropped, because enterprise security teams blacklist MCP servers that phone home, and the indie users who'd allow it don't generate enough volume to matter.

2. **Unknown install counts are `null`, never `0`.** Rendered as an em dash. A fabricated install figure in a pitch deck is a credibility problem. There's a test enforcing this.

3. **Never claim "100% compliance on Pass 1."** Models are stochastic; the claim is unfalsifiable and won't survive a live demo. Report measured violation-density reduction instead.

4. **Curation is not automatic.** The scheduled sweep produces a *shortlist*. Category, status, rationale and recipe membership are assigned by hand. If that becomes automatic, this is just a worse mirror of skills.sh.

5. **Skills that fail a security audit never enter a recipe.** Test-enforced.

6. **The Tailwind v3 config is detected but never executed.** Running arbitrary code from a scanned repo is a security problem and configs import plugins that won't resolve.

7. **The MCP server has no `get_everything` tool.** Progressive disclosure only. Dumping a whole design system into a context window is the failure mode this product exists to fix.

## Open questions — not decided, don't build against these

- **Hosted Recipe API (`mcp.tastefield.com`)?** Raised in 2026-08-13 strategy sessions: a live endpoint that lets a third-party app (e.g. one built with Pixel Point's Toolcraft) fetch brand rules at runtime and merge them into end-user prompts before hitting an LLM. This is content governance for end users, not code governance for developers — a different product surface than anything built today. It also cuts directly against non-negotiable #1 (no telemetry, nothing sent anywhere, local-only) — not because it's telemetry, but because a queryable network endpoint is a different trust model than "runs on your machine, phones home to nobody." Don't build this without explicitly revisiting whether "local-only" is a permanent constraint or a Phase-1-only one. If it proceeds, it should be its own roadmap phase, not a sub-bullet under a GTM idea.

## Roadmap reframe proposal (2026-08-13)

A strategy note from today proposed renumbering the roadmap around network effects and governance instead of token savings. One piece of it is now decided; the rest is still open.

**Decided:** the phase boundaries were redrawn — see the intro. Phase 1 now includes the public registry alongside the core engine (Day-1 "Explore Recipes" tab, 10-15 first-party recipes, browsable via `npx @tastefield/mcp --recipe=X`). What's left of old Phase 1b (Studio: Parametric Tweaker, landing page) is renamed Phase 2. Old Phase 1c (agency workspace, CI/CD PR bot) is now Phase 3.

Still open:

- **Messaging shift (low-risk, worth adopting on its own).** Stop pitching the AST Streamliner as "saves N% on tokens" — that value disappears if inference gets cheap. Pitch it as component compliance / hallucination prevention: it stops the agent from inventing props or hardcoding classes outside the design system. No code change, just copy.
- **CI/CD PR bot as the retainer driver.** Re-prioritizes what's already listed under Phase 3 (agency workspace, CI/CD PR bot) — the pitch is that the bot, not "remote sliders," justifies a recurring retainer. Consistent with what's already planned, just changes build order within Phase 3.
- **Taste Arena / bounty marketplace (new).** Blind-voting on UI generations, $50 micro-bounties, an ELO leaderboard for "Tastemakers." Not on any current phase. Revenue would be marketplace fees + agency SaaS tiers — explicitly framed as the replacement for the already-rejected "sell telemetry to AI labs" plan (see non-negotiable #1). The original strategy note calls this "Phase 3" — that slot is already agency workspace/CI-bot in this file's numbering, so if adopted this would be Phase 4.
- **Autonomous A2A payments via x402 (new).** Lets coding agents pay a Tastefield endpoint per request in USDC over HTTP 402. Checked: x402 is real — an open protocol from Coinbase/Cloudflare, live since May 2025 with real transaction volume, governed by a foundation that lists Anthropic among its members. Not fabricated, but still a brand-new, undecided product direction — and like the hosted Recipe API question above, it means Tastefield accepting network requests, which needs weighing against non-negotiable #1's local-only reasoning. Would be Phase 5 in this file's numbering if the Arena above is adopted as Phase 4.

## Backlog ideas (cheap, no new decisions required)

- **Toolcraft contract-doc export.** Toolcraft (`npx @pixel-point/toolcraft create`, real product by Pixel Point) scaffolds AI-buildable creative-tool apps and ships an `AGENTS.md` + `docs/toolcraft/` contract-file tree that the coding agent reads while building. Structurally identical to what `src/compile/` already outputs for Cursor/Claude Code/Windsurf — add Toolcraft as a compile target. Governs the code the agent writes when scaffolding a Toolcraft app. Does not require the hosted API above, and doesn't touch any non-negotiable.

## Landing page hero — "Specimen Wall" concept (Phase 2, not built)

Decided 2026-08-13. Replaces a "single button re-styles" demo — that reads as a CSS trick and doesn't prove the engine extracts systemic design tokens rather than one color value.

Layout: URL input at top. Left column is the Parametric Tweaker (Visual Density, Radius, Motion sliders — not built, see Phase 2 note above). Right/bottom is a Specimen Wall: 5–6 distinct UI primitives (pricing card, settings form, data table, alert modal, nav) in a staggered layout.

Interaction: paste a URL (e.g. `stripe.com`) → every component snaps to the extracted tokens simultaneously — color, radius, type — proving the tokens cascade across a whole component set, not one element. Default state (no URL pasted) is deliberately generic/inconsistent styling so the before/after reads clearly without copy. Touching a Tweaker slider updates every component's spacing/padding/margins simultaneously — same proof, applied to manual tuning instead of extraction.

Depends on: Parametric Tweaker + Specimen Wall UI, both Phase 2 work, neither built yet.

## Architecture

```
scan(repo) → ScanResult → compile() → .tastefield/ → MCP server → agent
```

- `src/scan/` — CSS custom properties (incl. Tailwind v4 `@theme`), cva variant contracts, stack detection
- `src/compile/` — derives rules that cite the project's real tokens and components
- `src/check/` — one rule checker, shared by the MCP tool, the CLI, and the benchmark. One implementation so the claim and the measurement can't drift
- `src/mcp/` — four tools: `get_brand_standards`, `get_component_contract`, `get_design_tokens`, `check_compliance`
- `src/registry/` — skills.sh index: client, curation, discovery, momentum, snapshots, full sweep
- `src/bench/` — measures governed vs. ungoverned agent output

Rules carry a machine-checkable regex wherever expressible. A rule an agent merely reads is advisory; a rule that can be verified is enforcement.

## Two axes, deliberately not merged

- `domain` — what a skill is **about**: visual, brand, copy, motion, architecture, content, conversion, process
- `category` — what kind of **rule** it compiles into: structure, boundary, voice, motion, process

Skills are frequently multi-domain and must not be forced into one bucket.

Brand and copy matter more over time than visual rules. Base models keep getting better at spacing and colour on their own; they will never independently know that a company can't say "cheap" or can't use red on a checkout button for compliance reasons.

## Bugs already found and fixed — don't reintroduce

- **cva class strings contain colons.** `ghost: "hover:bg-muted"` — a naive parser reads `hover:` as a variant key. The parser is string-literal aware.
- **tsconfig is JSONC.** Comments and trailing commas mean `JSON.parse` fails. Alias reading uses a targeted regex.
- **Plurals.** `review-animations` didn't match `animation`. Term matching allows an optional trailing `s`.
- **Multi-word terms vs. hyphenated slugs.** `"design system"` never matched `design-system`. Haystacks are normalised (`-_/` → space) before matching.
- **Domain floor was above single-summary-match weight.** A skill described as "popup design and copy" reported neither domain. Floor is 6, summary match is 8.
- **Merging leaderboard views.** `trending` and `hot` report *windowed rates* in the same `installs` field as cumulative. Merging naively overwrites 770,700 with 4,100.
- **OIDC tokens rotate ~12h.** A stored `VERCEL_OIDC_TOKEN` secret dies before the next 3-day cron run. CI mints a fresh one from a long-lived `VERCEL_TOKEN`.

## Registry facts (verified 2026-08-12/13)

- skills.sh holds **1,176,382 skills**. It drifted ~8,000 between two reads minutes apart.
- Full sweep: 2,353 pages at 500/page, ~4 min at the 600 req/min limit. Cheap.
- The expensive stage is enrichment — the **listing endpoint returns no description and no topics**. Detail-fetch is one request per candidate.
- The detail endpoint returns a content `hash`, so repeat runs only re-fetch what changed.
- All eight topic pages together hold ~94 skills. They're editorial highlights, not a taxonomy.
- **Design & UI (16 skills) contains none of Figma's 20 design skills.** A real coverage gap.
- `emil-design-eng` has **203.7K installs** and was invisible because the topic page links `emilkowalski/skill` (singular) when the source is `emilkowalski/skills`. A broken link on skills.sh hid a top-5 design skill.
- **Vercel shipped "Packs"** — bundling skills into one install command. That is the recipe concept. Gaps: packs are unlisted by default (no public discovery) and sharing is scoped to Vercel accounts/teams. Treat as a window, not a moat.
- `ui-ux-pro-max` (312K installs) **fails** the Gen Agent Trust Hub audit — flagged, not bundled.
- `design-taste-frontend` (350K installs) already ships three named dials — design variance, motion intensity, visual density — as prose. Validates the parametric tweaker; the gap is that theirs is text, ours would compile.
- `extract-design-system` (127K installs on a 176-star repo) is TasteSampler, already shipped. Differentiation has to be enforcement *after* extraction, not extraction.
- **First live sweep ran 2026-08-13** (depth 5000, no `--dry-run`): 5,283 skills swept, 153 cleared the relevance floor (10 `include`, 143 `review`), 0 removed since there was no prior snapshot. Confirms `client.ts`'s OIDC auth, pagination, and the scoring/momentum pipeline work end-to-end against the real API, not just mocks. Snapshot at `registry/snapshots/2026-08-13.1.json`.

## Competitive landscape (verified 2026-08-13)

Checked against real products, not just the pitch deck framing:

- **Open registries** (skills.sh, skillpm) — static markdown directories. Differentiation unchanged: they distribute files, Tastefield compiles and enforces them.
- **Brand-data APIs** — Context.dev and Yoku.app are both real, both resolve a domain to structured brand JSON (logos, hex colors, fonts) over a REST API, both offer an MCP server. Neither compiles component contracts or negative restraints — they hand back facts, not rules. If Tastefield ever ships the hosted endpoint above, it starts competing in this exact category instead of staying differentiated from it.
- **Enterprise brand enforcers** — Adobe Brand Intelligence is real, launched at Adobe Summit April 2026. Builds a "brand ontology" from explicit + implicit inputs (guideline docs, approvals, review history), staffed with forward-deployed engineers. Their own marketing claims it "guides content creation," not just validates after the fact — a pure reactive-vs-proactive pitch against them needs checking, not assuming.

## What is NOT done

- **The benchmark has only been run once, synthetically.** 2026-08-13: 8 tasks, both arms hand-authored by the same coding agent (not two independent live agent sessions) against `test/fixtures/sample-app`. Baseline density 31.21 (49 errors / 5 warnings over 173 lines); governed density 0. Full output in `bench-runs/RESULTS.txt`. This proves the harness and checker work end-to-end on realistic code — it does **not** yet prove the claim against real prompt variance, since one author wrote both arms with full knowledge of what each arm was supposed to demonstrate. The still-open, higher-value version: collect governed/baseline generations from two actual agent sessions (e.g. Claude Code with vs. without the Tastefield MCP server wired in) and re-run `node dist/bench/run.js` unchanged against those.
- **The MCP server has never been verified against a real IDE.** The protocol handshake is smoke-tested with a real MCP client over stdio, which proves the plumbing — not that it changes what Cursor writes.
- Only the Phase 1 core engine is built. Phase 1's public registry, Phase 2 (Studio: landing page, and the "Parametric Tweaker" GUI referenced in strategy docs), and Phase 3 (agency workspace, CI/CD PR bot) are all unstarted. Strategy docs describe the Tweaker in present tense; it doesn't exist yet.
- Pricing ($99–299/mo agency, $10k–30k/yr enterprise) is unvalidated — no prospect conversations behind those numbers.

## Testing

```
npm run build && npm test                              # 59 unit tests
node scripts/smoke-mcp.mjs ./test/fixtures/sample-app  # live MCP handshake
```

`test/fixtures/sample-app` deliberately includes a JSONC tsconfig and cva class strings with colons — both broke naive parsing during development.

Prefer running code over describing it. Every bug above was found by executing something, not by reading it.
