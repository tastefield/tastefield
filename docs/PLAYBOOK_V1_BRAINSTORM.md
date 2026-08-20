# Playbook v1 brainstorm: paste a source, get a sellable chain (2026-08-20)

The ask: "paste a source and get rules" is too small. The Composer should return a
**playbook**, a set of chained skills, and creators should be able to sell playbooks on the
marketplace as the v1 product. Reference for the business shape is
`thevibemarketer.com/skills`, already analyzed in `docs/PRODUCTIZATION_BRAINSTORM.md`.

Status: brainstorm, with three decisions taken on 2026-08-20 and recorded in section 0. No
blueprint edits made yet. Section 0 names the ones that belong there.

---

## 0. Decided 2026-08-20

1. **Playbook replaces recipe in all public copy.** `recipe` survives as the internal word:
   the data model, the code, `src/registry/`, and the existing ADRs keep it. See section 2 for
   the rename surface and the two boundary cases that need a call.
2. **Publish moves into v1, the Arena does not.** An unlisted share link plus an explicit
   Free or Paid price field ship in the first slice. Ranking, bounties, Bradley-Terry voting,
   and the curated gallery stay at funding-order step 4.
3. **The first sellable playbook is a Stage 0 interview compiled behind a pasted-`SKILL.md`
   front door.** Both halves, in that relationship: the paste path is the on-ramp and is
   buildable today, the interview content is the paid flagship and is gated on interviews
   happening. See section 10.

Two of these are blueprint-level and should be written into `TASTEFIELD_BLUEPRINT.md` rather
than left in a brainstorm file: the vocabulary replacement contradicts the "you author skills,
you publish a recipe" line in Studio, and the Publish-in-v1 call amends the funding order under
Competitive-pressure reprioritization.

**The useful surprise, stated first.** Almost every part of this already exists as a recorded
decision, in four sections that were never assembled into one product: `runs:` metadata and
the verified chain (Vision, Remy chaining), role recipes with job-to-be-done variants (Public
registry, 2026-08-20), the Free/Paid gating split (same section), and the eval panel's three
tiers plus the locked task set (Studio). This document assembles them and names the four
places where assembly creates a real, new decision rather than a build task.

---

## 1. The reframe in one line

The unit of value moves from a rule list to a **runnable, checkable, sellable chain**. The
verb does not move. Tastefield still compiles what already exists, and the Composer still
needs a source.

| Today's spec | This proposal |
|--------------|---------------|
| Paste a source, get restraints with evidence | Paste a source, get an ordered chain of skills, each stage carrying its own restraints and its own checkable rules |
| The payoff is a card set | The payoff is an artifact you can install, run, verify, and list for sale |
| The marketplace is funding-order step 4 | Publishing is in v1, because authoring and selling are the same gesture |

## 2. Vocabulary, decided: playbook replaces recipe in public copy

The blueprint locks a distinction that three separate decisions depend on: **you author
skills, you publish a recipe.** The decision keeps the first half and retires the second half
from public view. A buyer buys a playbook. The compiler, the registry code, and the ADRs keep
compiling recipes.

The line to write into the blueprint, replacing the old one: **you author skills, you publish
a playbook, and `recipe` is what the code calls it.**

**Why this is more than a find and replace.** The old distinction was load-bearing because it
kept the *shipping unit* separate from the *editing unit*. That job still needs doing, so the
replacement has to carry it: a skill is still the editing unit, and a playbook is still a
bundle of skills plus restraints plus checkable rules. If "playbook" starts meaning "a skill,
but bigger," the distinction is gone and three dependent decisions go with it.

**Rename surface, in rough order of cost.**

| Surface | Call |
|---------|------|
| Marketing site, all pages and copy | Playbook. Straight replacement. |
| Registry routes, `/recipes` and `/recipes/[slug]` | `/playbooks`, with redirects from the old paths |
| Studio UI labels, Draft and Publish flows | Playbook |
| `src/registry/`, `src/compile/`, types, tests | Keep `recipe`. No churn for no gain. |
| `TASTEFIELD_BLUEPRINT.md`, `CLAUDE.md`, planning docs | Keep `recipe`, with one new line explaining the public alias. They are a dated record, not live copy. |

