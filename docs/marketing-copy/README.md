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
| `sections/*.md` | Working drafts for pages II to X (live/locked copy preserved; new options beside them) |
| `HOMEPAGE_COPY.md` | Homepage (page I), all modules in one file. Edit here for anything on `/`. |
| `TASTEFIELD_HOMEPAGE_GOOGLE_DOCS.md` / `.docx` | Homepage export for Google Docs |
| `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.md` | Clean export for Google Docs (copy/paste) |
| `TASTEFIELD_SITE_COPY_GOOGLE_DOCS.docx` | Same export as Word (File → Open in Google Docs) |

Edit the section files. Do not treat chat paste as the source of truth.

The homepage lives in one file rather than in section files, because the fold and the
skill-or-playbook module have to agree on which unit the page is selling. You author skills,
you publish a playbook, and `recipe` is what the code calls it.

### Pull into Google Docs

1. Regenerate the Word versions after editing an export: `python3 scripts/md-to-docx.py`.
2. Preferred: upload the `.docx` to Drive, then Open with Google Docs. Headings, bold labels, and tables survive.
3. Or open the `.md`, select all, paste into a blank Doc. Tables may need a reformat.
