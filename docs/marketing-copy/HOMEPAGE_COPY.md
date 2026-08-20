## Meta

- Section: Homepage, page I `/`, all modules in one file
- Plan heading: `docs/HOMEPAGE_OUTLINE.md` (page I) and `docs/MARKETING_SITE_ARCHITECTURE.md` (Part 3)
- Status: drafted, needs a human pick per module
- Skills used: copywriting (2026-08-20 skill-authoring reframe)
- Filler check: run `node scripts/check-marketing-copy.mjs docs/marketing-copy/HOMEPAGE_COPY.md`
- Google Docs export: `TASTEFIELD_HOMEPAGE_GOOGLE_DOCS.md` and `.docx`

**The reframe this file exists for (2026-08-20).** The page is about authoring a skill, not
about a playbook. The blueprint's unit distinction is the spine of the copy: you author
skills, you publish a playbook, and `recipe` is what the code calls it. So the fold sells
the authoring gesture, and the result module names which unit came back. A source that
covers one job returns a skill. A job that needs several skills in a set order returns a
playbook, and the playbook is the bundle plus the gates, never "a skill, but bigger."

Nothing in `sections/01-hero.md` is deleted by this file. The three Composer-reframe
variants there stay as options; the sets below are the skill-authoring versions of the same
slots.

## User-facing copy

### Screen 1, module 1. The fold

Eyebrow, all variants: The brand and taste layer for agents.

Trust chips, all variants: Local run · No account · No telemetry

Works-with row, all variants: Claude Code · Codex · Cursor

#### Variant 1. The authoring gesture (recommended)

**H1.** Author a skill from something you already wrote.

**Subhead.** Paste a brand guide, an article, a SKILL.md, or a repo. Tastefield writes the
skill, and every rule inside it quotes the line it came from.

**Body.** Read the skill before you use it. Keep the rules that are right and drop the
rest. Add the result to Claude Code, Codex, or Cursor, and it checks the work your agent
writes.

**CTAs.** Author a skill · Start from a role

Why this one. It leads on the verb the product performs and on the unit the product ships,
so the page stops depending on a word the visitor has not met yet. "Already wrote" carries
the market boundary inside the sentence, because it excludes the visitor who needs a brand
invented. It reads the same to a creative director holding a guide and to a developer
holding a repo.

#### Variant 2. The agent's missing skill

**H1.** Give your agent a skill built from what you already wrote.

**Subhead.** Your agent has never read your brand guide, so it guesses. Paste the guide and
get back a skill it can follow, with the source line behind every rule.

**Body.** The skill holds the restraints from your source, the rules that check them, and
the quoted evidence for each one. Install it in your editor and the checking keeps running
while your agent works.

**CTAs.** Author a skill · See what it catches

Why this one. It names the failure state in the first clause, which is the copy mechanic
already adopted on this site. Cost: the H1 is eleven words and it spends three of them on
the agent rather than on the reader.

#### Variant 3. The two units, up front

**H1.** Write it once. Your agent gets a skill it can follow.

**Subhead.** Paste one source and get one skill. Paste enough for a job with several stages
and get a playbook, which is those skills in order with a check between them.

**Body.** Every rule arrives with the line it came from, so you can see where it was
decided. Keep what fits, drop what does not, then add the result to Claude Code, Codex, or
Cursor.

**CTAs.** Author a skill · Start from a role

Why this one. It puts the skill and playbook distinction in the fold instead of holding it
for module 5. Two risks to weigh. The playbook half is `Next`, so the fold promises a unit
the site cannot deliver yet, and the subhead runs to two long sentences before the reader
has done anything.

*Recommendation: Variant 1, with module 5 doing the playbook work.* Variant 3 only becomes
the pick once a playbook is buildable.

### Screen 1, module 2. The Composer

**Label above the input.** Paste a source.

**Source chips.** Brand guide · Article · SKILL.md · Code · Repo · Transcript · Live site
(`Soon`)

**Helper line under the input.** The box starts with a real brand-guide excerpt in it, so
you can run one before you paste anything of your own.

**What comes back, by source.** The output shape is the same every time.