**A correction to the productization brainstorm while renaming.** That file lists "nineteen ADRs"
among the reasoning Tastefield has already written. This repo has no ADR directory, and the
nineteen ADRs in the Machinekind workspace contain zero occurrences of `recipe`. Nothing about
the rename depends on them, and the option G claim that they are publishable material needs a
different source before it is used.

**Two boundary cases that are user-facing and also code.** Both need a call before the rename
lands anywhere.

1. **`npx @tastefield/mcp --recipe=X`.** Cheapest resolution is to add `--playbook` as an
   alias and keep `--recipe` working forever. A published install line is the worst possible
   thing to break, and an alias costs one line.
2. **The share link path, `tastefield.sh/p/<id>`.** Already neutral, since `p` reads as either.
   No change needed, which is luck rather than foresight.

### Cost and benefit, checked against six alternatives (2026-08-20)

Run after the decision rather than before it, which is the wrong order, so it was run as a
falsification attempt. The decision survived. Full matrix in the `naming-analysis` canvas.

**The cost is 17 lines and it only goes up.** Counted rather than estimated: 329 occurrences of
`recipe` across 37 files, of which 312 sit in code, tests, and internal planning docs that the
decision keeps. The public surface is 17 lines of copy across five files, no registry routes
built yet, and one install flag to alias. The registry is not started and the site is a
proposal, so the rename is at its structural minimum today and gets more expensive once install
lines are in the wild and search equity accrues. Whichever word wins, deciding now is right.

**Three alternatives are disqualified by decisions already on record, not by taste.**

- **`pack`.** The one-line contrast FAQ is titled "How is this different from a skill pack or a
  taste profile?" Naming the product the thing the positioning differentiates from is not
  available. Also occupied twice, by skills.sh Packs and Vercel Packs.
- **`kit`.** Already load-bearing on the other side of the price boundary: the kit is the
  snapshot, the connection is enforcement that keeps running. Reusing it collapses the
  distinction that justifies the recurring half.
- **`bundle`.** An unordered set, which denies the ordered gated chain that is the only
  differentiator. It also carries discount framing, where the parts are the value and the buyer
  is getting volume, which is the opposite of a narrow job with pricing power.

**`SkillStack` is rejected after a direct market check on 2026-08-20.** The exact name is
already used by a Claude Code plugin marketplace with 59 expert skills across development,
DevOps, design, strategy, research, context engineering, and agent architecture. This is not
an adjacent education product or a weak search collision. It is the same product category,
distributed through the same harness, using the same unit underneath. More decisively, that
marketplace calls its chained, gated products **workflow playbooks**. Its own vocabulary draws
the distinction Tastefield needs: SkillStack is the unordered library; a playbook is the
ordered workflow with gates. Reusing SkillStack would put Tastefield in the declined generic
skills-directory lane and discard the chain differentiator in the noun. Broader collisions
also exist, including a registered SkillStack microcredential platform and a commercial
learning platform, but the Claude Code marketplace is sufficient to reject the name on its
own.

**`runbook` is the interesting near-miss.** It is the best semantic fit of the seven: ordered,
checkpointed, and unambiguously the operator's own procedure rather than supplied content.
Nobody buys one, and it reads as SRE, which is wrong for the creative half of the audience.
Worth keeping as prose in the docs, not as the SKU.

**What the analysis changed about `recipe`.** The rename brief undersold it. A recipe is an
ordered method, so it carries sequence as well as `playbook` does, and the earlier framing that
it does not was wrong. Its real weaknesses are commercial and adjacent: recipes are the
canonical free content of the internet, which makes a price awkward to defend, and Chef recipes
are configuration management, the nearest adjacent category to compiled rules applied to a
system.

**Two costs of `playbook`, both answered by an existing precedent.** A playbook is normally
someone else's plays, so the noun implies Tastefield supplies them, which is the same failure
mode as the locked rejection of "taste engine". And it is the reference competitor's own product
name, which is their ground. The positioning file already resolved the general form of this: the
tagline widened the noun to include taste while holding the verb on the enforcement side, and
widening both at once is named as the earlier failure. So the guardrail is possessive or
verb-attached phrasing, never a bare plural, and the shared noun makes the comparison legible
while the differentiator moves into the adjective slot.

**One unpriced benefit.** An Ansible playbook is already a file of ordered tasks run against
real systems, with a check mode. For the engineer half, the mental model transfers for free, and
that is worth more than the search-term loss to Ansible and sales playbooks. Neither `recipe`
nor `playbook` has search headroom, so search is not a tiebreaker.

