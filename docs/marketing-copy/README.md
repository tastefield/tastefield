# Marketing copy drafting

Section-by-section drafts for `apps/web`, driven by `docs/MARKETING_SITE_PLAN.md`.

## Setup (done)

Personal skills installed to `~/.cursor/skills/`:

- `copywriting` from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- `copy-editing` from the same pack
- `writing-guidelines` from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)

Also used from your existing install: `deslop`, `grilling`.

Project wiring:

- `.agents/product-marketing.md` (brand memory)
- `docs/marketing-copy/FORBIDDEN.md` (rhetoric and punctuation bans)
- `.cursor/skills/marketing-copy-loop/` (the section loop)
- `scripts/check-marketing-copy.mjs` (`no-marketing-filler` plus em dash check)

Writing rules: ASD-STE100, Zinsser (simplicity, brevity, clarity, humanity), no em dashes.

## How to run

In Cursor, say:

```
Draft section 01 (hero) using the marketing-copy-loop skill.
```

Or:

```
Continue the marketing copy loop with the next open section.
```

The agent should: load brand memory and FORBIDDEN.md, draft one section file, run the filler script, edit, review, deslop, then stop and ask before the next section.

## Files

| Path | Role |
|------|------|
| `PROGRESS.md` | Status table |
| `FORBIDDEN.md` | Patterns to avoid. Add new ones when you catch them. |
| `_TEMPLATE.md` | Structure for each section draft |
| `sections/*.md` | Working drafts (live/locked copy preserved; new options beside them) |
| `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.md` | Clean export for Google Docs (copy/paste) |
| `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.docx` | Same export as Word (File → Open in Google Docs) |

Edit the section files. Do not treat chat paste as the source of truth.

### Pull into Google Docs

1. Preferred: upload `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.docx` to Drive, then Open with Google Docs.
2. Or open `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.md`, select all, paste into a blank Doc.
