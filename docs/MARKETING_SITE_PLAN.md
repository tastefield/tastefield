# Marketing site plan (apps/web)

Derived from `TASTEFIELD_BLUEPRINT.md` (working context) and cross-referenced against
`claudcode/CLAUDE.md`. Line references below point at the blueprint. Don't undo a
decision here without reading the reasoning it cites.

Target: `apps/web` (Next.js 16, Tailwind v4, motion). Phase 2 work.

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
line 311 identifies as content-side and explicitly a bad fight to pick. Widening both
halves walks into that fight.

---

## Positioning decisions and why

**Rejected: "the taste engine for AI agents."** Four reasons, all sourced.

1. Line 92 states the beyond-code vision is "vision, not roadmap... Don't let this bleed
   into Phase 2/3 descriptions until it's actually decided." The marketing site is Phase 2.
2. It implies Tastefield *supplies* taste. The architecture assumes the opposite — line 318
   scopes the addressable market to "companies with a real, existing system, not companies
   that need one invented."
3. It occupies the position line 316 identifies as the sharpest differentiator *against*:
   buildwithtaste.com aggregates "what you personally like... not what your company
   actually, already is."
4. Unfalsifiable, which collides with the spirit of non-negotiable #3.

Note the current blueprint already dropped this tagline — it survives only in the older
v2.2 draft.

**Rejected: "design system intelligence."** Same scope as "design system" (one of eight
domains) with a vaguer claim. "Intelligence" describes Adobe's opaque brand brain
accurately and a checkable regex badly — it sells the exact property line 320 says to
avoid. Also a direct echo of a much larger company's product name.

**Rejected: leading with skill-bundling / recipes.** Line 299 records that Vercel Packs
"is the recipe concept," already shipped. Line 309: registries "distribute files,
Tastefield compiles and enforces them." Line 327: generic category recipes are "genuinely
exposed" to @skills' 60,000+ free alternatives, while the compiled engine is "the
defensible half." Leading with bundling markets the commoditized surface.

---

## Section-by-section

Each section lists five headline options with the recommended pick marked, body copy,
a primary visual, and three alternates.

---

### 1. Hero

**Headlines**

1. **Your brand, enforced as the AI types.** — *recommended, direct*
2. Your agent has never read your brand guidelines. Now it can't ignore them. — *couplet*
3. Every rule your agent can ignore is a rule you'll fix in review. — *adversarial*
4. Compiled brand rules. Served to your agent. Checked before commit. — *technical*
5. AI writes your components. You still own the brand. — *ownership*
6. Tired of reviewing AI code for things a regex could catch? — *question, added
   2026-08-17 from blume.codes ("Tired of steering your coding agents?")*

On option 6: a question qualifies the audience and structurally cannot over-promise, which
is the exact trap "taste engine" fell into. Still recommend leading with the declarative
form — question headlines drift toward infomercial unless the pain is very specific — but
it's the one shape the other options don't cover.

**Add a "Works with" logo strip immediately below the hero.** Cursor, Claude Code,
Windsurf. Blume places this directly under their fold; the current site buries it as a text
line down in Install. Compatibility is a first-five-seconds question for this audience.

**Body**

> Cursor has never opened your design system, so it guesses. A hex that isn't in your
> palette. A prop that doesn't exist. A tone your brand would never use. Tastefield
> compiles the rules you already have and checks the output before it reaches your diff.

Eyebrow: `● Local MCP server · nothing leaves your machine`
CTAs: `Add to your editor` · `See what it catches`
Trust line: Works alongside Figma, zeroheight and Storybook. Replaces none of them.

**Primary visual — drifting wall with a live receipt.**

Two rows of UI primitives drifting sideways, six or more always in frame, no discrete
slides. A density/radius slider restyles all of them simultaneously while a rule panel
compiles beside them and a `check_compliance` badge flips FAIL → PASS.

Two constraints from the blueprint govern this:

- **Not a carousel.** Line 170: a wall of unrelated primitives "has no structural reason
  to look coordinated; watching all of them snap together at once is what proves
  'systemic' in the first place." A carousel is sequential and spends that proof.