| Paste | Get |
|-------|-----|
| A brand guide or Notion page | Tone rules, banned phrases, and do and do-not pairs |
| An article about your voice | Voice restraints, each quoting the line it came from |
| A SKILL.md you already use | The same skill, with checkable rules attached |
| A podcast transcript | Show-notes voice and sonic brand restraints |
| Pasted code or a component | The contract that component already follows |
| A repo | Tokens and component contracts |

### Screen 2, module 3. The result is a skill

**Eyebrow.** The result

**Headline option A (recommended).** A skill is the thing you edit.

**Headline option B.** Read the skill before your agent does.

**Headline option C.** Nine rules, and the sentence each one came from.

**Body.** A skill holds three things: the restraints compiled from your source, the rules
that check them, and the quoted evidence behind each rule. Nothing arrives as a guess, and
nothing is hidden behind a summary.

**Count line, generated from the run.** 9 restraints compiled from 1 source. Every one
quotes the line it came from.

**Restraint card fields.** Trigger · Decision · Reason · Evidence · Trade-off

**Card actions.** Keep · Drop

**Card note.** Evidence stays visible when a card is collapsed. A restraint with no quoted
source is a guess, and this page does not ship one.

### Screen 2, module 4. Result tabs

**Tabs.** Restraints · Evidence · What your agent sees · Violations caught

**Rule for the tab row.** A tab appears only when the source produced something behind it.
A pasted article yields no component contracts, so no contracts tab opens on an empty
panel. `What your agent sees` appears every time.

### Screen 2, module 5. Skill or playbook

This is the module the reframe adds, and the one the site has been missing.

**Eyebrow.** What you made

**Headline option A (recommended).** Every result is labelled a skill or a playbook.

**Headline option B.** How to tell a skill from a playbook.

**Headline option C.** Skill or playbook, named on the card.

**Body.** A skill covers one job. A playbook covers a job that takes several skills in a
set order, and it carries the check that has to pass before the next stage gets its
context. The label sits on the result card, so you always know which unit you are holding.

| Unit | You get it when | What it carries | Status |
|------|-----------------|-----------------|--------|
| Skill | Your source covers one job | Restraints, checkable rules, quoted evidence | Live |
| Playbook | The job takes several skills in a set order | Those skills, their order, and a check between each stage | `Next` |

**The line to hold.** You author skills. You publish a playbook. A playbook is a bundle of
skills with rules between them, so it is a different unit rather than a longer skill.

**On the gate, badged `Next`.** In a playbook, stage two does not receive its context until
stage one passes its own check. Ordering skills in a text file asks an agent to comply. A
gate does not ask.

### Screen 2, module 6. How the skill was graded

**Eyebrow.** Labels

**Headline option A (recommended).** Every skill says how it was graded.

**Headline option B.** Checked, or judged. The card tells you before you install.

**Body.** Read the label before you install anything, here or in the registry.

| Label | What it means |
|-------|---------------|
| Checked | The skill carries rules a machine can fail, and it names the line that broke one |
| Judged | The skill drafts, and the result depends on your prompt and context |

**Judged callout, locked wording, do not edit.** This skill is an LLM agent running with
pre-configured instructions and context to steer the result. The output still depends on
the prompting and context you give. It does not check.

### Screen 3, module 7. Install

**Headline option A (recommended).** Add the skill to your editor with one command.

**Headline option B.** Install it and keep working.

**Human row label.** Run this yourself

**Agent row label.** Or paste this into your agent and let it wire itself in

**Editor control.** Claude Code · Codex (`Soon`) · Cursor

**Body.** An export is a snapshot of the skill as it stands today. The live connection is
the version that keeps checking while your agent writes.

**Codex note.** Codex is listed on the assumption that a standard MCP client works with a
standard MCP server. End-to-end proof in that editor is still open.

### Screen 3, module 8. The four steps

Idle state of the result area. The real result replaces it in place after a run.

| Step | Chip | Line |
|------|------|------|
| 01 Paste a source | `SOURCE` | A guide, an article, a SKILL.md, or a repo |
| 02 Pick a role | `ROLE` | The role sets which stages the job needs |
| 03 The Composer fills the gaps | `DRAFT` | Your source supplies the restraints for each stage |
| 04 Install it and check it | `CHECK` | The rules run against the work your agent produced |

