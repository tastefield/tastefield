---
name: marketing-copy-loop
description: >-
  Draft Tastefield marketing site copy one section at a time against
  docs/MARKETING_SITE_PLAN.md. Use when the user says "draft section", "write
  the hero copy", "marketing copy loop", "next section", "draft FAQ", or wants
  to work section-by-section on apps/web marketing copy.
---

# Marketing copy loop

Orchestrates section-by-section drafting for `apps/web`. Does not invent
positioning. The plan already has it.

## Brand memory (always load first)

1. `.agents/product-marketing.md`
2. `docs/marketing-copy/FORBIDDEN.md`
3. The matching `### N. …` section in `docs/MARKETING_SITE_PLAN.md`
4. Art direction + copy mechanics sections of that same plan (only if tone drifts)

User-facing copy must follow ASD-STE100 and Zinsser (simplicity, brevity, clarity, humanity). Never use em dashes. If a draft hits a pattern in FORBIDDEN.md, rewrite it and add the example to that file.

Do not re-open rejected claims listed in product-marketing context.

## Companion skills (already installed under `~/.cursor/skills/`)

| Phase | Skill |
|-------|--------|
| Draft | `copywriting` |
| Tighten | `copy-editing` |
| Dev-tool voice | `writing-guidelines` |
| Final polish | `deslop` |
| Stress-test claims | `grilling` |

Load them by reading their `SKILL.md` when that phase starts. Do not draft
without `copywriting`; do not ship a section without `copy-editing` + filler check.

## Sections (strict order)

Work **one section per turn** unless the user names another. Progress lives in
`docs/marketing-copy/PROGRESS.md`. Drafts live in `docs/marketing-copy/sections/`.

| # | File | Plan heading |
|---|------|----------------|
| 01 | `01-hero.md` | Hero |
| 02 | `02-compiled-today.md` | What's compiled today |
| 03 | `03-problem.md` | The problem |
| 04 | `04-advisory-vs-verified.md` | Advisory vs. verified |
| 05 | `05-agent-receives.md` | What the agent receives |
| 06 | `06-coexistence.md` | Coexistence |
| 07 | `07-registry.md` | Registry |
| 08 | `08-proof.md` | Proof |
| 09 | `09-faq.md` | FAQ |
| 10 | `10-founder-letter.md` | Founder letter |
| 11 | `11-install.md` | Install |

## Loop (run every section)

### 1. Orient

- Read `PROGRESS.md`. If a section is `in_progress`, finish it before starting another.
- Read the plan section. Prefer the **recommended** headline unless the user picks an alternate.
- Confirm primary CTA and any honesty badges (`Soon` / `Next`) the plan requires.

### 2. Draft

- Apply `copywriting` against the plan brief + product-marketing context.
- Write into the section file using `_TEMPLATE.md` structure.
- Produce **one** primary draft, not five parallel pages. Optional: keep 1–2 alternate
  headlines under `## Alternates` without rewriting the whole body.
- Stay inside the art direction voice: Field Guide editorial, not SaaS hype.

### 3. Filler / compliance check

Run against the draft file:

```bash
node scripts/check-marketing-copy.mjs docs/marketing-copy/sections/NN-slug.md
```

Fix any `no-marketing-filler` hits and any em dashes before continuing. Then read
`docs/marketing-copy/FORBIDDEN.md` and rewrite matches. If you find a new slop
pattern, add it to FORBIDDEN.md in the same turn.

### 4. Edit pass

- Apply `copy-editing` to the same file.
- Apply STE100 and Zinsser. Ignore writing-guidelines that conflict with locked Tastefield positioning or with FORBIDDEN.md.

### 5. Fresh-context review (three lenses)

Use separate subagents or a new turn with **only** the draft + plan section (no prior
drafting conversation). Return findings as bullet lists; do not rewrite yet.

1. **Skeptical senior developer** — distrusts marketing claims; flags anything unearned.
2. **Honesty auditor** — every claim traces to plan/blueprint; unbuilt work is badged.
3. **Rhythm pass** — couplets, countable pain, failure-state naming from plan copy mechanics.

Apply agreed fixes. Re-run the filler script.

### 6. Deslop + close

- Apply `deslop` for AI-tell cleanup on the prose (not code).
- Set status in the section file and in `PROGRESS.md` to `drafted` (or `needs-human` if blocked).
- Stop. Summarize in ≤5 bullets: headline chosen, open questions, rule-gap notes.
- Ask whether to continue to the next section — do not auto-advance.

## Hard rules

- Never draft the whole page in one pass.
- Never invent benchmarks, install counts, or shipped domains.
- Registry / marketplace / role recipes stay `Soon` or `Next` per the plan.
- Visual/art direction notes belong under `## Visual notes`, not in user-facing body copy.
- Prefer editing the section file over dumping copy only in chat.

## Kickoff prompts the user can paste

```
Draft section 01 (hero) using the marketing-copy-loop skill.
```

```
Continue the marketing copy loop with the next open section.
```

```
Revise section 04 after honesty-auditor notes: …
```