- **Must show enforcement, not just extraction.** Line 302: `extract-design-system` has
  127K installs on a 176-star repo — "Differentiation has to be enforcement *after*
  extraction, not extraction." A slider that only restyles is the commodity half.

Violation callouts on the ungoverned state are required, per line 172.

**Alternates**

- Two agents, one prompt, diverging live. Most persuasive; line 179 scopes it as a
  recorded video rather than hero real estate because it's slow and expensive live.
- Terminal-first: a real `npx` run streaming compiled rules with a counter. Cheapest to
  build, strongest signal for a developer audience, no design risk.
- Single component with rules printing beside it like register tape. Focused, but
  forfeits the systemic proof.

---

### 2. What's compiled today — *and what's coming*

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

*`Next`, separate "On the horizon" section.* The public registry, role recipes, the
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
- A live violation counter. Requires the opt-in anonymized pool from line 127 — future.

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

It also connects two things already decided: the compiled-draft review surface at line 234,
and the correction-becomes-candidate-restraint mechanic at line 320. Blume is shipping that
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

Read-only always, per line 193. Sources and their status from line 187.

**Primary visual:** keep the existing source grid with honest `READ-ONLY` / `PLANNED`
badges — one of the better things on the current page.

**Alternates**

- One-way arrows into the compiler with the reverse direction visibly blocked.
- A hover that attempts write-back and gets rejected. Turns a promise into a demonstration.
- Logo strip with a single sentence.

---

### 7. Registry

**Phase 1, not built. Must be labelled as visibly as the Sources grid labels Figma.**

**Headlines**

1. **Browse by the problem, not the company.** — *recommended*
2. `linear-vibe` has no story. `fintech-trust-first` does. — *concrete*
3. Start from a recipe, not a blank file. — *benefit*
4. Recipes for what you're building — and who's building it. — *two axes*
5. A registry your agent can query mid-task. — *differentiating*

Show both axes as separate sections, per line 261: recipes by product category and
recipes by role. Mixing them "recreates the exact 'seems random' failure the category-first
taxonomy was originally designed to fix."

**Primary visual:** two-column taxonomy browser with mood-caption variant cards (line 255),
placed inside the "On the horizon" tier established in section 2 rather than carrying its
own ad-hoc `PLANNED` ribbon. One roadmap vocabulary across the whole page, not two.

**Alternates**

- The mood picker alone — choose by vibe before reading a token table.
- The dual-axis leaderboard, Taste vote beside Compliance score. Line 139: something
  Design Arena structurally cannot build, because it has no enforcement engine.
- A creative-skills table with a **Gen Agent Trust Hub audit column**. The most defensible
  registry surface: skills.sh shows install counts and no safety signal, and the sweep
  found `emil-design-eng` at 203.7K installs hidden behind a broken singular/plural link
  (line 298). Consistent with non-negotiable #5 — displaying a flagged skill is fine,
  bundling it into a recipe is not.

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
site, and line 331 requires it: both arms were hand-authored by the same author in one
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
final work" (recorded at line 316). Tastefield has a checker. Copy their rhetorical
structure — admit the limit, then reframe — but not their answer. This is the single
clearest paragraph available on the site, and it satisfies non-negotiable #3.

**Primary visual:** accordion with that question expanded by default.

**Alternates**

- Objection/answer pairs in section 3's typographic style, tying the two together.
- Long-form prose, no accordion. Reads as confidence.
- Side-by-side against competitors' published answers. Effective, aggressive; not recommended.

---

### 10. Founder letter

Where the beyond-code vision goes, per line 92's instruction to keep it out of shipped
product copy. Ambition reads as conviction in prose and as a claim in an H1.

**Headlines**

1. **Why this exists.** — *recommended*
2. Brand judgment is the last thing AI can't do for you. — *thesis*
3. The Swiss Army knife, not the table saw. — *line 77*
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

**Headlines**

