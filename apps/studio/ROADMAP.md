# Tastefield Studio — Depth Roadmap

The v0 shell ships the chrome, three pillars, and the Parametric Tweaker with static data. Depth is
added pillar by pillar, wiring the React UI to real Rust backend commands.

## Phase 0 — Shell (done)

- [x] Top navigation with centered segmented pill (no left sidebar)
- [x] Methods / Design System / Skills views
- [x] Parametric Tweaker slide-over (slider, toggle, segmented target)
- [x] MCP status indicator + status bar
- [x] Tauri v2 `src-tauri` stubs (`discover_skills`, `mcp_status`)

## Phase 1 — Skills + Parametric Tweaker

- [ ] `discover_skills` (Rust): scan Cursor / Claude / Codex / local skill dirs for `SKILL.md`
- [ ] Parse YAML frontmatter incl. the `parameters:` block
- [ ] Render Tweaker controls dynamically from `parameters:` (slider / toggle / select)
- [ ] Compile parameter values into the exported `SKILL.md` (liquid/handlebars)
- [ ] Empty states + "Browse examples" wired to bundled first-party skills

## Phase 2 — Methods

- [ ] Load / save Method manifests (`methods/*.yaml`) via Rust
- [ ] Compose view: attach Skills, Rules, knowledge, evals
- [ ] `lock` + `export` a Method to a thin orchestrator `SKILL.md`
- [ ] Eval runner surface (drift detection)

## Phase 3 — Design System (Streamliner)

- [ ] Rust Streamliner: parse `.tsx` -> Streamlined Component Schema
- [ ] Token surfaces (color, type, spacing, radii, shadow, motion) from real source
- [ ] Visual restraint checks before the agent writes code

## Phase 4 — Local MCP Server

- [ ] Embed MCP server in the Rust process; report live status to the UI
- [ ] Dynamically serve token-light context to connected agents
- [ ] Per-Field / per-Method context scoping

## Phase 5 — Publishing & Experiences

- [ ] Share / license Methods
- [ ] Interactive experiences layered on top of Methods
