# Site architecture and page outlines (2026-08-20)

Drafted with the `copywriting` skill against `.agents/product-marketing.md`,
`docs/marketing-copy/FORBIDDEN.md`, and the blueprint's 2026-08-19/20 entries.

**What this supersedes.** `MARKETING_SITE_PLAN.md` sections 1 through 11 describe one long
scroll. This document replaces that page shape with a multi-page site where each page does
one job. Everything else in that file still holds and is cited rather than repeated: the
organizing thesis, the positioning rejections, the art direction, the copy mechanics, and
the open items. Where a section brief survives, it is named below and points back.

Status: proposal for review. Nothing here is decided.

---

## Composer reframe (2026-08-20, read first, supersedes page I below)

The first draft of page I was written for someone who already owns a design system, already
has a repo, and already has a compliance problem. That is a narrow door, and it puts the
last step of the story on the first screen. This reframe generalizes the entry and renames
the editor to the **Composer**.

### This is the audience question resolving, not a copy edit

The blueprint names "is the primary audience design-system owners or creatives" as its
largest open question and lists five things that change if it resolves toward creatives:
the "What this is" opening line, the domain build order (Copy and Brand ahead of Visual and
Motion), paste-a-source becoming the primary connection rather than Local and GitHub, the
coexistence framing moving to PDFs and Notion instead of Storybook, and the Specimen Wall
needing a copy-domain twin.

This reframe takes four of those five. Record it as the audience decision and let the build
order follow, rather than letting a homepage edit quietly reorder the roadmap.

### The reading that makes generalizing safe

The addressable-market boundary says Tastefield serves "companies with a real, existing
system, not companies that need one invented." That has always been read as *code*. It never
said code. It said something real that already exists.

An article, a brand guide, a `SKILL.md`, a podcast transcript, a Notion page, and a repo are
all real, all already existing, and all compilable. That single reading removes every
design-system-specific word from the entry without touching the thesis or the boundary. The
verb stays "compile what you already have." Only the noun opens up.

**What this does not license.** A prompt box that generates a brand from nothing is still
out of scope, and it is still the lane declined in the blueprint's editor-first note. The
Composer needs a source. A blank prompt is not a source.

### Violations move from the fold to the payoff

A violation callout requires the visitor to have code, a system, and a reason to care about
compliance before anything on the page makes sense. The check does not disappear. It stops
being the opening claim and becomes the last step of the flow, which is where skilltune puts
its own score and where it lands harder.

**The risk, stated plainly because it is real.** Verification is the only structural
differentiator in a landscape of nine advisory tools, and "paste a thing, get context for
your agent" is a description of those nine products. Two mitigations, both cheap. Evidence
stays visible on every restraint card from the first screen, so the rigour is legible before
the check arrives. And the flow ends on the density panel rather than a download button, so
the last thing a visitor sees is the thing nobody else can show.

---

## Part 1. The architectural thesis

### The reference sites argue for module design, not page shape

skilltune.dev and Klint are the right references. Both are also single long scrolls, so the
instinct to copy them wholesale would produce the exact page this document is replacing.
What actually makes them good is smaller than their layout.

**skilltune contributes a module grammar.** Its lab is five numbered, self-contained units:
01 Measure, 02 The loop, 03 Test-refine-re-run, 04 Audit trail, 05 Export. Each one states a
job, shows the working interface for that job, and stops. That grammar is reusable at any
page length. Its page *volume* is the wrong model, and the blueprint already says why: it
makes an unfalsifiable headline claim (+20%) and then spends nine sections defending it.
A claim that needs nine sections of defense is a weak claim.

**Klint contributes the agent-native surface.** A live tabbed query as the hero instead of a
screenshot, a one-line contrast FAQ, a determinism block, an agent-installable setup line,
and docs written for machines. Those are page-level mechanics that survive being split
across routes.

Taking the grammar and dropping the volume is what produces short pages. The user instinct
and the reference sites agree once you separate the two.

### One shell, two kinds of page

The site is an application with a marketing surface inside it, not a marketing site with a
product bolted on.