1. **One command. No account.** — *recommended*
2. No API key. No cloud. No signup. — *triplet*
3. Start with the repo you're already in. — *situational*
4. Add it to your editor in about a minute. — *time*
5. `npx`, and you're governed. — *compressed*

**Primary visual:** tabbed config blocks per client — Cursor, Claude Code, Windsurf — with
the literal JSON and copy buttons, the way tastelab.xyz lists exact file paths per tool.
The current page reduces this to a throwaway line.

**Alternates**

- An asciinema recording of a real install.
- A "Try in Cursor" deep link — already in the backlog at line 147.
- Three numbered steps with copyable commands.

---

## Art direction (decided 2026-08-17)

**The constraint that sets everything else: painted pastoral is already taken, twice, by the
two closest competitors.** tasteprofile.io (line 316) is rolling green hills under painted
cumulus. Blume (line 329) is a flower field under painted cirrus. Both light, both
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
only Visual genuinely ships (line 335), a registry that isn't built. A single scroll
compresses that into three feature cards and a CTA, and the honesty that is supposed to be
the differentiator reads as thin instead. Numbered sections let the rigour breathe and make
the page feel authored rather than assembled. It is also harder to copy than a sky.

The vocabulary already agrees: the hero is called a **Specimen Wall** (line 162). "Specimen"
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
specified at line 236. Seeds dispersing and taking root is a design system propagating into
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

### Do not

**No AI-generated hero art.** Both Blume's and HQ's fields read as authored by a person, and
that is load-bearing for them. For a product whose thesis is that generative output is
generic, shipping a generative hero is a self-inflicted wound in front of an audience
selected for noticing. Commission, paint, or print something with a visible hand.

No repeated cones as decoration, no anthropomorphised food, and no second dessert type. The
product vocabulary already spends the food budget on "Recipes"; recipes plus ice cream plus
a field is a cooking site.

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
- **Promote human-in-the-loop review to a headline benefit.** Blume's "See Every Change
  Before It Lands — review the evidence and exact diff, then apply, dismiss, or save."
  Tastefield has this capability specified at lines 232–236 and it currently appears
  nowhere in the messaging.

**Do not copy** their page shape. Clearly Digital, Inc. is a services business — discovery
call, four phases, $999 workshop add-on, every CTA a booking. Tastefield's distribution is
`npx`, no account, no call, and line 311 identifies that friction difference as a win.

---

## Open items before build

1. **The registry section describes unbuilt inventory,** including an install command with
   a `--recipe=` flag that doesn't resolve. The Sources grid is scrupulous about this; the
   recipes section is not. Same fix, same badges.

2. **Resolved 2026-08-17 — the copy restraint already exists.** This item previously read
   "one copy restraint would retire most of the honesty debt the brand headline takes on."
   Verified against `src/compile/rules.ts`: `no-marketing-filler` is already compiled and
   already passing in the MCP smoke test, alongside `empty-states-need-action`. Section 5
   can show a voice rule beside a token rule today, using rules that ship.
   What remains is *breadth* of copy coverage — banned phrases, tone, per-brand voice
   rules — not the first one. Downgrade from blocking to normal roadmap work.

3. **Live-URL scanning is unresolved** (line 99). The hero's "paste a URL" interaction
   assumes `src/scan/` can extract from an arbitrary rendered site, which is a different
   pipeline from parsing a repo. Confirm or scope before building the hero around it.

4. **ABC Diatype's licence needs checking before it ships.** The files are already owned and
   in use on Machinekind, but Dinamo's webfont licences are typically scoped per domain and
   per pageview tier — a second project on a second domain is plausibly a second licence,
   not a free copy. Confirm coverage before launch. Fraunces, Commit Mono and Departure Mono
   are all OFL and carry no equivalent risk, so only the sans is exposed. Fallback if the
   licence doesn't extend: PP Neue Montreal, or Archivo at zero cost.

5. **The dusk frontispiece and the botanical plates need an illustrator.** The art direction
   rules out generative imagery for a reason it also has to live with — that work has to be
   commissioned, and it is the long-lead item on the whole page. Scope it before the build
   starts rather than discovering it as a blocker.