### Screen 3, module 9. The check, as the last act

**Eyebrow.** The check

**Headline option A (recommended).** The last step is the one that can fail.

**Headline option B.** Run it against a task set that does not move.

**Body.** Tastefield runs your skill against a locked task set, then runs the same set
without it, and reports the difference in violation density. The task is built from the
restraints you just compiled, so the work tempts the rule it is testing.

**Honesty line, keep it attached.** The number on this page comes from your run. The
two-arm benchmark on live agent sessions has not run yet, so no figure of ours sits above
yours.

### Meta

**Title.** Tastefield: author a skill for your AI agent from what you already wrote

**Description.** Paste a brand guide, an article, a SKILL.md, or a repo. Get a skill your
agent can follow, with the source line behind every rule. Runs on your machine, with no
account.

## Alternates

Fold lines considered and set aside, with the reason:

- Author the skill your agent has been missing. *(implies Tastefield knows what is missing)*
- Compile your brand into a skill. *(compile needs a beat of explanation for the creative half)*
- Stop hand-writing SKILL.md files. *(assumes the reader already writes them, which narrows the fold to one audience)*
- One paste. One skill. *(staccato pair, banned)*
- We do not sell you plays. We compile yours. *(antithesis reframe, banned)*
- Your playbook, compiled. *(leads with the unit that is not built yet)*

Module 5 headlines considered and set aside:

- A skill is one job. A playbook is many. *(isocolon pair, banned)*
- Not every result is a playbook. *(antithesis reframe, banned)*

## Visual notes

- Module 5 is a two-row table beside the result card, not a prose block. The point is that
  the classification is interface, so the reader sees the label on their own result rather
  than reading a definition of it.
- Module 6 renders the two labels as chips in the same type as other product labels. The
  judged callout is the dashed box, on judged skills only.
- The playbook row in module 5 carries the `Next` badge in the table cell, not in the prose.
  A badge in a cell reads as status. A badge in a sentence reads as an excuse.
- Trust facts stay chips, per the ruling in `docs/HOMEPAGE_OUTLINE.md` section 3. Three
  short sentences in prose would be the staccato pattern.
- Screen budget is still three. Module 8 lives inside the result area's idle state, so it
  costs no extra screen.

## Review notes

### Skeptical developer

- The word skill is crowded. Module 6 is the answer: the label says whether anything can
  fail, which is the only distinction that survives a demo.
- The playbook gate is the strongest claim on the page and it is not built. It carries
  `Next` in both places it appears.
- "Runs on your machine" does not mean the coding agent stops calling a model provider. The
  install page owns that answer.

### Honesty auditor

- No install counts. No pre-baked density figure. No first-pass guarantee.
- Codex keeps its assumption note. Live-site scanning keeps its `Soon` badge.
- Copy specimens on the idle wall are authored for the page until the Copy domain ships.
  That debt belongs on `/status`, not hidden here.

### Rhythm

- Fold is H1, one subhead, three short body sentences. No chant.
- Module 5 is one paragraph and one table. The distinction does the work, not the phrasing.

## Rule gaps

- `no-marketing-filler` does not catch "skill" used as a synonym for "prompt file", which is
  the drift this page is exposed to.
- No rule catches a bare plural of the shipping noun, which is the guardrail recorded in
  `docs/PLAYBOOK_V1_BRAINSTORM.md` section 2. Write "your playbook", never a content library.

## Notes

Open items this file creates:

1. **The fold names a unit the registry has not shipped.** Variant 1 avoids it and module 5
   handles it with a badge. If Variant 3 is picked instead, the playbook promise moves into
   the fold and needs the registry behind it.
2. **`--recipe` versus `--playbook` stays off the page.** The alias is a proposal in
   `docs/PLAYBOOK_V1_BRAINSTORM.md`, not shipped, and a flag name is not fold copy. Decide
   it before the install line goes in the wild.
3. **Module 6 needs the checked and judged labels to exist in product.** The labels are
   copy today. Shipping the page without them would make the page the only place they are
   true.