### Recommendation

Keep the decision. Move to `playbook` in public copy, hold `recipe` in the code, and attach
three guardrails that cost nothing now and prevent the two predictable failures.

1. Never a bare plural in copy. Write "your playbook" or attach the verb, never "Tastefield
   playbooks" as a content library, which is the supplied-methodology reading.
2. Alias the install flag rather than moving it. Add `--playbook` and keep `--recipe` working
   permanently. One line of code against a broken published command.
3. Restate the unit distinction in the blueprint on the same day. You author skills, you
   publish a playbook, and `recipe` is what the code calls it. Without that line, playbook
   drifts into meaning "a big skill" and three dependent decisions go with it.

**The one thing that would change this answer.** If the chain ever stops being the
differentiator, the ranking inverts. `playbook` is worth its costs because it carries sequence
and sells at a price. If the product ends up shipping single-stage compiled rules with no
gate, `recipe` was right and the rename buys nothing.

## 3. The one mechanic that makes a sellable chain defensible

**Everything else in this landscape sells advisory sequencing.** The blueprint already
established this precisely: an orchestrator `SKILL.md` names other skills and asks the agent
to run them in order, and nothing enforces the sequence, the handoff, or a skipped step. The
Vibe Marketer's own architecture doc concedes it twice, and those two sentences are the whole
opening: `No programmatic enforcement of the Context Matrix. The AI must follow instructions.`
And: `No automated behavior testing. The E2E test validates file structure and installation,
not whether skills actually produce good output.`

So the product is not "chained skills." Chained skills are a zip file the incumbent already
sells better, with 15,310 lines of methodology behind it. The product is **a chain that stops
itself**:

1. A playbook declares an ordered `runs:` list of independently fetchable sub-recipes.
2. Stage N's output is checked against **stage N's own** compiled rules.
3. Stage N+1's context is not served over MCP until stage N passes.
4. The Studio graph is a live pass, fail, or pending board over that one chain.

Point 3 is the entire differentiator, and it is one sentence a buyer understands: the
instructions did not say "do Copy then Visual," the Visual stage genuinely cannot start until
Copy passed. Nobody surveyed verifies between stages.

**A cheap borrow that makes it real.** They ship 6 JSON Schema contracts (draft 2020-12)
governing what passes between skills, and concede there is no programmatic enforcement.
Take the typed handoff, attach the gate to it, and the same artifact becomes enforcement
rather than a request. Their schema plus Tastefield's checker is a working runtime.

## 4. How a pasted source becomes a chain, without inventing an orchestrator

The obvious objection to "paste a source, get a playbook" is that a brand guide does not
contain a workflow. Correct, and the answer is already in the registry taxonomy.

**The job-to-be-done variant is the chain template. The source is the fill.**

A visitor picks a job, the template supplies the stages and their order, and the Composer
fills each stage's restraints from the pasted source. `creative-director/audit-a-campaign` is
already specced as "a `runs:` chain over existing assets." That is a template with empty
slots waiting for a source.

| Paste | Pick | Get |
|-------|------|-----|
| A brand guide | Ship a landing page | Voice restraints, then copy stages, then a visual stage, each gated on the last |
| A repo | Add a feature on-brand | Token and contract restraints, then component stages |
| A podcast transcript | Publish an episode | Show-notes voice, titling, cover-art tokens, per the existing Phase A scope |
| A `SKILL.md` you already bought | Make it checkable | The same skill, with rules and a task set attached |

Two properties worth noticing. Authoring a new playbook is a remix of an existing template,
which is the supply pump the blueprint already identified, and the template set is a finite,
curated thing, which keeps non-negotiable #4 intact. Nobody generates a chain from a prompt.

## 5. What ships inside a playbook, seven parts

This is the SKU manifest, and every line already exists in some form.

1. **Brand memory, extracted rather than interviewed.** `.tastefield/` against their
   `./brand/`. Their version asks two questions and lets the model write your voice profile.
   This is the sharpest available contrast and it is the thesis, not a feature.
2. **An ordered chain** of independently fetchable sub-recipes.
3. **Per-stage restraints** in the five-field format, Evidence never optional.
4. **Per-stage checkable rules**, which is what gates the handoff.
5. **A locked task set**, immutable before tuning, shipped inside the kit.
6. **A receipt.** Measured violation density with the playbook and without it, on that task
   set, per harness. Non-negotiable #3 already forces this shape.
