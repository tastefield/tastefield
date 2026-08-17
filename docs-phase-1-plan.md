# Tastefield — Phase 1 Plan (Revised)

## Core Thesis

Tastefield is the Universal Brand Compiler for AI coding agents. It ingests an existing design system (Figma, zeroheight, Supernova, Storybook, raw codebase) — or generates one from scratch via TasteSampler — and compiles it into machine-executable context (`.tastefield/`) served locally over MCP to Cursor, Claude Code, and Windsurf.

Positioning: coexistence, not replacement. zeroheight/Supernova/Storybook/Figma remain the human source of truth; Tastefield is the active execution layer that makes their rules stick inside AI coding agents.

Phase 1 is split into three sub-phases to avoid launching all surface area at once. 1a proves the core claim works. 1b is the growth hook and public registry. 1c is agency retention infrastructure. 1b and 1c should not ship before 1a is solid.

---

## Sub-Phase 1a — Core Engine (prove it works)

Goal: a developer can run one command and get real, working brand enforcement in their IDE — no third-party integrations required.

- **Local CLI daemon** — `npx @tastefield/mcp init`, registers a local MCP server with Cursor/Claude Code/Windsurf. Lightweight, no required git monitoring.
- **Flagship ingestion path: raw codebase scan** (Tailwind config, CSS custom variables, `@/components`). This ships first because it has no external API dependency — Figma/zeroheight/Supernova/Storybook ingestion come after, prioritized by actual demand rather than built speculatively up front.
- **Compiler output** (`.tastefield/`):
  - `contracts.json` — component contracts (valid imports, props, variants, token bindings)
  - `standards.md` — brand rules and guardrails (renamed from "negative restraints" — enterprise-legible language throughout)
  - `voice.json` — copy/microcopy rules
  - Business and brand-logic rules (compliance constraints, forbidden patterns) are elevated alongside visual rules — this is the more durable governance layer as base models get better at aesthetics natively.
- **Success metric, reframed**: not "100% adherence on Pass 1" (unfalsifiable as a literal launch gate) — instead, a measured reduction in off-brand/hallucinated output vs. an ungoverned baseline, on a fixed test set.

---

## Sub-Phase 1b — The Hook (landing + registry)

Goal: the acquisition surface. Ships once 1a is real and working, so the demo isn't overselling vaporware.

- **Staged Taste Sampler demo**: 20–30 pre-baked, well-known sites (Stripe, Linear, Notion, etc.) power the hero interaction reliably. The general-purpose, arbitrary-URL extraction engine matures separately and isn't a dependency for the hook to launch.
- **Specimen wall**: pasting/selecting a site restyles multiple components at once — pricing card, form, data table, modal — not just one button. This is what proves systemic brand cascade rather than a single CSS trick.
- **Public registry — Recipes-led, not a Skills marketplace**: 10–15 first-party Recipes are the browsable hero unit. Each recipe card shows its underlying skills as visible "ingredients" (e.g., "6 skills bundled" with chips) — this borrows the recognized "skill" vocabulary from the broader ecosystem (Claude Skills, skills.sh) for legibility, without needing hundreds of entries to avoid looking sparse next to skills.sh's ~600k-skill catalog.
- **Parametric tweaker scope**: applies only to first-party, structured design-token content (radius, spacing, color, density, motion) — the same reason shadcn's theme editor works, because the underlying data is already numeric. It is explicitly *not* extended to arbitrary third-party skills, which are prose instructions, not parameters.
- **Curated skills.sh import wrapper**: 20–30 hand-picked, design/frontend-relevant skills pulled via the official skills.sh API (public, GitHub-backed, no scraping required). Displayed as install-as-is — browse, preview, toggle on/off — not tweakable. Keep a GitHub API fallback since Tastefield doesn't control Vercel's API terms or rate limits. The differentiation is what Tastefield does with a skill after import (bundle into a recipe, serve via MCP with progressive disclosure), not possessing a curated list — that alone is trivially replicable.

---

## Sub-Phase 1c — Studio + Agency Retention

Goal: give agencies a reason to keep paying past month one.

- **Cloud Web Studio**: ingestion pipelines, parametric tweaker, recipe management, sidebar showing connected sources with live sync status (🟢 synced / 🟡 syncing / 🔴 error).
- **Agency multi-tenant workspace**.
- **Prototype the CI/CD PR bot here, not deferred to "Phase 2."** The $99–299/mo agency retainer only survives past 90 days if it's tied to continuous compliance checking (a bot that blocks/flags off-brand PRs) rather than occasional manual slider updates a client will notice going stale.

---

## Privacy & Telemetry

- Telemetry is strictly opt-in, off by default — especially git-commit monitoring on private repos. Enterprise security teams will blacklist an MCP server that phones home by default, even with "anonymized" framing. This also means the original RLHF-data-resale plan is dropped as a Phase 1/2 revenue path.

---

## GTM & Monetization (flagged assumptions)

| Segment | Motion | Price | Status |
|---|---|---|---|
| Indie developers | Free CLI, PLG | Free | Low risk |
| Agencies | Hosted studio + PR bot | $99–299/mo | **Unvalidated** — tie to compliance bot, not static config |
| Enterprise design system teams | SSO, connectors, audit logs | $10k–30k/yr | **Unvalidated** — no prospect conversations behind this number yet |

---

## Explicit Scope Cuts (not Phase 1)

- Standalone public Skills marketplace tab competing on catalog volume with skills.sh
- Generic "tweak any skill" interactive editor for arbitrary third-party content
- Selling telemetry/RLHF data to frontier labs
- x402 / agent-to-agent micropayments (Taste Arena, bounties, ELO leaderboard)
- Full production CI/CD bot beyond an 1c prototype

---

## Revised Victory Conditions

- CLI setup to working MCP context in under 30 seconds
- One ingestion path (raw codebase) fully reliable; others added by demand
- Measurable, benchmarked reduction in off-brand output — not a 100% claim
- Specimen wall live on 20+ curated presets with real engagement/conversion tracking
- 3–5 agencies or design engineers actively using Recipes (not just installed once)
- Agency pricing and enterprise pricing each validated against at least a handful of real prospect conversations

---

## Open Questions

- How many raw-codebase-scan edge cases (non-Tailwind stacks, CSS-in-JS, monorepos) are worth handling in 1a before it's "good enough" to demo?
- What's the minimum viable version of the CI/CD PR bot that still makes the agency retainer defensible?
- Should the skills.sh import wrapper be visible to end users at all in 1b, or purely an internal sourcing tool for building first-party Recipes faster?
