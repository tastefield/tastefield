# Tastefield — product marketing context

Read this before drafting marketing copy. The copywriting skill looks for this file.

## Product

Tastefield compiles a repository's existing design system into executable context and
serves it to local AI coding agents over MCP. It is the enforcement layer — not a design
tool, not a passive markdown manager, not a skill registry.

## One-line category definition

> A rule an agent merely reads is advisory; a rule that can be verified is enforcement.

## Audience

Developers and design-system owners already using Claude Code, Codex, or Cursor, who
have a real existing system (tokens, components, voice rules) and are tired of reviewing
AI output for things a regex could catch.

## Primary action

Install the local MCP server into the editor. No account. Nothing leaves the machine.

## Positioning (locked)

- **Tagline: "The brand and taste layer for agents."** (2026-08-17, supersedes the
  brand-only headline noun below.) Verb stays enforcement-side (compiled, checked,
  verified) even though the noun widened to include taste. Widening the noun and the
  verb together was the earlier failure mode; only the noun moved this time.
- Headline noun (page copy, body sentences): brand. Headline verb: code-side. ("Your
  brand, enforced as the AI types.") Still the default for section prose; the tagline
  above is the compact, top-of-page line.
- Coexistence, not replacement: Figma / zeroheight / Storybook stay the human source of truth.
- Defensible half is **compiled + checked**, not skill bundling or taste generation.
- Local-only, no telemetry — lean into being narrow, not apologise for it.

## Shipped client trio (updated 2026-08-17)

Claude Code, Codex, and Cursor. Windsurf dropped from the trio on the user's call, based
on current usage, not a product change. Codex has not been tested end-to-end against the
MCP server; it's being listed as shipped on the assumption that a standard MCP server
works with any MCP-compatible client. If that assumption turns out wrong, badge Codex
`Soon` instead and revert to naming only what's actually been smoke-tested.

## Rejected claims (do not use)

- "the taste engine for AI agents" — "engine" implies Tastefield generates or supplies
  taste. Still rejected. "Brand and taste layer" survives because the verb around it
  stays checked/compiled, not generated.
- "design system intelligence"
- Leading with recipes / marketplace / skill bundling
- "100% compliance on Pass 1" or any unfalsifiable guarantee
- Fabricated install counts (unknown = null / em dash)

## Proof available today

- 59 unit tests; MCP handshake smoke-tested
- Benchmark once: baseline density 31.21 → governed 0 (synthetic caveat: both arms
  hand-authored in one sitting — do not oversell as live agent proof)
- Nine compiled rules ship today, including `no-marketing-filler` and
  `empty-states-need-action` (voice domain is real, not only visual)

## Brand memory files (canonical)

1. `docs/MARKETING_SITE_PLAN.md` — section briefs, headline options, copy mechanics, art direction
2. `TASTEFIELD_BLUEPRINT.md` — decisions with reasoning; cite by section, not stale line numbers when possible

## Voice

Follow `docs/marketing-copy/FORBIDDEN.md`.

- ASD-STE100 Simplified Technical English
- Zinsser: simplicity, brevity, clarity, humanity
- Never use em dashes
- Name the failure state in plain words. Put hex codes and rule IDs in the demo, not in the sentence.
- Badge unbuilt work (`Soon` / `Next`)
- Do not invent install counts

## Forbidden filler (matches compiled rule `no-marketing-filler`)

seamless, seamlessly, effortless, effortlessly, unlock, revolutionize, supercharge,
game-changing, delightful, magic