7. **Graceful degradation.** The playbook runs with partial brand memory and says which parts
   loaded. Their three tiers, which the blueprint has as an open gap.

## 6. The marketplace in v1, and how it avoids being a graveyard

Taskmarket is the recorded cautionary evidence: 19.5K registered agents, listings at zero
bids. A creator marketplace shipped before there is anything to sell reproduces that, and
selling attention against an empty catalog is already ruled out for the sponsor slot.

Four mechanics, three of them already decided elsewhere, that make a v1 marketplace survivable.

**The unlisted share link is the default publish path.** `npx skills add
https://tastefield.sh/p/<id>` already exists as a decision. Publishing means getting a link,
not appearing in a gallery. There is no empty gallery to look at, and the curated feature
surface stays small and human-picked, which is non-negotiable #4 held exactly as written.
Open to author, open to share, curated to feature.

**The listing is the receipt, which is the conversion mechanic nobody else can copy.** The
gating rule already decided says the human-browsable half of a recipe page is always public
and the agent-fetchable half is what a price gates. Extend it by one item: the locked task set
and the measured delta are part of the public half. A buyer runs the playbook's own test on
their own machine and sees the number **before** paying, then pays for the compiled content.
Every competitor in this landscape asks for $199 against a testimonial and a self-reported
revenue figure.

**Rank on measurement, not votes.** The Arena's dual leaderboard, Compliance alongside Taste,
arrives one surface earlier as the marketplace's own sort order. Density delta and per-harness
portability are objective and reproducible. The crowd vote stays labelled and never merges
into the same number.

**Price the stages, not just the bundle.** Sub-recipes are already independently fetchable,
and the blueprint already says a full-role bundle is a `runs:` chain over individual jobs. So
the first stage is the natural free trial, the bundle is the natural upsell, and neither needs
a new pricing mechanism.

**Kit versus connection is the price boundary**, unchanged from the productization brainstorm.
A playbook sold as a zip is a snapshot, one time, updates included. The live connection is the
only channel where the gate keeps running after the sale, which is the recurring half.

## 7. Five tensions that already have recorded resolutions, apply rather than rediscover

1. **Selling implies a server, non-negotiable #1 says local-only.** Resolution already
   written for the Hosted Recipe API: split read from write. Anonymous run, local scan, and
   export send nothing. Purchase, publish, and save are the authenticated half, and what
   lands on the server is only what a human deliberately published.
2. **Open authoring versus curation is not automatic.** The public submission-review gate
   already covers it: the checker screens every submission, only compliant-but-judgment-worthy
   work reaches a human queue.
3. **Trivial forks flooding the catalog.** The materiality test already exists: a variant must
   differ by a different restraint set, a different `runs:` chain, or a measurably different
   density. A renamed caption is not a variant.
4. **A playbook whose stages cannot be checked is advisory again.** The tier-1 copy checks are
   the boundary already drawn: banned phrases, missing disclosures, forbidden claims, reading
   level. "Does this feel on-brand" is tier 3, labelled, never the headline, and the locked
   judged-skill callout from 2026-08-20 is the exact wording.
5. **Depth as the differentiator.** Do not answer 15,310 lines of methodology with 20,000.
   Their own trade-off section says the depth costs context window.

## 8. Three tensions that are genuinely unresolved, and this proposal makes each urgent

1. **Fork attribution and revenue split.** Already flagged 2026-08-20 as undecided, with the
   note that it gets decided badly at the first real fork. Making remix the primary authoring
   path and publishing a v1 feature moves the first real fork to week one. This is now a
   blocking decision, not a deferred one.
2. **Provenance of a source you do not own.** Selling a playbook compiled from someone else's
   brand guide, article, or transcript is a different act than compiling it for private use.
   The consent guardrails currently sit on the video and transcript lane only. Proposed rule,
   cheap because the mechanism already exists: a playbook may be listed only if its sources
   are owned by the seller or public and credited, and the Evidence field on every restraint
   already quotes its source line, which makes the whole listing auditable by construction.
   The guest-recipe label is where a deliberately borrowed taste belongs.