Tastefield is building a marketplace. A marketplace needs pages that are browsed, filtered,
sorted, opened, compared, and installed from. Those pages cannot live at the bottom of a
sales scroll. They need a persistent shell: navigation, filters, status badges, keyboard
navigation, and a run action available everywhere.

Once that shell exists, the argument pages should live inside it too. A visitor who reads
the thesis page and then opens the registry should never cross a seam where the design
language changes from brochure to tool.

**This is a real advantage, not a preference.** skilltune and Klint both simulate product UI
on their marketing pages: fake tabs, fake terminals, fake result panels, all hand-authored
markup. Tastefield's product is a web editor plus a registry, so the same components can be
the real thing. The marketing page can run the actual checker against the visitor's actual
paste. The registry page can be the actual registry. Where competitors ship a picture of
the product, Tastefield can ship the product and let it double as the argument.

That is the same move as the Klint trust-spine transfer recorded in the blueprint: borrow
the structure, win on substance.

### Three rules that keep pages short

1. **One job per page.** If a page answers two questions, it becomes two pages or one of the
   questions moves to the page that owns it.
2. **Three screens maximum.** Anything past the third screen is a link, not a section. The
   long-scroll plan's eleven sections became ten pages precisely here.
3. **The H1 is the question the visitor arrived with.** Klint's FAQ leads with "How is this
   different from a scraper?" and answers it in two sentences. Every page below states its
   question and answers it above the fold. Pages do not warm up.

### One thesis, stated once

`FORBIDDEN.md` bans restating the advisory-versus-enforcement thesis as a couplet in every
section. The multi-page split gives that ban a clean mechanism: the category definition
appears exactly once, as a pull quote, on page VI. No other page argues it. Other pages
demonstrate it and link.

Two matched-clause lines therefore exist on the whole site, and both are budgeted. Both now
sit on page VI after the Composer reframe: the verification H1 runs under the documented
exception in `FORBIDDEN.md`, and the thesis pull quote runs under this rule. Page I no
longer carries either. There is no third anywhere.

Worth watching, since two exceptions on one page is how a ban erodes. If page VI reads as
rhetorical rather than plain, drop the pull quote first and keep the H1.

---

## Part 2. Site map

Roman numerals are the field-guide rail from the art direction, promoted from in-page
section markers to the site index. A field guide with plates and chapters is a better fit
for a multi-page site than it was for a single scroll.

| # | Route | Job to be done, in the visitor's words | Primary action | Build |
|---|-------|----------------------------------------|----------------|-------|
| I | `/` | Give me something my agent can use, from something I already wrote | Compose from a source | Now |
| II | `/playbooks` | Find a starting point for the job I am doing | Open a playbook | Now |
| III | `/playbooks/[slug]` | Decide whether to install this one | Install, or run it | Now |
| IV | `/studio` | Author my own and publish it | Start a draft | `Soon` |
| V | `/install` | Get it into my editor | Copy the command | Now |
| VI | `/verified` | Understand how this differs from what I already have | Run it | Now |
| VII | `/proof` | Check whether the claims hold up | Read the caveat | Now |
| VIII | `/status` | See what actually works today | Open a shipped playbook | Now |
| IX | `/sources` | Confirm this will not disturb my current tools | Connect a source | Now |
| X | `/why` | Decide whether to trust the people behind this | Read the letter | Now |

Machine surfaces, addressed separately in Part 4: `/agents`, `/llms.txt`, `.md` variants of
every page, and `/.well-known/agent-skills/site-skill.md`.

### The shell

**Top bar, persistent.** Wordmark, the page index, a Run action, Docs, GitHub. The Run
action never disappears, because running the checker is the conversion event on every page.

**Left rail, page-scoped.** The rail is the field-guide index on argument pages (VI through
X) and turns into filters on browse pages (II). One rail, two jobs, decided by route. This
avoids the two-rail collision a persistent index plus marketplace filters would create.

**Command palette.** Jump to any playbook or page. Cheap to build, and it signals tool rather
than brochure more strongly than any copy line on the page.

**Honesty badges inline.** `Soon` and `Next` render in the nav itself, so an unbuilt page is
labelled before it is clicked rather than after. Page VIII carries the full three tiers.

