# Tastefield Studio

The desktop app for Tastefield — an **Active Governance Studio** for local macOS. It serves
strict, token-light context to AI coding agents (Cursor, Claude, Codex) via a local MCP server so
they adhere to your design system instead of hallucinating UI slop.

- **Frontend:** React 19 + TypeScript + Vite
- **Shell:** Tauri v2 (Rust)
- **Layout:** native top navigation with a centered segmented pill (Methods · Design System ·
  Skills). No left sidebar.

## Status

This is the **v0 shell**. The UI chrome, three pillars, and the Parametric Tweaker are ported from
the frozen design pack in [`../../docs/design`](../../docs/design). Data is currently static; the
Rust backend commands (`discover_skills`, `mcp_status`) are stubs. See
[`ROADMAP.md`](./ROADMAP.md) for what comes next.

## Prerequisites

- Node.js 20+
- [Rust toolchain](https://www.rust-lang.org/tools/install) (`rustup`) — required for the Tauri
  shell. The web frontend runs without it.

## Develop

Run the frontend on its own (no Rust needed):

```bash
npm install
npm run dev        # http://localhost:1420
```

Run the full Tauri desktop app (requires Rust):

```bash
npm run tauri:dev
```

## Build

```bash
npm run build        # web assets -> dist/
npm run tauri:build  # native macOS bundle (requires Rust)
```

## Layout

```text
apps/studio/
├─ src/                 # React frontend
│  ├─ App.tsx           # chrome + 3 pillars + Parametric Tweaker
│  └─ index.css         # frozen design tokens
├─ src-tauri/           # Tauri v2 Rust shell
│  ├─ Cargo.toml
│  ├─ tauri.conf.json
│  ├─ capabilities/     # window permission sets
│  └─ src/lib.rs        # invoke handlers (discover_skills, mcp_status — stubs)
└─ index.html
```

> Icons are not committed yet. Generate them with `npm run tauri icon path/to/icon.png` before the
> first `tauri:build`.
