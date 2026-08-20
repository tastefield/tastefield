# Homepage outline, page I (2026-08-20)

Section-by-section outline for `/`, with three options per section and a recommendation.
Written against `docs/MARKETING_SITE_ARCHITECTURE.md` (the Composer reframe and Part 3, page
I), `docs/marketing-copy/FORBIDDEN.md`, and the blueprint's Landing page hero, Editor-first
hero, Klint marketing transfers, and Eval panel entries.

Reference site for structure: skilltune.dev. Reference for the agent-native mechanics: Klint.

Status: proposal. Nothing here is decided. The architecture doc's page I decisions are
treated as settled and are not reopened; this document specifies the sections underneath
them.

**One thing to read before the options.** The whole outline is inside the `## User-facing
copy` block on purpose, so `scripts/check-marketing-copy.mjs` grades every candidate line
rather than a summary of them. The trade is that the reasoning prose gets graded too, which
is a discipline rather than a cost.

---

## What skilltune's homepage is, and what this page takes from it

Their page has nine sections in one scroll. Taking the grammar and dropping the volume is
the rule set in Part 1 of the architecture doc, so most of this table is a decline with a
destination attached.

| skilltune section | What it does there | Here |
|-------------------|--------------------|------|
| Hero: H1, a strikethrough device (`SKILL.md ✗` against `lab-tested ✓`), two CTAs, and a file tree of what a real skill contains | Claim, then an artifact beside it | **Take the artifact beside the fold.** Decline the strikethrough device: it wins the point by naming the opposite, which is the antithesis ban. |
| The problem: a `SKILL.md` panel, six question and answer pairs (`never tested`, `never ran them`, `no way to know`), closing on `You shipped it anyway.` | Manufactured doubt before the pitch | **Decline on this page.** Six matched pairs is the isocolon litany already banned, and the closing line is a backward-reference. The problem folds into the subhead and into page VI, per architecture Part 6. |
| The lab, `01 Measure` through `05 Export` | Numbered module grammar: small left column, product panel on the right, ghost numeral behind | **Take the grammar.** Four units, not five, and they become section 11 below. |
| Founder letter, signed | Trust through a named person | Page X. |
| How it works, `01` through `04`, tabbed | Steps with status chips and realistic panels | **Take.** Merged with the lab grammar into one four-step module. |
| Pricing, two plans | Conversion | **Decline.** The run is local, free, and account-free. A price on this page would sell the one thing the page has to give away. |
| FAQ, nine items | Objections | Distributed to the page that owns each, per architecture Part 2. |
| `Runs in every major AI coding tool` with seven logos | Reach | **Take, narrowed.** Claude Code, Codex, Cursor only. `every major tool` is a present-tense overclaim already banned. |
| Counters: 500K, 25M, 12K, and `+40 points` | Scale and uplift | **Decline.** Non-negotiable #2 and #3. Counters come from the visitor's own run. |
| `up to 20%` uplift as the headline claim | The whole pitch | **Decline.** It is unfalsifiable, and their own nine sections of defense are the evidence that it is weak. |
| Final CTA carrying the artifact (`your-next / SKILL.md`, `lab-tested ✓`) | Close on the thing you get | **Take.** Section 14. |

**The one structural lesson worth stating on its own.** Every skilltune module pairs a small
text column with a working panel. That pairing is what makes their page read as a tool. It
survives at any page length, which is why it can be borrowed by a three-screen page.

---

## Screen budget

The cap is three screens. The modules already specced for page I plus the four-step
walkthrough plus the result tabs add up to four or five, so the budget is the real design
constraint on this page and section 11 is where it gets resolved.

| Screen | Sections |
|--------|----------|
| 1 | Shell, fold, Composer input, source chips, idle state |
| 2 | Result: restraint cards, result tabs, install line, sharpen |
| 3 | The check, the machine row, the close |

---

## User-facing copy

### 1. The shell

**A (recommended).** Wordmark, the Roman-numeral page index, a persistent `Run` action,
Docs, GitHub. The index is the field-guide rail promoted to site navigation. `Run` never
disappears because running the checker is the conversion event on every page.

**B.** Wordmark and three links only. Cleanest fold, and it hides the fact that the site is
an application. It also hides the honesty badges, which is the cost that matters.

**C.** A collapsed shell on this page that expands on every other page. Gives the fold to
the Composer, at the price of the seam Part 1 exists to prevent.

*Recommendation: A.* The command palette ships with it, and a palette signals tool more
strongly than any line of copy on the page.

### 2. The fold: eyebrow, H1, subhead

Eyebrow options:

**A (recommended).** `The brand and taste layer for agents.` The locked tagline, in the
locked slot.

**B.** `Scan, compile, serve, check.` The canonical pipeline as the eyebrow, which puts the
mechanism above the promise.

