# Claude Design Brief — Tastefield Studio

Paste this into Claude Design together with [`TASTEFIELD_BLUEPRINT.md`](../../TASTEFIELD_BLUEPRINT.md).

## Role

You are designing **Tastefield**, a local macOS AI Governance Studio (Tauri v2). It is an Active Governance Studio — not a SaaS dashboard, not a Figma clone, not a markdown file manager.

## Hard layout rules

- Native macOS **top navigation** only.
- Centered floating **segmented pill**: `Methods | Design System | Skills`.
- Workspace dropdown **top-left**; MCP status badge + search **top-right**.
- **No left-hand sidebar.**
- Label UI with blueprint terms only: Method, Surfaces, Streamlined Component Schema, Skills, Principles (Lexicon / Restraints), Exemplars.

## Screens to produce (in order)

1. **App chrome + Methods empty state** — one composition; Method as root context for Cursor.
2. **Design System** — Surfaces gallery + `[ + Extract Brand Tokens from URL ]`.
3. **Skills** — grid feed + `[ + Create Vibe Skill from URL ]`.
4. **Parametric Tweaker slide-over** — right inspector with Mac slider, toggle, segmented pill (from `parameters:` in SKILL.md).

## Visual direction

- Quiet native macOS: vibrancy, traffic lights, restrained density.
- Avoid purple SaaS gradients, dashboard card grids, and “AI glow.”
- Typography: system / SF-like; clear hierarchy without loud display fonts.

## Prompt seed

> Design Tastefield’s app chrome with centered Methods / Design System / Skills pill, then the Methods empty state. Native macOS, no left sidebar, no purple SaaS look. Blueprint ontology labels only.

Export each approved frame before starting the next. Drop exports into `docs/design/exports/` and update `SCREEN_INDEX.md`.