3. **Marketplace in v1, resolved on 2026-08-20 by moving Publish alone.** The recorded order
   is catalog and checker, then Studio shell and editor and eval and Publish, then role
   content, then the Arena. Decided: an unlisted share link plus an explicit Free or Paid
   price field come forward into the first slice, and the Arena keeps everything else. What
   this protects is the reason the order existed. Ranking, bounties, and a browsable gallery
   are the parts that need a full catalog to not look empty; a share link and a price field
   work with one playbook in existence. What it still costs is real and should be watched: the
   authenticated write half arrives earlier than the Hosted Recipe API question expected, so
   the read-write split in tension 1 above stops being a future scoping note and becomes a v1
   requirement.

## 9. What must not ship, in one list

- An orchestrator skill that only asks the agent to run stages in order. Already declined as
  the weak advisory chain, and it is the whole product if the gate is missing.
- A prompt box that generates a playbook from a description. Still the declined lane.
- Auto-published playbooks from a paste. Non-negotiable #4, and the same BibiGPT declination.
- A headline number before the real two-arm benchmark runs. Non-negotiable #3.
- A browsable top-level skills directory around all this. Declined three times.
- An LLM-judged score as the sort order of the marketplace.

## 10. Two candidate v1 slices, thinnest first

**Slice 1, the on-ramp, buildable now.** The pasted-`SKILL.md` path, which was decided as half
of the first SKU because it is the only entry point that needs nothing unbuilt. Bring a skill
or a pack you already bought, get back the same skill with restraints, per-stage rules, a
locked task set, and a checker attached. Two stages, one gate between them, one receipt, an
install line, an unlisted share link, a price field, no gallery.

Why this half goes first, beyond readiness. It converts the incumbent's customer instead of
arguing with them: someone who already paid $199 for methodology in markdown has already
agreed with the premise, and the pitch is that their purchase becomes checkable. It also means
the first playbook a stranger sees was compiled from a source they chose, which is a stronger
demo than one compiled from ours.

**Slice 2, the paid flagship.** The Stage 0 creative-director playbook, which is the other
half of the decided first SKU and the one with genuine pricing power. Gated on interviews
happening rather than on engineering, so it runs in parallel with slice 1 rather than after it.
The blueprint's own reasoning applies unchanged: real-company-sourced and Stage-0-sourced
content is the natural Paid lane, and a generic pack is the natural Free lane competing against
60,000 free alternatives.

**Slice 3, adds the market.** Three to five chain templates across two roles, the public task
set and receipt on every listing, measured sort order, stage-level pricing with a free first
stage.

The dependency worth naming: the gate needs the checker per stage, which is built, and the
receipt needs the two-arm benchmark, which is not. Slice 1 can ship with the buyer's own run as
the only number, exactly as the homepage does.

**Machinekind, deliberately not the first SKU.** It was the third option and it lost, which is
worth recording because the blueprint currently calls it the most honest first SKU. The
argument against it is sequencing rather than merit: a Machinekind playbook demos Tastefield's
own taste, and both chosen halves demo the buyer's. It stays the dogfood and the case study.

## 11. Copy consequence, since the homepage was just drafted

The current fold promises rules. A playbook is a bigger and more concrete promise, and the
recommended H1 stops being accurate. Three directions, not drafted copy:

- Keep the compile verb, widen the noun: give your agent the playbook you already wrote down.
- Lead on the gate, which is the only line a competitor cannot write: the stage does not start
  until the last one passes.
- Lead on the sellable artifact, for the creator audience rather than the buyer.

Whichever wins, `FORBIDDEN.md` bans the antithesis turn, so "not advisory, enforced" stays out
of the fold no matter how tempting the contrast is.

## 12. Open questions this creates

1. Does a playbook span roles, or is it always inside one role? The rename did not answer
   this, it only removed the word that used to imply an answer. Role is still the folder and
   the variant is still the SKU, so the default is inside one role until something needs
   otherwise.
2. Who authors chain templates? A finite curated set keeps #4 intact. Letting sellers author
   templates is a second, larger marketplace.
3. What does "updates included" mean when a playbook tracks a moving source? The source digest
   drift check is the mechanism, and the promise still needs wording.
4. Does the free first stage cannibalize the bundle, or qualify the buyer? Testable, and worth
   a real answer before pricing goes on a page.
5. Is the first sellable playbook compiled from Machinekind, or from a Stage 0 interview? The
   dogfood is the more honest first SKU, and the interview is the more valuable one.