**C.** No eyebrow. H1 alone at poster scale, per the type stack's rule that the size jump is
the effect.

H1 options, carried from architecture Part 3 without change:

**A (recommended).** `Give your agent the rules you already wrote down.`

**B.** `Compile what you already wrote into context your agent can use.`

**C.** `Your brand and taste, compiled for your agent.`

*Note on A, from the reference site.* skilltune's H1 is `Give Your AI Models Proven Skills`,
and Klint's is `Give your agent eyes on social data`. Two independent sites in this category
lead with the same imperative verb, which is evidence for the construction rather than a
reason to avoid it. A differs from both in the second half, where the addressable-market
boundary sits.

Subhead options:

**A (recommended).** `Your agent has never read your brand guide, so it guesses. Paste the
guide, an article, or a repo, and get back rules it can follow.` Architecture Part 3's line
with `actually` cut.

**B.** `Paste an article, a brand guide, a SKILL.md, or a repo. Tastefield compiles it into
rules your agent can follow.` Names the accepted sources in the sentence, which does the
generalizing work the reframe needs. Longer, and it reads as a feature list.

**C.** `You wrote the rules down once. Tastefield turns them into something your agent can
read and be graded against.` Warmest of the three. `graded against` leans on the
verification claim that now lives on page VI, so it needs a check before use.

*Recommendation: A.* It describes the reader's desk, which is the copy mechanic already
adopted, and it names the failure state in the first clause.

### 3. The trust line and the CTAs

**A conflict to resolve first.** Architecture Part 3 specifies the trust line as `Local run.
No account. Nothing leaves your machine.` Three tiny sentences in a drumbeat is the staccato
pattern banned in `FORBIDDEN.md`, and it is the same pattern already rewritten for the
install page in Part 5. Flagging it rather than shipping it, since the three facts are the
strongest thing this page can say.

**A (recommended).** Render the three facts as labelled chips under the input: `Local run`,
`No account`, `No telemetry`. The ban is on prose in a drumbeat. Three labels in a chip row
are interface, not a chant, and the row doubles as the status strip the shell already needs.

**B.** One sentence: `It runs on your machine, no account is needed, and nothing is sent
anywhere.` Compliant and plain. It reads as a concession rather than a promise.

**C.** Two sentences with different shapes: `The run happens on your machine. No account is
needed and nothing is sent anywhere.` Keeps some of the original rhythm without the
drumbeat.

*Recommendation: A, with B as the accessible-text version behind it.* If the chip reading is
judged a loophole, take C.

CTA options:

**A (recommended).** `Compose from a source` primary, `Start from a role` secondary.

**B.** `Paste a source` primary, `Find your playbook` secondary. Plainer, and it loses the role
entry that page II now leads with.

**C.** `Compile my rules` primary, `Start from a role` secondary. First person, which is
warmer and slightly harder to read as a product verb.

### 4. The Composer input

**A (recommended).** One input, full width, with source-type chips underneath it. One box
accepting six kinds of thing is the reframe stated as interface.

**B.** Tabs across the input, one per source type, borrowing Klint's hero tabs. It makes the
visitor choose a lane before they know what any lane returns, and it argues narrowness six
times instead of breadth once.

**C.** A split input: paste on the left, drop a file on the right. Honest about file sources,
and it costs the fold's centre of gravity.

*Recommendation: A.* Klint's tabs are worth borrowing, and section 9 is the better place to
spend them. Tabs on the input ask a question. Tabs on the result show several faces of one
answer.

### 5. The source chips and the seeded example

Nothing starts blank. The Little Plains warning already recorded is that a blank input asks
visitors to know what they want before they have seen anything.

**A (recommended).** Seed the input with a pasted brand-guide excerpt, three or four
sentences of real voice guidance. Two arguments for it. Pasted text is not blocked on the
open live-URL question, so it is runnable today, unlike an article URL. And it demonstrates
the copy half of the audience the reframe just widened toward, which no other artifact on the
page currently does.

**B.** Seed a repo URL. Strongest engineering readiness, since repo scanning is built and
tested. It also narrows the fold back to the design-system owner the reframe moved away
from, one screen after the H1 promised otherwise.

**C.** Seed a `SKILL.md`. Meets the market where its vocabulary already is, and it is the
narrowest of the three audiences.

*Recommendation: A.* Chips in order of what actually works today: `Brand guide`, `Article`,
`SKILL.md`, `Code`, `Repo`, `Transcript`. Badge `Live site` as `Soon` rather than omitting
it, since the open question is real and a badge is the honest form of a gap.

### 6. The idle state, and the copy twin the Specimen Wall has been missing

This is the fifth consequence of the audience decision, and it lands here rather than
anywhere else on the site. The wall as specced renders visual primitives. A visitor who
pastes a brand guide gets voice restraints, and the wall has nothing to show them.

