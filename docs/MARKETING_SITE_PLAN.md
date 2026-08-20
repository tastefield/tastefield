# Marketing site plan (apps/web)

Derived from `TASTEFIELD_BLUEPRINT.md` (working context) and cross-referenced against
`claudcode/CLAUDE.md`. Line references below point at the blueprint. Don't undo a
decision here without reading the reasoning it cites.

Target: `apps/web` (Next.js 16, Tailwind v4, motion). Phase 2 work.

---

## Page-shape reframe 2026-08-20 (proposal, see `MARKETING_SITE_ARCHITECTURE.md`)

Sections 1 through 11 below describe one long scroll. A proposal dated 2026-08-20 replaces
that shape with ten pages, one job each, inside a persistent application shell, on the
reasoning that a marketplace needs browsable functional pages that cannot live at the bottom
of a sales scroll. Old sections map onto new pages there; nothing below is deleted.

Everything in this file except the single-page ordering still holds: the organizing thesis,
the positioning rejections, the art direction, the copy mechanics, and the open items. Read
the architecture document first for page shape, then this file for section detail.

Not decided. If the proposal is declined, this file stands unchanged.

---

## Reframe 2026-08-19 (read first, supersedes the reframe below where they conflict)

Drafted with the `copywriting` skill against the blueprint's 2026-08-19 entries: the
editor-first hero, the Skill Studio rename, the funding-order reprioritization, and three
competitor updates (Supernova, Figma Dev Mode MCP, `brandsystem-mcp`). Section-by-section
edits below are marked `[2026-08-19]`; everything else in this document still holds.

**The hero stops being a demo and becomes the product's first screen.** The Specimen
Wall does not disappear. It is demoted from "the thing you watch" to "the evidence panel
of a run you caused" — a stronger job, because a before/after a stranger triggers argues
harder than one that loops on its own. New shape, in order: **the run** (paste a source
or start from a playbook, in a working editor above the fold) → **the verdict** (governed
and ungoverned arms generate against a locked task set, violations pinned to the rule
that fired) → **the edit** (change one restraint, run again, watch the number move, still
anonymous) → **the gate** (save, fork, and Publish need a login; running the check never
does) → **the export row** (pick a target, get the artifact) → **honesty tiers** (shipped
unbadged, `Soon` inline, `Next` on the horizon). Full spec under Section 1 below.

**Blocking prerequisite, stated so nobody ships around it.** The hero's central number
still depends on a real two-arm benchmark that has not been run (see blueprint, What is
NOT done). Until it exists, the hero ships the callouts and the density delta for the
visitor's own run — a live measurement, not a headline figure. Do not backfill a number
from the synthetic bench run to fill the space early.

**Vocabulary correction, superseded 2026-08-20 for public copy:** you author a **skill**
(a `SKILL.md`, its references, its scripts); Tastefield publishes a **playbook** (the skill
plus tokens, restraints, checkable rules, and an ordered `runs:` chain where present).
The first is the editing unit, the second is the public shipping unit. `recipe` remains
the internal code and data-model term. Keep that distinction; do not use "skill",
"playbook", and internal `recipe` as synonyms.

**Competitive updates, three products.** Supernova is no longer pure coexistence. They
sunsetted their AI generator and now sell scoped MCP context into the same three editors
Tastefield ships to, which is the *serve* half of Tastefield's own mechanism. Figma Dev
Mode MCP can now scan a codebase into a rules file, the *extraction* half. `brandsystem-mcp`
already ships token extraction, an MCP server, and a pass/fail gate, the closest small-tool
match found yet. None of the three checks agent output after generation the way
`check_compliance` does; that stays the sentence that answers all three. FAQ gets one new
answer (Section 9); do not open three separate fights.

**What this does not decide.** The blueprint flags "is the primary audience design-system
owners or creatives" as its largest open question, unresolved as of 2026-08-19. This pass
keeps the current default (developers and design-system owners already on Claude Code,
Codex, or Cursor) and does not widen it. See Open items for what would have to change if
that question resolves the other way. Also unresolved and untouched here: Codex's
end-to-end MCP proof, the ABC Diatype license, and live-URL scanning.

---

## Reframe 2026-08-18 (read first)