### What the FAQ page becomes

There is no FAQ page. Objections move to the page that owns them, phrased as the page's own
question. This is the one-job rule applied to doubt.

| Objection | Lives on |
|-----------|----------|
| How is this different from a skill pack, Supernova, or Figma's MCP server? | VI `/verified` |
| Can you guarantee a clean first pass? | VII `/proof` |
| Does my code leave my machine? | V `/install` |
| Will this disturb Figma, zeroheight, or Storybook? | IX `/sources` |
| What does not work yet? | VIII `/status` |

Risk worth naming: FAQ pages earn search traffic for question queries. Mitigation is that
each page keeps a question-shaped heading and its own structured-data block, which indexes
better than five answers buried in one accordion.

---

## Part 3. Page outlines

Each page below gives the job, the arrival context, headline options with a recommendation,
the modules in order, and the length cap. Copy here is direction, not final draft. Final
copy still goes through the section loop in `docs/marketing-copy/`.

All headline options are checked against `FORBIDDEN.md`. Conflicts found in the existing
plan's recommended headlines are listed in Part 5.

---

### I. `/` · Run it

**Job.** Give me something my agent can use, from something I already wrote, without an
account.

**Arrival.** Cold traffic, a link from a coding-agent or creative community, or a
colleague's paste. The visitor uses an AI agent and has watched it produce something that
was not theirs. They may be a developer with a repo or a creative director with a brand
guide. The page cannot assume which.

**One action.** Paste a source into the Composer.

### The Composer

The editor is renamed. `Composer` beats `editor` on two counts: editor implies you already
have a thing and are changing it, which is the design-system-owner assumption this reframe
sheds, and composer shares a root with compile, which is the product's actual verb. Minor
name collision with the PHP package manager, irrelevant in this context.

The Composer is the product's third verb, not a text box on a marketing page. Klint made
Extract a first-class endpoint with its own hero tab rather than burying it inside search,
and the Composer deserves the same treatment.

**Accepted sources, day one.** An article or post URL, a pasted `SKILL.md`, a brand guide or
Notion page, pasted code or a component, a GitHub repo URL, a transcript. Live-site scanning
still waits on the unresolved question in Open items.

**What comes back, by source.** The same output shape every time, which is what makes the
generalization legible rather than vague.

| Paste | Get |
|-------|-----|
| An article about your brand voice | Voice restraints, each quoting the line it came from |
| A `SKILL.md` you already use | The same skill, with checkable rules attached |
| A brand guide or Notion page | Tone, banned phrases, do and don't pairs |
| A podcast transcript | Show-notes voice and sonic brand restraints |
| A repo | Tokens and component contracts |

**Headline options.**

- **A (recommended).** `Give your agent the rules you already wrote down.`
  Active, one idea, no design-system vocabulary, and "already wrote down" carries the
  addressable-market boundary inside the sentence. Reads to a creative director with a brand
  guide and to a developer with a repo without changing a word. Same construction as Klint's
  `Give your agent eyes on social data`, which is the proven form for this audience.
- **B.** `Compile what you already wrote into context your agent can use.`
  States the mechanism. Longer, and "compile" may need a beat of explanation for the
  creative half.
- **C.** `Your brand and taste, compiled for your agent.`
  Closest to the locked tagline. Safest, least active, and it describes rather than invites.

**Relocated, needs confirmation.** `Everyone else grades the skill. We grade what your agent
shipped.` was decided as this page's H1 earlier the same day, with an exception carved in
`FORBIDDEN.md`. It is a verification claim, and verification is no longer what this fold
does, so it now belongs on page VI where the verification argument lives. See Part 5.

**Eyebrow.** `The brand and taste layer for agents.` The locked tagline sits here.

**Trust line, above the fold.** Local run. No account. Nothing leaves your machine.

**Subhead.** Your agent has never read your brand guide, so it guesses. Paste the guide, an
article, or a repo, and get back rules it can actually follow.

**CTAs.** `Compose from a source` primary. `Start from a role` secondary, which is the
entry to page II.