**A (recommended).** One wall, two kinds of specimen. Keep the five visual primitives
(pricing card, settings form, data table, alert modal, nav) and add five copy specimens: a
push notification, an empty-state message, an error message, a button label, and a product
headline. All ten snap at once when a run lands. The reasoning that made the wall work in the
first place carries over without change: unrelated primitives have no structural reason to
look coordinated, and a sentence is another unrelated primitive. The before state carries
copy callouts drawn from the tier-1 copy checks already named in the eval design: a banned
phrase, a claim shipped without its disclosure, reading level out of range.

**B.** Two walls, switched by the active source chip. Visual for code and repos, copy for
guides, articles, and transcripts. Honest per source, and it makes the page argue narrowness
twice rather than breadth once.

**C.** Copy specimens first, visual second. Follows the domain build order the audience
decision implies. It also spends the fold on the half that is not built and demotes the half
that is.

*Recommendation: A.* One honest dependency to name rather than bury: the copy specimen's
before and after needs real voice restraints, and Copy is the next domain rather than a built
one. Until it exists, the copy specimens on this wall are authored for the page, which is the
same kind of debt as the unrun two-arm benchmark. Write it in the status page rather than
letting it pass as shipped.

### 7. The restraint card

**A (as decided in the architecture doc).** Five fields visible, rendered as working product
UI with `Keep` and `Drop` actions. Trigger, Decision, Reason, Evidence, Trade-off.

**B.** Progressive disclosure. Decision and Evidence visible when collapsed, the remaining
three fields on expand. Five fields times six cards is a wall of text on the screen where the
visitor is deciding whether any of this is real.

**C.** Evidence as the largest element on the card, with the quoted source line set at
reading scale and the other four fields as labelled metadata under it. The quote is the
proof, so it gets the type.

*Recommendation: A and B together.* Collapse to two fields, expand to five, keep `Keep` and
`Drop` on the collapsed state. Evidence stays visible when collapsed, which is not a layout
preference: a card that hides its quoted source until you expand it fails the same principle
as a card shipped without one, on the exact screen where the trust argument is being made
without words.

### 8. Where the count goes

Blume's mechanic is evidence with a count, and it is the cheapest credibility on the page.

**A (recommended).** A single line above the card set, generated from the run: `9 restraints
compiled from 1 source. Every one quotes the line it came from.`

**B.** A count per card, showing how many places in the source support that restraint.
Stronger, and it needs source-frequency data the compiler does not produce today.

**C.** No count. The cards are the evidence and a number on top of them is decoration.

*Recommendation: A.* It is a real number from the visitor's own run, which is the only kind
of counter this page is allowed.

### 9. The result tabs

The Klint transfer: one result with several faces, not several sections.

**A.** Four fixed tabs: `Restraints`, `Evidence`, `What your agent sees`, `Violations
caught`.

**B.** Three tabs, holding `Violations caught` back until the check in section 12, so the
page says the word once.

**C.** Tabs generated from what the source actually produced. A pasted article yields no
component contracts, so no contracts tab appears.

*Recommendation: C applied to A's list.* A tab with nothing behind it is the null-never-a-
guess principle failing as interface, and an empty Contracts tab on a pasted brand guide is
exactly that failure. `What your agent sees` stays in every configuration. It is the one view
a competitor's page cannot show, for the same reason the live connection is the real
differentiator: an exported file is a copy, and the connection sits inside the agent's own
tool-use loop.

### 10. The install line

**A.** One line, one copy button, with a small segmented control for Claude Code, Codex, and
Cursor. Codex carries a `Soon` badge until it is tested end to end.

**B (recommended).** Two rows. The human row is the command. The agent row is the copyable
sentence you paste into your own coding agent so it wires itself in. Klint's most distinctive
mechanic, promoted from a backlog file to the page, at the cost of one row.

**C.** The command plus one sentence on the distinction between the two channels: an
exported file is a snapshot of your playbook, and the live connection keeps checking.

*Recommendation: B, with C's sentence folded in underneath it.* The two-audience split is the
cheapest distinctive thing on the page, and the snapshot distinction is the one place where
naming the mechanism is worth a line.

### 11. The four-step walkthrough, and how it fits in three screens

skilltune's grammar, four units instead of five: `01 Paste a source`, `02 Pick a role`,
`03 The Composer fills the gaps`, `04 Install it and check it`. Status chips read `SOURCE`,
`ROLE`, `DRAFT`, `CHECK`.

**A.** Four stacked units, their exact layout: small text column, product panel, ghost
numeral. Faithful, and it adds a fourth screen to a page capped at three.