Research folded in: Type wedge positioning (narrow Stage 1), live zeroheight teardown
([zeroheight.com](https://zeroheight.com/), [/ai](https://zeroheight.com/ai/),
[/mcp](https://zeroheight.com/mcp/)), and the existing blueprint competitive split.

**Working copy (source of truth for options):**
`docs/marketing-copy/sections/*.md` — live/locked user lines preserved; new Option A–C
added beside them.

**Google Docs export (paste or upload):**
- Markdown: `docs/marketing-copy/TASTEFIELD_SITE_COPY_GOOGLE_DOCS.md`
- Word: `docs/marketing-copy/TASTEFIELD_SITE_COPY_GOOGLE_DOCS.docx`

**Page order (updated):** Hero → Problem → Advisory vs verified → Compiled today →
What the agent receives → Coexistence → Proof → Registry (`Next`) → FAQ → Founder
letter → Install.

**Stage 1 story:** compile + check for coding agents. Taste-layer vision and public
registry stay off the H1. Complement zeroheight in FAQ/Sources; do not fight them as
"source of truth" or "context layer" on the homepage.

Section-by-section headlines below still hold as historical plan options. Prefer the
marketing-copy section files + Google Docs export for the current pick set.

---

## Organizing thesis

> A rule an agent merely reads is advisory; a rule that can be verified is enforcement.
> — blueprint line 42

Every section ladders back to this. It is the category definition, and it is currently
buried as a subheading lede on the existing page.

**Headline noun: brand. Headline verb: code-side.**

The mismatch is deliberate. "Brand" states the scope of rules being compiled and covers
the copy/voice/motion domains the taxonomy already names (line 48). The code-side verb
("as the AI types") keeps the claim out of Adobe Brand Intelligence's category, which
line 323 identifies as content-side and explicitly a bad fight to pick. Widening both
halves walks into that fight.

**Update, 2026-08-17: top-line tagline widened to "The brand and taste layer for
agents."** This is a deliberate, single-axis exception to the paragraph above. The noun
widened (brand → brand and taste); the verb did not (layer still implies something
served and checked, not something generated). "Taste" was reopened here specifically
because it echoes the product name and reads plainly to non-developers, where "brand"
alone can sound like colors and logos only. Section body copy still defaults to "brand"
as established above; this tagline is the compact top-of-page exception, not a rewrite
of every section. If a future draft widens the verb too (toward "creates," "generates,"
"designs"), that re-opens the Adobe collision this section warns against and should be
treated as a new decision, not an extension of this one.

---

## Positioning decisions and why

**Rejected: "the taste engine for AI agents."** Four reasons, all sourced.

1. Line 92 states the beyond-code vision is "vision, not roadmap... Don't let this bleed
   into Phase 2/3 descriptions until it's actually decided." The marketing site is Phase 2.
2. It implies Tastefield *supplies* taste. The architecture assumes the opposite — line 330
   scopes the addressable market to "companies with a real, existing system, not companies
   that need one invented."
3. It occupies the position line 328 identifies as the sharpest differentiator *against*:
   buildwithtaste.com aggregates "what you personally like... not what your company
   actually, already is."
4. Unfalsifiable, which collides with the spirit of non-negotiable #3.

Note the current blueprint already dropped this tagline — it survives only in the older
v2.2 draft.

**`[2026-08-19]` Status change, not a new rejection: Supernova moves from "coexistence
partner" to "named competitor" in Section 6 and the FAQ.** They sunsetted their AI
prototyping product and now sell scoped MCP context into Claude Code, Codex, and Cursor,
which is the serve half of Tastefield's own mechanism. Section 6's Sources grid can still
read Supernova as a connection if a customer already lives there; that no longer implies
they aren't competing on distribution. See Section 9 for the FAQ answer this produces.

**Rejected: "design system intelligence."** Same scope as "design system" (one of eight
domains) with a vaguer claim. "Intelligence" describes Adobe's opaque brand brain
accurately and a checkable regex badly — it sells the exact property line 332 says to
avoid. Also a direct echo of a much larger company's product name.

**Rejected: leading with skill-bundling or a playbook library.** Line 299 records that Vercel Packs
already ships the bundle concept. Line 309: registries "distribute files,
Tastefield compiles and enforces them." Line 327: a generic category playbook is "genuinely
exposed" to @skills' 60,000+ free alternatives, while the compiled engine is "the
defensible half." Leading with bundling markets the commoditized surface.

---

## Section-by-section

Each section lists five headline options with the recommended pick marked, body copy,
a primary visual, and three alternates.

---

### 1. Hero

**`[2026-08-19]` The hero is now the product's first screen, not a demo of it.** Decided
in the blueprint's "Editor-first hero" note. Six moves, one idea each, no section that
exists only to have a section:

1. **The run.** One input and a working editor above the fold, pre-filled with a real
   playbook so nothing starts blank. Two entry paths into the same editor: start from a
   first-party playbook, or paste a source (a GitHub repo URL, a pasted `SKILL.md`, pasted
   code, or an article). Live-site URLs and video links wait; both are still open
   questions elsewhere in the blueprint.
2. **The verdict.** Press Run. Governed and ungoverned arms generate against a locked
   task set. The Specimen Wall renders both, with a violation callout pinned to the
   specific rule that fired: a hardcoded hex, a hallucinated prop, a missing confirmation
   dialog. The number shown is measured violation density, never a compliance percentage
   (non-negotiable #3).
3. **The edit.** Change one restraint, run again, watch the number move. This is the
   whole pitch in one gesture. No copy should try to explain it. Everything up to here is
   anonymous: no account, nothing stored, nothing sent.
4. **The gate, placed where it's earned.** Save, fork, version history, and Publish
   require login. The account buys persistence and distribution. It never buys the
   ability to see whether the thing works. Do not put a signup wall in front of the
   verdict.
5. **The export row.** The harness logos as something you click, not a trust badge. Pick
   a target, get the artifact. See Section 11 for the full channel list; the MCP
   connection is the one that keeps checking after export, so lead with it.
6. **Honesty tiers**, not a roadmap section. Shipped features unbadged, `Soon` inline,
   `Next` set apart. This tier is scoped to what this run just touched; Section 2 carries
   the same tiers at the scope of the whole product.

**Blocking prerequisite.** The verdict's density number depends on a real two-arm
benchmark that has not been run yet (blueprint, What is NOT done: both arms of the only
existing run were hand-authored by one person in one sitting). Until that benchmark
exists, ship the hero anyway. The visitor's own run supplies a live number; nothing here
requires a pre-baked headline figure.

**Headlines**

1. **Everyone else grades the skill. We grade what your agent shipped.** — *[2026-08-19]
   new, recommended for the editor-first hero. Short enough to run as the H1. Defensible
   only as long as the eval stays deterministic; do not pair with an LLM-judged score.*
2. Your brand, enforced as the AI types. — *prior recommendation, still works as a
   subhead under option 1, or as the H1 if option 1 tests as too inside-baseball*
3. Every rule your agent can ignore is a rule you'll fix in review. — *adversarial*
4. Compiled brand rules. Served to your agent. Checked before commit. — *technical*
5. AI writes your components. You still own the brand. — *ownership*
6. Tired of reviewing AI code for things a checker could catch? — *question, from
   blume.codes*

On option 6: a question qualifies the audience and cannot over-promise, which is the trap
"taste engine" fell into. Still lead with a declarative form; question headlines drift
toward infomercial unless the pain is very specific.

**Add a "Works with" logo strip immediately below the fold.** Claude Code, Codex,
Cursor. Compatibility is a first-five-seconds question for this audience, and it now
doubles as the export row's target list.

**Trio updated 2026-08-17:** Windsurf swapped for Codex based on current usage. Codex is
not yet tested end-to-end against the MCP server; see `.agents/product-marketing.md` for
the caveat before this goes live.

**Body**

> Cursor has never opened your design system, so it guesses. A hex that isn't in your
> palette. A prop that doesn't exist. A tone your brand would never use. Paste your repo
> or a real component below and watch it check the difference.

Eyebrow: `● Local MCP server · nothing leaves your machine`
CTAs: `Run it on your repo` · `Start from a playbook`
Trust line: works alongside Figma, zeroheight, and Storybook.

**Primary visual — the run, live.**

The interactive editor described in "the run" above. Before a visitor presses Run, it
idles as the drifting wall already specced: two rows of UI primitives, six or more always
in frame, no discrete slides, a density/radius slider restyling all of them at once. That
idle loop is the waiting room, not the pitch; the pitch is what happens after Run.

Two constraints from the blueprint still govern the idle state and the verdict alike:

- **Not a carousel.** A wall of unrelated primitives has no structural reason to look
  coordinated; watching all of them snap together at once is what proves "systemic" in
  the first place. A carousel is sequential and spends that proof.
- **Must show enforcement, not just extraction.** `extract-design-system` has 127K
  installs on a 176-star repo: differentiation has to be enforcement *after* extraction,
  not extraction. A slider that only restyles is the commodity half; the violation
  callout on the ungoverned arm is the half that isn't.

**Alternates**

- Two agents, one prompt, diverging live. Most persuasive, but scoped as a recorded video
  rather than hero real estate. It's slow and expensive live, and the editor-first hero
  already gives the visitor their own live run instead.
- Terminal-first: a real `npx` run streaming compiled rules with a counter. Cheapest to
  build, strongest signal for a developer audience, no design risk. Reasonable fallback
  if the interactive editor slips.
- Single component with rules printing beside it like register tape. Focused, but
  forfeits the systemic proof.

---

### 2. What's compiled today — *and what's coming*

**`[2026-08-19]` Scope, so this doesn't read as the hero's honesty tier repeated.** The
hero's tier (Section 1, move 6) covers what fired in the visitor's own run. This section
covers the whole product, domain by domain: Visual, Copy, Brand, Motion, Architecture,
and the rest. Different job, same three-tier vocabulary, worth a one-line distinction on
the page itself rather than trusting the visitor to infer it.

**`[2026-08-20]` Vocabulary: you author a skill, Tastefield publishes a playbook.** Where
this section lists what's compiled, say "playbook" for the public shipping unit (tokens,
restraints, checkable rules, and any ordered chain) and "skill" only for the authoring
unit inside Studio. `recipe` stays inside the code and data model. Do not use the three
words interchangeably; the blueprint treats this distinction as load-bearing for the
registry and the roadmap.

**Revised 2026-08-17 after blume.codes.** The earlier version of this section was a flat
honesty strip: a row of badges disclosing which domains don't work yet, positioned as debt
to admit. Blume does this better. Their roadmap renders in three visible tiers — shipped
features unbadged, `Soon` inline on the same list, and a separate "On the horizon" section
carrying `Next` — under a heading that states it plainly: "Today, and the corners of the
agent setup we're building toward."

Unbuilt work sits prominently and is labelled by distance, so it reads as ambition rather
than vapour. Adopt that structure. It solves both standing honesty problems at once — the
domain axis and the unbuilt registry — and it means the `brand` headline no longer needs
an apology strip underneath it.

**Headlines**

1. **Today, and what we're building toward.** — *recommended, borrowed structure*
2. What's compiled today. — *plain*
3. Built, soon, and on the horizon. — *structural*
4. We'll tell you what doesn't work yet. — *disarming*
5. Status, without the marketing. — *blunt*

**Three tiers**

*Shipped, no badge.* Visual tokens (CSS custom properties, Tailwind `@theme`), component
contracts (cva variants), and nine compiled rules.

*`Soon`, same list.* The remaining Copy and Brand coverage, Motion as a documented
Foundation, Figma and zeroheight source connections.

*`Next`, separate "On the horizon" section.* The public registry, a playbook for each role, the
dual-axis leaderboard, the marketplace.

**Correction, verified 2026-08-17 against `src/compile/rules.ts`.** Earlier drafts of this
plan claimed Copy was entirely unbuilt and that shipping one copy restraint would retire
the honesty debt. That was wrong. Nine rules already compile, and two are not visual:

- `no-marketing-filler` — a voice rule, confirmed passing in the MCP smoke test
- `empty-states-need-action` — UX/content, not tokens

The other seven: `no-raw-hex`, `no-arbitrary-values`, `no-arbitrary-color-utility`,
`no-inline-border-radius`, `no-invented-variants`, `no-restyling-primitives`,
`prefer-design-system-components`.

So `brand` in the H1 is better supported today than previously assessed, and section 5 can
show a voice rule beside a token rule using rules that already exist. Copy belongs in
*shipped* with narrower coverage, not in *planned*.

**Primary visual:** two grouped lists, `Soon` badges inline, then a visually separated
"On the horizon" block.

**Alternates**

- A horizontal progress rail with filled segments per shipped domain.
- A dated checklist ("Copy coverage: next") that turns disclosure into a roadmap.
- A nav "Status" link instead. More honest, far less visible.

---

### 3. The problem

**Headlines**

1. **An agent with no constraints will always produce something plausible.** — *recommended*
2. It compiled. It rendered. It passed review. It was wrong. — *sequence*
3. Nobody catches this in review. That's the problem. — *indictment*
4. Plausible is the failure mode. — *compressed*
5. Your agent is confident and uninformed. — *character*

**Body — null-answer stack** (mechanic borrowed from skilltune.dev)

> Your design system lives in Figma. — *Your agent has never opened it.*
> Your tokens are in `globals.css`. — *Your agent wrote `#3B82F6`.*
> Your Button has six variants. — *Your agent invented a seventh.*
> Your brand can't say "cheap." — *It's in the empty state.*
> You reviewed the PR. — *It looked fine.*
>
> **It shipped anyway.**

Follow with the reader's-desk line, in tasteprofile.io's register:

> Your brand guide is a PDF nobody opens. Your Figma library has 200 components nobody
> themes correctly. Neither is in the room when Cursor writes a component.

**Primary visual:** scroll-triggered sequential reveal — claim left in body text, null
answer right in red mono. Final line lands full-width, alone.

**Alternates**

- A clean PR diff that blooms with violation annotations after two seconds.
- The generic-shadcn wall: nine outputs from nine prompts, visibly identical. Names the
  enemy the way tasteprofile.io names "shadcn-flavored."
- A live violation counter. Requires the opt-in anonymized pool from line 133 — future.

---

### 4. Advisory vs. verified

The thesis section. Does not currently exist on the site.

**Headlines**

1. **A rule your agent can read is advice. A rule that can fail is enforcement.** — *recommended*
2. Context is a suggestion. Constraints are not. — *couplet*
3. Everyone gives your agent context. We give it something it can fail. — *competitive*
4. Advice doesn't have a line number. — *compressed*
5. The difference between telling and checking. — *plain*

**Body**

> A markdown file of guidelines is a suggestion the model weighs against everything else
> in its context window. A compiled rule carries the pattern that proves it — so when the
> agent ignores it, something actually fails.

**Primary visual:** two cards. Left "Advisory" — prose in a `.mdc`, muted, no outcome.
Right "Verified" — the same intent as a compiled rule with its regex, and a real result
beneath: `✗ line 42: #3B82F6 not in token scale`.

**Alternates**

- A toggle flipping one rule between both forms, outcome changing underneath.
- An input where the visitor types an off-scale hex and watches it get caught.
- A positioning quadrant naming Context7, Adobe, tasteprofile, skills.sh. Effective, but
  it picks four public fights — a real choice, not a free one.

---

### 5. What the agent receives

**`[2026-08-20]` What travels to the agent is your playbook, never a skill in progress.** A
skill is the authoring unit inside Studio; a playbook is the compiled bundle of tokens,
restraints, checkable rules, and any ordered chain that reaches the MCP server. `recipe`
is the internal code term. Keep that distinction in this section's copy specifically,
since it is the section most likely to blur the units by describing what the agent asks for.

**Headlines**

1. **Four narrow tools. Deliberately no fifth.** — *recommended*
2. There is no `get_everything`. — *principle*
3. One question, one answer, nothing extra. — *mechanic*
4. What your agent actually asks for. — *reframe*
5. Progressive disclosure, enforced by omission. — *technical*

**Body**

> Dumping a design system into a context window is the failure this product exists to fix,
> so the agent asks for one thing and gets one thing.

Non-negotiable #7.

**Primary visual:** a request/response inspector with three tabs of real payloads —
tokens, component contract, restraint.

The restraint tab is the point. Show a fully-worked principle in the Trigger / Decision /
Reason / Evidence / Trade-off format adopted at line 44, filled with actual values. This
is the strongest single element on tastelab.xyz and it appears nowhere on the current
site — the largest unforced omission in the existing page.

**Render it as a reviewable card, not a static block (added 2026-08-17, from blume.codes).**
Their suggestion cards carry a claim, then evidence with a count, then a typed artifact
badge, then two actions:

> **Verify changes before handing work off** — In 4 conversations, you asked agents to run
> the relevant package tests and typecheck before saying a change was ready.
> `~Rule` Add a verification section to the project agent guidance
> Dismiss · Preview

That is the same information architecture as Trigger/Decision/Reason/Evidence/Trade-off,
rendered as working product UI rather than documentation. A restraint shown this way reads
as a live system; the same restraint shown as a prose block reads as a spec.

It also connects two things already decided: the compiled-draft review surface at line 246,
and the correction-becomes-candidate-restraint mechanic at line 332. Blume is shipping that
second mechanic now — mining conversations for repeated corrections and proposing a Rule or
Skill from them, human approval intact — so the interaction pattern is validated, not
speculative.

**Alternates**

- A transcript: agent asks, server answers, agent writes correct code.
- The compiled `.tastefield/` tree, expandable, files openable inline.
- One restraint card, full-bleed, as the entire section.

---

### 6. Coexistence

**Headlines**

1. **Figma is where your team decides. Tastefield is where the agent complies.** — *recommended*
2. Your source of truth doesn't move. — *reassurance*
3. We read. We never write back. — *guarantee*
4. Keep every tool you already have. — *plain*
5. Nothing gets replaced. Something finally gets enforced. — *turn*

Read-only always, per line 199. Sources and their status from line 193.

**Primary visual:** keep the existing source grid with honest `READ-ONLY` / `PLANNED`
badges — one of the better things on the current page.

**Alternates**

- One-way arrows into the compiler with the reverse direction visibly blocked.
- A hover that attempts write-back and gets rejected. Turns a promise into a demonstration.
- Logo strip with a single sentence.

---

### 7. Registry

**Phase 1, not built. Must be labelled as visibly as the Sources grid labels Figma.**

**`[2026-08-19]` A second install path, `Next` alongside `npx`.** The same playbook, published
as a plugin marketplace Claude Code and Codex can add directly, with org-wide auto-update
on Claude Enterprise. This is packaging on top of catalog content that already has to
exist for `npx --playbook=` (`--recipe=` remains a legacy alias), not a new engine, so it belongs in this section's "on the
horizon" tier and in Section 11's channel list, not as a standalone feature.

**Headlines**

1. **Browse by the problem, not the company.** — *recommended*
2. `linear-vibe` has no story. `fintech-trust-first` does. — *concrete*
3. Start from a playbook, not a blank file. — *benefit*
4. Find your playbook by what you're building or who's judging it. — *two axes*
5. A registry your agent can query mid-task. — *differentiating*

Show both axes as separate sections, per line 273: find your playbook by product category or
role. Mixing them "recreates the exact 'seems random' failure the category-first
taxonomy was originally designed to fix."

**Primary visual:** two-column taxonomy browser with mood-caption variant cards (line 267),
placed inside the "On the horizon" tier established in section 2 rather than carrying its
own ad-hoc `PLANNED` ribbon. One roadmap vocabulary across the whole page, not two.

**Alternates**

- The mood picker alone — choose by vibe before reading a token table.
- The dual-axis leaderboard, Taste vote beside Compliance score. Line 139: something
  Design Arena structurally cannot build, because it has no enforcement engine.
- A creative-skills table with a **Gen Agent Trust Hub audit column**. The most defensible
  registry surface: skills.sh shows install counts and no safety signal, and the sweep
  found `emil-design-eng` at 203.7K installs hidden behind a broken singular/plural link
  (line 310). Consistent with non-negotiable #5 — displaying a flagged skill is fine,
  bundling it into your playbook is not.

---

### 8. Proof

**Headlines**

1. **The honest version of the numbers.** — *recommended*
2. What we measured, and what we haven't. — *balanced*
3. 31.21 to 0 — and why that isn't the whole story. — *specific*
4. We publish the runs that don't flatter us. — *character*
5. Proof, with the caveats attached. — *plain*

Numbers verified against `claudcode/bench-runs/RESULTS.txt`: 8 tasks, 5 enforceable rules,
baseline 173 lines / 49 errors / 5 warnings / density 31.21, governed 192 lines / 0 / 0 /
density 0.

Keep the existing amber caveat verbatim — it is the best-written thing on the current
site, and line 344 requires it: both arms were hand-authored by the same author in one
sitting, so this proves the harness works, not the claim under real prompt variance.

Promote this section above Registry. Consider a `What we haven't proven` nav item —
nothing in the competitive set has one, and tasteprofile.io contains zero numbers of any
kind.

**Primary visual:** three stat cards plus the caveat card.

**Alternates**

- Density bar chart with the caveat directly under the bars.
- Version-score progression, skilltune style. Only honest once runs exist over time.
- Raw `RESULTS.txt` rendered as-is. Maximum credibility, minimum polish.

---

### 9. FAQ

**`[2026-08-19]` New answer: Supernova, Figma Dev Mode MCP, and `brandsystem-mcp`.**
Supernova sunsetted its AI generator and now sells scoped MCP context into Claude Code,
Codex, and Cursor, the exact three editors Tastefield ships to. Figma's MCP server can
now scan a codebase into a rules file. `brandsystem-mcp` already ships a pass/fail gate
on top of token extraction, the closest small-tool match found yet. One answer, not
three fights:

> Supernova serves your team's design system to an agent as context. Figma's MCP server
> can scan a codebase and generate a rules file. Tastefield checks the agent's actual
> output against your rules and flags the line that broke one.

Drafted this way on purpose. The blueprint's own internal shorthand for this
("Supernova controls what an agent can read. Tastefield verifies what it wrote.") is the
same antithesis-couplet shape `FORBIDDEN.md` already caught and banned for Section 6
("Figma is where your team decides. Tastefield is where the agent complies."). Keep the
shorthand as internal reasoning; do not ship the couplet. The rewrite above states what
each product does, in order, and lets the third sentence carry the difference instead of
naming the other two as an opposite.

Add this as a sixth answer, after the existing zeroheight one, not merged into it;
zeroheight is a documentation partner Tastefield reads from, while these three are
serve-or-scan tools Tastefield overlaps with, and collapsing both answers into one buries
the distinction that actually matters (coexistence vs. competition).

**Headlines**

1. **No, we can't guarantee a clean first pass.** — *recommended, leads with the hard one*
2. The question everyone asks first. — *setup*
3. Straight answers, including the unflattering ones. — *character*
4. Questions we'd rather answer here than in a demo. — *confident*
5. What you're actually wondering. — *plain*

**The answer that wins**

> Models are stochastic, and anyone promising a clean first pass is selling something they
> can't demo. What we do instead is check the output afterward and tell you exactly which
> line broke which rule.

tasteprofile.io answers the same question and stops at "you're still the judge of the
final work" (recorded at line 328). Tastefield has a checker. Copy their rhetorical
structure — admit the limit, then reframe — but not their answer. This is the single
clearest paragraph available on the site, and it satisfies non-negotiable #3.

**Primary visual:** accordion with that question expanded by default.

**Alternates**

- Objection/answer pairs in section 3's typographic style, tying the two together.
- Long-form prose, no accordion. Reads as confidence.
- Side-by-side against competitors' published answers. Effective, aggressive; not recommended.

---

### 10. Founder letter

Where the beyond-code vision goes, per line 98's instruction to keep it out of shipped
product copy. Ambition reads as conviction in prose and as a claim in an H1.

**Headlines**

1. **Why this exists.** — *recommended*
2. Brand judgment is the last thing AI can't do for you. — *thesis*
3. The Swiss Army knife, not the table saw. — *line 79*
4. A letter about slop. — *blunt*
5. What I think happens next. — *forward*

**Primary visual:** long-form prose, generous measure, signature.

**Alternates**

- A dated decision log drawn from the blueprint's own entries. Genuinely distinctive —
  nobody publishes their reasoning with dates attached.
- The seven non-negotiables as a numbered manifesto. Nearly usable as-is.
- Margin annotations showing second thoughts. Charming, high effort.

---

### 11. Install

**`[2026-08-19]` The live MCP connection is the channel, everything else is a copy of
it.** Six other export paths exist or are planned (per-harness file export, `npx
--playbook=` (with `--recipe=` retained as a legacy alias), an opaque share link, the shadcn-CLI registry format, the @skills protocol,
and now a plugin marketplace for Claude Code / Codex). List them, but do not present them
as six equal options. An exported file or an installed plugin is a snapshot that goes
stale the moment your playbook changes; the MCP connection is the only channel where
`check_compliance` runs after generation instead of just handing over rules beforehand.
Say that plainly on the page: exporting distributes advice, the live connection
distributes enforcement.

**`[2026-08-19]` Plugin marketplace, `Soon`.** The same compiled playbook, installed with
Claude Code's `/plugin` (Codex equivalent once confirmed), auto-update on. Aimed at
teams already on Claude Enterprise who want a non-technical rollout path. Badge it `Soon`
until it ships; it is packaging, not new build.

**Headlines**

1. **One command. No account.** — *recommended*
2. No API key. No cloud. No signup. — *triplet*
3. Start with the repo you're already in. — *situational*
4. Add it to your editor in about a minute. — *time*
5. `npx`, and you're governed. — *compressed*

**Primary visual:** tabbed config blocks per client — Claude Code, Codex, Cursor — with
the literal JSON and copy buttons, the way tastelab.xyz lists exact file paths per tool.
The current page reduces this to a throwaway line.

**Alternates**

- An asciinema recording of a real install.
- A "Try in Cursor" deep link — already in the backlog at line 153.
- Three numbered steps with copyable commands.

---

## Art direction (decided 2026-08-17)

**The constraint that sets everything else: painted pastoral is already taken, twice, by the
two closest competitors.** tasteprofile.io (line 328) is rolling green hills under painted
cumulus. Blume (line 342) is a flower field under painted cirrus. Both light, both
soft-brush, both with a sharp product UI floating in front. A third instance doesn't read as
a category convention — it reads as a lookalike of the two products this document spends its
positioning section differentiating from. The name supplies the field. The rendering has to
come from somewhere else.

### Direction: the Field Guide

The site is an edition of a field guide — bone paper, a persistent left rail with
Roman-numeral sections, display serif with italic section titles, engraved botanical plates.
Reference: Shopify Editions Winter '26.

**Why editorial structure matters more than any illustration choice.** All four reference
competitors are single-scroll landing pages. The content here is unusually detailed and
unusually caveated — benchmark numbers that ship with their own caveats, a domain axis where
only Visual genuinely ships (line 348), a registry that isn't built. A single scroll
compresses that into three feature cards and a CTA, and the honesty that is supposed to be
the differentiator reads as thin instead. Numbered sections let the rigour breathe and make
the page feel authored rather than assembled. It is also harder to copy than a sky.

The vocabulary already agrees: the hero is called a **Specimen Wall** (line 168). "Specimen"
is the botanical word. That coherence is free.

### The dusk frontispiece

The landscape appears once, full-bleed, framed as a colour plate sitting *on* the paper —
not used as a page background. That framing is what lets a dark hero and a paper body
coexist instead of fighting.

Dusk, not noon. Reference: Indigo AI's HQ. Two reasons beyond avoiding the lookalike
problem — the logo's blue-to-orange gradient *is* a dusk horizon, so the brand mark and the
environment become the same object; and deep teal-green with a warm horizon band leaves the
product artifact panels readable in near-black without a palette change.

### Motif discipline

One botanical motif: the **dandelion**. Not decoration — it earns the slot four ways. A
dandelion clock is a natural before/after object, which is the Specimen Wall wipe already
specified at line 248. Seeds dispersing and taking root is a design system propagating into
agent output. It is humble rather than precious, which suits a product selling restraint.
And the seed head is white-grey, so it won't fight the accent colours.

Resist the meadow. Blume commits to exactly one flower, tied to their name, and that
discipline is most of why it reads as sophisticated rather than busy.

**A scoop and a hill are the same form at different scales.** The logo establishes the
scoop; every rolling hill on the site then inherits the reading without a cone being drawn
anywhere. Carry the dome across hills, card shoulders, and chart curves.

### Where the dessert goes

Four places, none of them literal, ranked by how well they survive the sophistication test.

- **Form.** The dome, as above.
- **Colour.** The logo gradient reads as sorbet and as a dusk sky simultaneously. Desaturate
  toward gelateria, not sweet shop.
- **Texture.** Halftone at close range looks like sugar. This is the entire dessert budget,
  spent on surface instead of objects.
- **One easter egg.** Replace the square `grid-faint` background with a faint waffle
  lattice. Anyone who misses it sees texture.

Plus exactly one literal cone: photographed or rendered, composited among floating product
artifacts, played straight. This is Shopify's physical-object move (skateboard, wheel, among
the UI cards). Once. Not illustrated, not repeated, not in the hero.

### The character veil

An ASCII layer dissolving the illustration into text. Reference: HQ. Revised 2026-08-17
after a first pass specified real compiled output as the glyph source.

**Alphabet, not strings.** Single glyphs drawn from the syntax of compiled output — hex
digits `0-9a-f` plus `# - : { } / * $ < >`. **Rejected: real rule IDs.**
`no-arbitrary-values` is nineteen characters; it streaks horizontally, breaks the uniform
cell density that makes a monospace field read as dither rather than content, and creates a
second reading order competing with the headline. Words get read, glyphs get seen. The
character *distribution* carries the association; no legibility is required to get it.

The one exception worth keeping is **hex values** — `#0a84ff` is seven characters, legible
at a glance without demanding to be read, and self-evidently a colour. Sparse regions only.

**Meaning lives in the composition, not the glyphs.** The veil runs directional: fully
illustrated on one side, fully resolved to characters on the other, crossover tied to scroll
position. That single image is scan → compile → serve, and it reads at a glance where glyph
content only reads on inspection. Put the message where it will actually be received.

Real compiled output therefore belongs one layer over, in the product artifact panel showing
what the MCP server actually serves. **Veil is texture; artifact is truth.**

**Motion.** Refresh a small random subset of cells at 4–8fps, not the whole grid. Opacity at
or below 0.15. Hold completely still for seconds at a time, and freeze entirely behind body
copy. Gusts and lulls, not a constant rate — the constant refresh is what makes HQ's version
feel busy, more than the glyph count does.

### φ construction marks

Set the real section heights, column splits, and type scale to 1.618, then draw marks that
reveal structure which genuinely exists. Reference: Shopify's faint concentric circles with
crosshairs, placed on actual focal points at low contrast.

**Reject the spiral overlay.** A φ spiral floating over a layout that doesn't use it is
ornament imitating rigour, on a site whose entire thesis (line 42) is that only verifiable
rules count. Draw-in via SVG `stroke-dashoffset` tied to scroll position rather than
autoplay, so the page appears to construct its own scaffold and the content settles into it.

### Type stack

Replaces Geist Sans / Geist Mono, currently the most generic pairing in developer tools and
a large part of why the existing page reads as undifferentiated.

- **Display and section titles — Fraunces** (variable, OFL). The `opsz`, `WONK` and `SOFT`
  axes give it genuine old-style character at poster sizes. Italic is reserved for section
  titles; never body.
- **Sans — ABC Diatype** (licensed). Files already owned, at
  `machinekind/web/src/fonts/ABCDiatype-{Regular,Medium,Bold}.woff2` — 400/500/700, no
  italic, which is correct because italics come from Fraunces. Load via `next/font/local`,
  same pattern as `machinekind/web/src/app/layout.tsx`.
- **Mono, code — Commit Mono** (OFL).
- **Mono, veil — a bitmap face** such as Departure Mono. Deliberately different from the
  code mono: the veil is texture and wants even pixel density, while code blocks want a
  reading face.

**The mechanic matters more than the faces.** Display at poster scale, sans at label scale
(11–13px, letterspaced, frequently uppercase, as in Shopify's rail and eyebrows), and
essentially nothing in between. The size jump is the effect; a 20px serif beside an 18px
sans kills it regardless of which fonts are loaded.

### Palette

Move off the Apple system colours (`#0a84ff`, `#30d158`, `#ffd60a`, `#ff453a`). They are
accurate for a macOS app and generic for a marketing site, and they are part of what makes
the current page read as one more devtool. Dusk plate: deep teal-green field under a horizon
band running the logo gradient. Body: bone paper. Product artifact panels: keep near-black.

### Built 2026-08-17, and where it departs from the spec above

The type stack, palette, rhythm and veil are now live in `apps/web`. Deviations, each
deliberate:

- **Mono is JetBrains Mono, not Commit Mono.** Commit Mono is not on Google Fonts and the
  release archive did not resolve; JetBrains Mono is OFL and holds the same reading role.
  Swap it when the Commit Mono files are downloaded by hand.
- **No bitmap veil face.** The character veil uses the code mono at 10px rather than
  Departure Mono. The distinction the spec draws is real and still worth making later.
- **No frontispiece illustration.** The dusk plate is a colour field, a horizon glow and
  the veil. The commissioned art is still the long-lead item; nothing generative shipped
  in its place, per the rule below.
- **φ marks are lines, not a spiral,** drawn on the 0.618 column split and baseline, tied
  to scroll via `stroke-dashoffset`. The layout uses a Fibonacci spacing ladder
  (`--s1`…`--s7`) so the marks sit on divisions that exist.
- **ABC Diatype is loaded from the Machinekind files.** The licence question in open item
  4 is unresolved and now blocks launch rather than build.

### Do not

**No AI-generated hero art.** Both Blume's and HQ's fields read as authored by a person, and
that is load-bearing for them. For a product whose thesis is that generative output is
generic, shipping a generative hero is a self-inflicted wound in front of an audience
selected for noticing. Commission, paint, or print something with a visible hand.

No repeated cones as decoration, no anthropomorphised food, and no second dessert type. The
public `playbook` rename removes the food-vocabulary collision, but ice cream plus a field
still needs restraint.

---

## Copy mechanics worth reusing

Observed on the four reference sites, applicable throughout.

- **Couplets.** Two short sentences where the second turns. tasteprofile.io: "Brand guides
  are PDFs. AI tools need data." Set the category definition as a pull quote, not body copy.
- **A countable unit of pain.** They never say "saves time" — they say "the fifth revision,"
  three times. Tastefield's equivalent is measurable: violations per hundred lines.
- **Name the failure state.** "Generic shadcn" is instantly legible to a developer.
  "Something plausible" is accurate but abstract.
- **Describe the reader's desk,** not the abstraction.
- **Ship named files, not features.** tasteprofile.io lists DESIGN.md, tokens.json,
  SKILL.md, CHANGELOG.md under "what you actually get."
- **Evidence with a count.** Blume writes "In 4 conversations, you asked agents to..."
  rather than "detects repeated patterns." A number makes a claim checkable.
- **Lean into being narrow.** Blume sells itself as "one narrow sidecar," "a quiet window."
  Smallness is a positioning, not a limitation — the same asset the `npx`, no-account,
  no-telemetry story already has and currently undersells. Relevant to the recurring worry
  that the enforcement wedge sounds too modest next to the marketplace ambition: Blume
  carries a team-wide Central Domain Model on its roadmap and still says "sidecar" on the
  H1.
- **Grade the output, not the skill.** — *[2026-08-19]* Skilltune's number judges a
  `SKILL.md` against eval cases generated from the same author's description: coherent
  with stated intent, not correctness against anything real. Tastefield's number is a
  measured density from running your compiled playbook against a locked task set. Say what
  gets graded, not just that grading happens: "we grade what your agent shipped," not
  "we score your skill."
- **Promote human-in-the-loop review to a headline benefit.** Blume's "See Every Change
  Before It Lands — review the evidence and exact diff, then apply, dismiss, or save."
  Tastefield has this capability specified at lines 244–248 and it currently appears
  nowhere in the messaging.

**Do not copy** their page shape. Clearly Digital, Inc. is a services business — discovery
call, four phases, $999 workshop add-on, every CTA a booking. Tastefield's distribution is
`npx`, no account, no call, and line 323 identifies that friction difference as a win.

---

## Drafting loop (set up 2026-08-17)

Copy is drafted **one section at a time**, not as a full-page rewrite.

- Brand memory: `.agents/product-marketing.md`
- Loop skill: `.cursor/skills/marketing-copy-loop/`
- Working drafts: `docs/marketing-copy/` (`PROGRESS.md` + `sections/`)
- Voice check: `node scripts/check-marketing-copy.mjs docs/marketing-copy/sections/NN-slug.md`
- Companion skills (personal): `copywriting`, `copy-editing`, `writing-guidelines` under
  `~/.cursor/skills/`, plus existing `deslop` / `grilling`

Kickoff: `Draft section 01 (hero) using the marketing-copy-loop skill.`

---

## Open items before build

1. **The registry section describes unbuilt inventory,** including an install command with
   a `--playbook=` flag that doesn't resolve. The Sources grid is scrupulous about this; the
   playbook section is not. Same fix, same badges.

2. **Resolved 2026-08-17 — the copy restraint already exists.** This item previously read
   "one copy restraint would retire most of the honesty debt the brand headline takes on."
   Verified against `src/compile/rules.ts`: `no-marketing-filler` is already compiled and
   already passing in the MCP smoke test, alongside `empty-states-need-action`. Section 5
   can show a voice rule beside a token rule today, using rules that ship.
   What remains is *breadth* of copy coverage — banned phrases, tone, per-brand voice
   rules — not the first one. Downgrade from blocking to normal roadmap work.

3. **Live-URL scanning is unresolved** (line 105). The hero's "paste a URL" interaction
   assumes `src/scan/` can extract from an arbitrary rendered site, which is a different
   pipeline from parsing a repo. Confirm or scope before building the hero around it.

4. **ABC Diatype's licence needs checking before it ships.** The files are already owned and
   in use on Machinekind, but Dinamo's webfont licences are typically scoped per domain and
   per pageview tier — a second project on a second domain is plausibly a second licence,
   not a free copy. Confirm coverage before launch. Fraunces, Commit Mono and Departure Mono
   are all OFL and carry no equivalent risk, so only the sans is exposed. Fallback if the
   licence doesn't extend: PP Neue Montreal, or Archivo at zero cost.

5. **`[2026-08-19]` The audience question is open and this pass does not resolve it.**
   The blueprint names "is the primary audience design-system owners or creatives" as its
   largest open question, unresolved as of 2026-08-19. This plan keeps the current
   default (developers and design-system owners on Claude Code, Codex, or Cursor). If it
   resolves toward creatives, the blueprint already lists what would have to change: the
   "What this is" opening line, the domain build order (Copy and Brand ahead of
   Visual/Motion), the source connections (paste-a-source becomes primary, not Local/
   GitHub/Figma/zeroheight), the coexistence framing (PDFs and Notion, not Storybook),
   and the Specimen Wall (needs a copy-domain twin). Do not make any of those five
   changes as a side effect of a smaller copy edit; treat it as its own decision.
6. **`[2026-08-19]` The hero's verdict number has no real benchmark behind it yet.** The
   editor-first hero (Section 1) ships fine without one, since the visitor's own run
   supplies a live number. But no headline density figure should appear anywhere on the
   page (Proof section included) until the real two-arm benchmark described in the
   blueprint's "What is NOT done" actually runs. The existing 31.21-to-0 number stays
   scoped to Section 8's caveat card, never promoted to the hero.
7. **The dusk frontispiece and the botanical plates need an illustrator.** The art direction
   rules out generative imagery for a reason it also has to live with — that work has to be
   commissioned, and it is the long-lead item on the whole page. Scope it before the build
   starts rather than discovering it as a blocker.