**Modules, in order.**

1. **The Composer.** One input above the fold with source-type chips under it, pre-filled
   with a real example so nothing starts blank. Idle state is the drifting Specimen Wall
   already specced.
2. **The result: restraint cards.** The payoff, specced below. Not a report, and not a
   violation list.
3. **The install line.** A copyable line that puts your compiled playbook into Claude Code,
   Codex, or Cursor. The payoff is an artifact usable in the next thirty seconds, which is
   Klint's entire conversion mechanic.
4. **Sharpen it, optional.** Two clarifying questions that improve the output. Offered
   after v1 exists, never before it. See the skilltune note below.
5. **The check, as the last act.** Run your compiled playbook against a locked task set and
   show measured violation density. This is where verification returns, and it is the last
   thing on the page rather than the first.

Everything above is anonymous. Save, fork, and publish are gated on IV, never here.

### The restraint card

The load-bearing artifact, and the one thing on this page that has never been designed. The
blueprint calls the format "the strongest single element on tastelab.xyz" and its absence
"the largest unforced omission" on the current site.

It replaces the violation callout as the payoff for three reasons. It works for any source,
including sources with no code in them. It reads instantly to a creative in a way an
off-palette hex never will. And it carries evidence, so the determinism spine stays visible
even though nothing has been checked yet.

**Five fields, already adopted in the blueprint:** Trigger (what decision prompted it),
Decision (what was chosen), Reason (the logic), Evidence (the quoted source line, with a
link back to where it came from), Trade-off (what it gives up).

**Render it as working product UI, not a documentation block.** Blume's suggestion cards
are the reference: a claim, then evidence with a count, then a typed artifact badge, then
two actions. The same restraint shown as a prose block reads as a spec. Shown as a card with
`Keep` and `Drop` on it, it reads as a live system the visitor is already operating.

**Evidence is the non-negotiable field.** A restraint with no quoted source is a guess, and
shipping one would break the "evidence beside every claim" principle on the exact screen
where the trust argument is being made without words.

### What skilltune's four steps contribute

Their tabbed walkthrough is the closer analogue to this page than Klint's hero, because
their product also makes an artifact for an agent. Use it as the section directly beneath
the Composer, explaining what just happened and what else is possible.

**The module grammar, taken from their screenshots.** Left column is small: a short heading,
three lines of body, two checkmark bullets, and a status chip (`INPUT`, `SETUP`, `DRAFT`,
`RELEASE`). Right column is a realistic product panel with a ghost numeral behind it. Stamp
it four times.