**B (recommended).** The four steps are the idle state of the result area, and the real
result replaces them in place once a run finishes. Before a run the page explains itself.
After a run the page shows the thing. Same real estate, no fourth screen. This is the
product-doubles-as-the-argument advantage from Part 1, applied to layout rather than to
components: where competitors ship four hand-authored panels describing a flow, this page
ships the flow and lets the description occupy the space until it is no longer needed.

**C.** Compress the four to a horizontal strip of four labelled chips with no product panels,
and let the real result carry every panel on the page.

*Recommendation: B, with C as the fallback.* The risk in B is a visitor who reads the four
steps, runs, and feels that content vanished. The mitigation is a persistent step rail on the
left of the result area, so the steps become a position indicator rather than content that
disappeared.

### 12. The check, as the last act

Verification returns here, at the end, which is the load-bearing move in the Composer
reframe and the reason the reframe's risk is survivable.

**A.** Violation density from running the compiled playbook against a locked task set, reported
for this run.

**B (recommended for the number).** The differential: the same task set with the playbook and
without it, reporting the delta. This is the only shape that satisfies non-negotiable #3,
because a measured reduction survives someone re-running it.

**C (recommended for the task).** An adversarial task, built from the restraints just
compiled. A checkout button for a brand whose guide forbids red. A promotion for a brand that
bans the word `guaranteed`. Surviving temptation is stronger evidence than passing neutral
work, and it makes a better demo than either alternative.

*Recommendation: B's number on C's task.* Two constraints to hold. No pre-baked figure
appears here until the real two-arm benchmark runs, so until then the panel reports the
visitor's own run and nothing else. And the panel is the last thing on the page, ahead of any
download action, which is the second mitigation for the advisory-lookalike risk.

Per-harness density is the fourth axis nobody else runs, and it belongs here rather than in
Studio if it is cheap: the same playbook, three harnesses, one number each.

### 13. The machine row

**A (recommended).** One row at the foot of the install module, addressed to the machine, with
the fetch line and a visible split between doing it yourself and letting your agent do it.
Costs no screen.

**B.** Its own section with the `.md`, `/llms.txt`, and `site-skill.md` surfaces listed.
Better for the machine audience, and it spends a screen the page does not have.

**C.** Footer only. Cheapest, and it loses the part that makes the mechanic distinctive,
which is that a human sees the page speak to a machine.

### 14. The close

**A.** skilltune's artifact close: your compiled playbook's filename with its rule count and a
badge, over one action.

**B (recommended).** End on the density panel. No closing section, no download button, no
signup. The last thing a visitor sees is the measured result, which is the thing nobody else
in the competitive set can show.

**C.** A link row to `/verified` and `/proof` for the visitor who wants the argument rather
than the artifact.

*Recommendation: B, using A's artifact as the visual inside the panel.* C's links belong in
the shell, which already carries the page index.

### Logo strip

**A (recommended).** Claude Code, Codex, Cursor, directly under the fold, functioning as the
export row rather than as a trust badge. Pick a target, get the artifact.

**B.** No strip. The install line already names the clients.

**C.** The strip with the wider set greyed and badged `Soon`. Honest, and it draws the eye to
what does not work yet on the first screen.

### Meta

Title: `Tastefield: compile what you already wrote into context for your AI agent`

Description: `Paste an article, a brand guide, a SKILL.md, or a repo. Get rules your agent
can follow. Runs locally, with no account.`

---

## Notes

Open items this outline creates or sharpens, none of them decided here.

1. **The copy twin is a page artifact before it is a product surface.** Section 6 option A
   closes the fifth consequence of the audience decision on the marketing page, and the
   voice restraints it renders are authored rather than compiled until the Copy domain
   ships. Same class of debt as the unrun benchmark, so it belongs on `/status` with a badge
   rather than passing as shipped.

2. **The trust line conflicts with the staccato ban.** Section 3 flags it and offers three
   resolutions. The chip reading is a judgment call about whether the ban covers interface
   labels, and that judgment should be written into `FORBIDDEN.md` either way, since the
   same question will return on every status strip in the product.

3. **The live-URL question shapes the fold.** Section 5 routes around it by seeding pasted
   text rather than an article URL. That keeps the fold honest without waiting on the open
   scan question, and it means `Live site` needs a `Soon` badge on the chip row.

4. **The screen budget is what section 11 is really deciding.** Option B is the only one of
   the three that keeps the page at three screens while keeping skilltune's grammar. If B is
   rejected, the four-step module comes off the page rather than the cap moving.

5. **The density panel's number is blocked.** The two-arm benchmark listed under What is NOT
   done gates any figure here. The visitor's own run is not blocked, which is why the page
   can ship before the benchmark does.

6. **Build order for the page.** Fold, Composer, source chips, and the visual idle state
   first, since all four exist in some form. Restraint cards second, since they are the
   payoff and the largest unforced omission on the current site. Result tabs and the install
   rows third. The copy specimens and the density panel last, because each one waits on
   something real.