**Tastefield's four:** `01 Paste a source`, `02 Pick a role`, `03 The Composer fills the
gaps`, `04 Install it and check it`.

**One deliberate inversion.** skilltune blocks the first output behind clarifying questions.
For a page selling immediacy, produce v1 first and offer the questions as an upgrade. The
questions become a way to sharpen the result rather than a toll on seeing one.

**Their step 04 is where the differentiation quietly sits.** They show a score climbing
toward 90, judged by a model against cases it wrote itself. The same visual slot holds
measured violation density against a locked task set, which is a real number. Take the slot,
not the metric.

**Length.** Three screens. Problem, advisory versus verified, compiled-today, coexistence,
proof, registry, FAQ, and the founder letter do not appear here. They are pages II
through X.

**Meta.** Title: `Tastefield: compile what you already wrote into context for your AI agent`.
Description: `Paste an article, a brand guide, a SKILL.md, or a repo. Get rules your agent
can follow. Runs locally. No account.`

---

### II. `/playbooks` · Browse

**Job.** Find a starting point for the job I am doing.

**Arrival.** From the home page's secondary CTA, from a shared playbook link, or from search
for a category or role term.

**One action.** Open a playbook.

**No hero.** A marketplace index that spends its fold on a headline is a marketplace that
does not trust its inventory. Page title, one line of description, then the index. This is
the clearest place the functional instinct pays off.

**Page title options.**

- **A (recommended).** `Find your playbook` with the one-liner: `Start from a compiled system instead
  of a blank file.` Plain, and the index does the selling.
- **B.** `Find a starting point for the job you are doing.` Warmer, costs a screen line.
- **C.** `Find your playbook by role or category.` States the taxonomy up front, useful only once
  both axes have real content.

**Klint's IA is the model here, and it maps onto the roles already defined.** Klint does not
organize by feature. It organizes by job cluster (Decide what to make, Understand what
worked, Work with creators), and each use case inside a cluster is a cookbook installable as
a skill. That is structurally identical to `creative-director`, `social-media-manager`,
`podcast-producer`, and `marketing-director`, with each role playbook as the cookbook. The IA
is proven for this audience, so borrow it rather than inventing one.

**Roles lead after the Composer reframe.** Page I now accepts an article or a brand guide,
so a visitor arriving at II is more likely to be asking "what should my agent be good at"
than "what product category am I building." Put roles above categories on this page and let
categories be the second grouping.

**Modules.**

1. **Two axes, kept separate.** Find your playbook by role first, then by product category.
   The blueprint is explicit that mixing them recreates the "seems random" failure the
   taxonomy was built to fix.
2. **Each role is a cluster, not a link.** A role shows three or four concrete jobs
   underneath it, the way Klint's clusters do, each linking to a playbook. A bare role name is
   a category header; a role with jobs under it is a shortlist.
3. **Filter rail.** Domain, role, category, and status. Filters live in the left rail, which
   is why the rail is page-scoped in Part 2.
4. **Honest cards.** Each card shows what the playbook checks, not just what it contains. A
   rule count is a real number available today. Install counts stay `null` and render as an
   em dash, per non-negotiable #2. Do not add a popularity sort until real usage exists.

**One vocabulary rule, from Klint's fixed catalog.** A role label means the same thing on
every playbook. `creative-director` cannot quietly mean something different in two entries, or
the index stops being navigable and becomes a pile. This is the closed-vocabulary principle
from the blueprint's Architecture section, applied to the taxonomy the marketplace is sorted
by.

**Length.** One screen plus the index. No closing CTA section.

**Status caution.** The registry is Phase 1 and not built. This page ships when first-party
catalog content exists, which is funding-order step 1. An empty marketplace with a sponsor
slot is the specific failure the blueprint warns about.

---

### III. `/playbooks/[slug]` · Playbook detail

**Job.** Decide whether to install this one.

**Arrival.** From II, from a shared link, or from an agent following a docs reference.

**One action.** Install. Secondary action is running it against your own source, which loops
back to the Composer with this playbook loaded.

**This is where skilltune's module grammar belongs.** Its numbered lab units map almost
directly onto what a playbook page must prove, and this page is the marketplace's money page.

**H1.** The playbook name, with the compiled rule count and domain beside it as metadata. No
marketing headline on a product detail page.

**Modules, numbered on the page.**

1. **What it checks.** The compiled rules, listed with their IDs and one plain sentence
   each. Named, countable, verifiable.
2. **What it contains.** Tokens, component contracts, and restraints. Ship named files the
   way tasteprofile.io does rather than describing features.
3. **A worked restraint.** One restraint rendered in the Trigger, Decision, Reason,
   Evidence, Trade-off format, as a reviewable card rather than a prose block. The blueprint
   calls this the largest unforced omission on the current site.
4. **Evidence.** Where each rule came from, with the source token and the file that defines
   it. This is Architecture principle 2 surfacing as a product surface.
5. **Install.** The command, plus the live connection option, with the distinction stated
   plainly: an exported file is a snapshot, the live connection keeps checking.

**Length.** Three screens, and it earns them because this page is the transaction.

---

### IV. `/studio` · Author

**Job.** Author my own playbook and publish it.

**Status.** `Soon`. Funding-order step 2. The page can exist earlier as a labelled preview
with a waitlist, provided the badge is honest and the run on page I stays free.

**One action.** Start a draft.

**H1 options.**

- **A (recommended).** `Author your playbook from a system you already have.`
  Keeps the addressable-market boundary visible: Tastefield compiles what exists rather than
  inventing a brand.
- **B.** `Turn your design system into rules an agent can fail.` Sharper, closer to the
  banned couplet shape, so it needs a careful read before use.

**Modules.** The authoring loop, the eval panel showing measured density per version, the
version history, then Publish. The gate is stated here: an account buys persistence and
distribution, never the ability to see whether the thing works.

**Do not.** No LLM-judged prose score as the headline metric. That is skilltune's field and
it abandons the only property eight competitors have been found lacking.

---

### V. `/install` · Add it to your editor

**Job.** Get it into my editor in the next minute.

**One action.** Copy the command.

**H1 options.**

- **A (recommended).** `Add Tastefield to your editor with one command.`
  Compliant rewrite of the plan's `One command. No account.`, which is a staccato pair and
  banned. See Part 5.
- **B.** `Start with the repo you are already in.` Situational, good for warm traffic.
- **C.** `One command adds it. No account is needed.` Keeps both facts, breaks the drumbeat
  by varying sentence shape.

**Modules.** Tabbed config per client (Claude Code, Codex, Cursor) with literal JSON and
copy buttons. Then the channel list, with the live connection presented as the channel and
the exports as copies of it. Then the privacy answer, which is this page's owned objection:
the scan runs locally and nothing is sent.

**Codex caveat.** Not yet tested end to end against the MCP server. If that assumption
breaks, badge Codex `Soon` rather than listing it as shipped.

---

### VI. `/verified` · How this differs

**Job.** Understand how this differs from the skill packs, context servers, and brand tools
I already know about.

**This is the Klint contrast-FAQ lesson as a page.** Its H1 is the question itself.

**H1 options.**

- **A (recommended after the Composer reframe).** `Everyone else grades the skill. We grade
  what your agent shipped.`
  The relocated line, moved here from page I because this is the page where verification is
  the argument. It runs under the documented exception in `FORBIDDEN.md`. Pair it with the
  question form as the eyebrow, so the page still opens on the visitor's own question:
  `How is this different from a skill pack?`
- **B.** `How is this different from a skill pack?`
  The question the visitor actually arrived with, and Klint's exact mechanic. Use this as
  the H1 if the relocated line reads as too combative for a page whose job is to inform.
- **C.** `What Tastefield checks that other tools do not.` Declarative, less inviting.

**The answer, in the first two sentences.** A skill pack adds guidance to the prompt and
stops there. Tastefield checks the code the agent produced and names the line that broke
your rule.

**The thesis, once, as a pull quote.** `A rule an agent merely reads is advisory; a rule
that can be verified is enforcement.` This is its single appearance on the site.

**Modules.**

1. **Two cards.** Advisory on the left as prose with no outcome. Verified on the right as a
   compiled rule with its pattern and a real failing result underneath.
2. **The named tools, in one answer rather than three fights.** Supernova serves a team's
   design system to an agent as context. Figma's MCP server can scan a codebase and generate
   a rules file. Tastefield checks the agent's output against your rules and flags the line
   that broke one. Keep the internal shorthand internal; the couplet form is banned.
3. **The trust block.** Every violation points to a real rule and a real source token.
   Pass and fail are deterministic. A value that is not in your system is reported as not in
   your system rather than replaced with a guess. This is the Klint trust spine run one level
   up, and it is only sayable for as long as the four Architecture principles hold.

**Length.** Two screens.

---

### VII. `/proof` · What we measured

**Job.** Check whether the claims hold up.

**H1 options.**

- **A (recommended).** `What we measured, and what we have not.`
- **B.** `The honest version of the numbers.`
- **C.** `Proof, with the caveats attached.`

**Modules.** The stat cards from the existing bench run, the amber caveat card kept
verbatim, and this page's owned objection answered in full: no, we cannot guarantee a clean
first pass, and here is what we do instead.

**Hard constraint.** No headline density figure appears anywhere on the site until the real
two-arm benchmark runs. The 31.21-to-0 number stays scoped to this page's caveat card and is
never promoted to page I. Page I's number comes from the visitor's own run, which is a live
measurement rather than a claim.

**Worth keeping.** A `What we have not proven` entry in the nav. Nothing in the competitive
set has one.

---

### VIII. `/status` · What works today

**Job.** See what actually works today and what does not.

**H1.** `What works today, and what does not yet.`

**Modules.** The three honesty tiers from Blume, at product scope: shipped with no badge,
`Soon` inline on the same list, and a separated `Next` block. Nine compiled rules ship
today, including two that are not visual, so the copy and voice claim is supportable.

**Why this is a page and not a strip.** As a strip at the bottom of a scroll it reads as
debt being admitted. As its own linked page with a nav entry it reads as a product with a
public status page, which is the trust posture the competitive set lacks.

---

### IX. `/sources` · What it reads

**Job.** Confirm this will not disturb the tools my team already uses.

**H1 options.**

- **A (recommended).** `Tastefield reads your tools and never writes back.`
  One sentence, states the guarantee, avoids the banned `We read. We never write back.`
  drumbeat and the banned coexistence couplet.
- **B.** `Your source of truth does not move.`

**Modules.** The source grid with honest `READ-ONLY` and `PLANNED` badges, which the plan
correctly calls one of the better things on the current site. Then the connection status per
source.

**Mergeable.** This is the lowest-priority page and the strongest candidate to fold into VI
if ten pages proves to be too many. Keeping it separate is defensible only while
design-system owners are the primary audience, which is itself an open question.

---

### X. `/why` · Why this exists

**Job.** Decide whether to trust the people behind this.

**H1.** `Why this exists.`

**Modules.** Long-form prose, generous measure, signature. This is where the beyond-code
vision lives, in prose, where ambition reads as conviction rather than as a claim.

**Alternate worth considering.** A dated decision log drawn from the blueprint's own
entries. Nobody in the competitive set publishes their reasoning with dates attached, and
the blueprint is already written that way, so the content cost is near zero.

---

## Part 4. Machine surfaces

From the Klint lesson promoted in the blueprint's Backlog. These are pages, so they belong
in the architecture rather than in a backlog list.

- **`/agents`.** A page addressed to the machine, with the copyable one-liner: fetch this
  URL and set up Tastefield in this project. Mirrored by a visible "do it yourself or let
  your agent do it" split on V.
- **`.md` variant of every page.** Append `.md` to any route for raw markdown.
- **`/llms.txt`.** Index of the site for agents.
- **`/.well-known/agent-skills/site-skill.md`.** The registered convention, published
  alongside `llms.txt` rather than instead of it.
- **Errors name the fix.** A convention for the whole site, not only the docs.

---

## Part 5. Headline conflicts with FORBIDDEN.md

`FORBIDDEN.md` was written during the 2026-08-17 section reviews. Several recommended
headlines in `MARKETING_SITE_PLAN.md` predate it and now violate it. The 2026-08-19 FAQ note
already caught one instance and rewrote it, so the ban is live and being applied unevenly.
Flagging the rest rather than silently rewriting them, since two are locked picks.

| Existing recommendation | Pattern | Suggested compliant form |
|-------------------------|---------|--------------------------|
| `Everyone else grades the skill. We grade what your agent shipped.` (hero) | Isocolon pair, matched clauses with a swapped noun | **Exception carved, then relocated the same day.** Keeps the line, now as the page VI H1 rather than the home H1. See below and `FORBIDDEN.md`. |
| `One command. No account.` (install) | Staccato pair | `Add Tastefield to your editor with one command.` |
| `A rule your agent can read is advice. A rule that can fail is enforcement.` (thesis) | Isocolon pair | Allowed once, as the pull quote on VI. Never as body copy. |
| `Browse by the problem, not the company.` (registry) | `not X` turn | `Start from a compiled system instead of a blank file.` |
| `Figma is where your team decides. Tastefield is where the agent complies.` (coexistence) | Already caught in FORBIDDEN | `Tastefield reads your tools and never writes back.` |
| `We read. We never write back.` (coexistence alt) | Staccato pair | Same as above. |
| `Start from a playbook, not a blank file.` (registry) | `not X` turn | `Start from a compiled system instead of a blank file.` |

**Resolved 2026-08-20: the exception is carved, the other six rewrites stand.** The line
stays, recorded in `FORBIDDEN.md` under Documented exceptions with the conditions that keep
it honest: one appearance on the site, never as a subhead or body copy, no second isocolon
licensed anywhere, and the exception expires if the eval ever stops being deterministic.

**Amended later the same day by the Composer reframe, and this needs a one-line
confirmation.** The line is a verification claim. Page I no longer leads with verification,
so the line no longer describes what the home fold does. It moves to page VI, where the
verification argument lives and where it is the H1 the visitor actually arrived for. The
exception's scope in `FORBIDDEN.md` has been updated to match. Reverting is one word if you
would rather keep it on the home page and reopen the fold question instead.

Worth stating plainly, because an exceptions list is how a style guide dies. The reason this
one is safe is that it is written as a named sentence rather than a permitted pattern. A
future draft cannot cite it to justify a new couplet, only to reuse this exact line in this
exact slot. Any second exception should have to argue for itself the same way.

---

## Part 6. What carries over and what retires

**Carries over unchanged.** The organizing thesis and its single-appearance rule, all four
positioning rejections, the entire art direction section including the Field Guide, the dusk
frontispiece, the dandelion motif, the type stack and the character veil, every copy
mechanic in "Copy mechanics worth reusing", and all seven open items.

**Carries over, relocated.** Old sections 1 through 11 map onto pages as follows. Hero to I.
Compiled-today to VIII. Problem folds into I's subhead and VI's two cards, losing its
standalone section. Advisory to VI. Agent-receives to III module 3 and I's fourth result
tab. Coexistence to IX. Registry to II and III. Proof to VII. FAQ distributes per Part 2.
Founder letter to X. Install to V.

**Retires.** The eleven-section single scroll, the standalone Problem section, and the FAQ
page. The null-answer stack from the Problem section is the one real loss; it is good writing
and `FORBIDDEN.md` already caught most of it as an isocolon litany, so retiring it resolves
an open conflict rather than creating one.

**Changes meaning.** The art direction's argument for numbered sections was that a single
scroll compresses caveated content into three feature cards. That argument now supports the
page split instead, and the Roman-numeral rail becomes the site index. The direction gets
stronger, not weaker: a field guide is chapters and plates, which is a multi-page object.

---

## Part 7. Build order

Mapped onto the funding order already recorded in the blueprint. No new phases.

1. **Shell, I, V, VI, VII, VIII.** The shell plus the run, install, difference, proof, and
   status pages. This is funding-order step 1's public half and it is shippable without the
   registry or the Studio.
2. **II and III.** Browse and playbook detail, when first-party catalog content exists. Still
   step 1, gated on content rather than engineering.
3. **IV.** Studio, funding-order step 2, badged `Soon` until it ships.
4. **IX and X.** Sources and the founder letter, cheap and low-risk, fit anywhere.
5. **Part 4 machine surfaces.** Near-zero engineering, high signal, can ride with step 1.

---

## Part 8. Open decisions for review

1. **Resolved 2026-08-20: ten pages.** Merge later if the site feels thin, since merging is
   cheaper than splitting and each page currently has a distinct job. IX and X stay the
   first candidates to fold if that changes.
2. **Resolved 2026-08-20: the hero headline keeps its line.** Exception carved in
   `FORBIDDEN.md`. See Part 5.
3. **Left rail behavior.** Page-scoped as proposed, or a persistent index with filters moved
   inline as chips on II.
4. **Does `/studio` ship as a labelled preview** before it works, or stay absent from the nav
   until step 2 completes. A `Soon` page with a waitlist is honest and builds a list. An
   absent page is more honest still.
5. **Resolved 2026-08-20 by the Composer reframe: the audience widens to include creatives.**
   See the reframe section at the top. Four of the five consequences the blueprint listed are
   now in this document. The fifth, a copy-domain twin for the Specimen Wall, is not yet
   designed and is the next real gap. Domain build order should follow (Copy and Brand ahead
   of Visual and Motion), which is a blueprint edit rather than a site edit.
6. **Live-URL scanning** remains unresolved and page I's paste-a-source list depends on it.
   Repo, `SKILL.md`, and pasted code are safe today. A live site URL is not.
