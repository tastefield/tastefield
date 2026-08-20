# Productization brainstorm: what the Vibe Marketing Playbook is actually selling (2026-08-20)

The site is `thevibemarketer.com`. Three surfaces: the free interactive playbook
(`/vibe-marketing-playbook-v2.html`), the member version of the same page, and the paid
`/skills` page. A third-party architecture writeup of v2.1 is published on `neura.market`
and is more detailed than anything on their own site.

Status: brainstorm. Nothing decided, no blueprint edits made.

**First, a correction to file.** The blueprint's Competitive landscape entry is dated
2026-08-15 and describes v1: 10 skills, $199, Brand Memory. The shipped product is v2.1 and
is materially more than that entry says. The entry's conclusion still holds, but the reasons
have changed enough that the entry should be refreshed rather than left as the record.

---

## 1. What they actually ship, by the numbers

| Fact | Value |
|------|-------|
| Price | $199 one time, updates included, no subscription |
| Community bundle | $297.50 (community plus the pack at 50 percent off) |
| Skills | 11, average 1,392 lines of `SKILL.md` |
| Total system | 134 files, 15,310 lines of `SKILL.md`, roughly 32,000 lines including references and modes |
| Distributable | One zip, 45 files, 417KB |
| Install | `install.sh`, auto-detects Claude Code, Codex, and Copilot CLI |
| Health check | `doctor.sh`, 29 checks across 7 groups |
| Install test | `e2e-fresh-install.sh`, 40 assertions against a 36-file manifest |
| Data contracts | 6 JSON Schema files (draft 2020-12) |
| Shared state | `./brand/`, 7 profile files plus 2 append-only files |
| Runtime dependencies | None, except Replicate for the creative engine |
| Server | None. No account, no auth, no telemetry. |

**The whole product is a directory and a shell script.** There is no backend. Margin is
effectively the payment processor's cut, and the support surface is an installer.

## 2. Why it sells, mechanic by mechanic

Nine mechanics, each with the Tastefield analog and an honest note on whether Tastefield
already has it. The ones marked **have it, not selling it** are the cheapest wins in this
document.

| Their mechanic | What it does | Tastefield analog |
|----------------|--------------|-------------------|
| The free playbook page is the product demo | A 969-line methodology document that is genuinely useful on its own, and every section ends pointing at the pack | The marketing site plus the ADRs and the dated decision log already proposed for page X. **Have the content, not the packaging.** |
| Orchestrator as the only entry point | `/start-here`, two questions, three minutes, then it routes | The Composer. Same job, same shape. **Have it, in spec.** |
| Brand Memory as a directory | `./brand/` persists between sessions, every skill reads and writes it | `.tastefield/`. Theirs is interviewed from two questions. Tastefield's is extracted from real shipped code. **Have it, and stronger.** |
| The Context Matrix | A table stating exactly what each skill receives and what is withheld | Non-negotiable #7, progressive disclosure. Independently arrived at, and Tastefield's is enforced by an MCP server rather than requested in prose. |
| Graceful degradation, three tiers | No brand directory, partial, full. No skill ever errors on a missing file | Nothing specified. **Gap, and cheap to close.** |
| Progressive enhancement ladder, Level 0 to 5 | Each level of accumulated context adds quality, no level is required | Nothing specified. This is a pricing and onboarding ladder drawn as an architecture diagram. **Gap, and it is the single most portable idea on their site.** |
| Seven named workflows | Natural-language triggers that chain skills, with a confirmation step for anything 3 steps or longer | Role recipes, plus the `runs:` field already specced. **Have it, in spec.** |
| Test infrastructure sold as a trust signal | `doctor.sh` and the E2E test are described in the customer-facing architecture doc | 59 passing tests, mentioned nowhere a buyer can see. **Have it, not selling it.** |
| A visual design system for agent output | `output-format.md`, 33KB, terminal-native box drawing, 55-character line width, so every output looks like the same product | Nothing. See option I. |

**The two sentences from their own architecture doc that matter most.** Under design
trade-offs: `No programmatic enforcement of the Context Matrix. The AI must follow
instructions.` And under known gaps: `No automated behavior testing. The E2E test validates
file structure and installation, not whether skills actually produce good output.`

They wrote down the gap. It is the gap `check_compliance` exists to fill, stated more
precisely by the incumbent than by anything in the blueprint's own competitive section.

## 3. The finding worth acting on: the business model is a better fit than the roadmap's

Tastefield's non-negotiables describe this business, not a SaaS. No telemetry. Nothing sent.
Local run. `npx`. No account. Those constraints make hosted subscription revenue structurally
awkward, and the roadmap has been absorbing that awkwardness by pushing value toward a hosted
Studio with accounts, a hosted registry, and eventually an agency workspace.

The Vibe Playbook is evidence that the other shape is a real business. A directory, a price,
an installer, and no infrastructure to run. Tastefield is already closer to a product that
should be sold like a book than to one that should be sold like a seat.

**And the price boundary does not need to be invented, because the architecture already drew
it.** Distribution channel 4 in the blueprint says an exported file is a copy that goes stale
the moment the recipe changes, and a live MCP connection is the only channel where the check
runs after generation. That is a value difference, not a paywall, which makes it the honest
place to put a price:

- **The kit is a snapshot.** One time, updates included, exactly their model. A directory, a
  manifest, an installer, a doctor.
- **The connection is enforcement that keeps running.** Recurring, because it keeps working
  after the sale in a way a zip cannot.

Their own product has no equivalent of the second half, and their known-gaps list says so.

## 4. Nine ways to productize, ranked by strategic fit

### A. Make their product a source, not a competitor

The Composer already accepts a pasted `SKILL.md`. So the highest-fit product is: bring any
skill pack you already bought, get back restraints with evidence, a locked task set, and a
checker. Their eleven skills become an input.

Why this ranks first. It converts the strongest product in the advisory lane into demand for
the verification lane, it needs no new engineering beyond what page I already specs, and it is
the one framing where their $199 purchase makes a Tastefield purchase more likely rather than
less. The buyer has already spent money agreeing that methodology in markdown is worth paying
for.

Cost: the Composer path for a pasted `SKILL.md`, which is day-one accepted already.

### B. Role kits as the SKU

Their SKU is a domain bundle. Tastefield's taxonomy already has the better cut: one kit per
role. `creative-director`, `marketing-director`, `social-media-manager`, `podcast-producer`.
Each kit is compiled recipes, restraints with evidence, a locked task set, and the checker.

The locked task set is the part nobody else ships, and it is what makes a kit testable by the
buyer on their own machine rather than trusted on the strength of a testimonial.

Cost: the registry content problem, which is already funding-order step 1 and already gated on
content rather than engineering.

### C. Ship the receipt inside the zip

Their proof is `$443K in 8 months` and `$369k+`, both self-reported and unfalsifiable. Every
Tastefield kit can ship a one-page receipt: measured violation density with the recipe and
without it, on a locked task set, per harness, with the task set included so the buyer can
re-run it.

This is the most differentiated packaging idea in this document. Nothing in the competitive set
can include one, and it is the same artifact non-negotiable #3 already forces.

Blocked on: the real two-arm benchmark, which is already the blocker for the homepage number.
One build unblocks both.

### D. Steal the progressive enhancement ladder as the pricing ladder

Their Level 0 through Level 5 is presented as architecture and functions as merchandising. It
tells a buyer exactly what each additional piece of context buys, and it never gates.

Tastefield's version writes itself: Level 0 is the compiled rules with no source, Level 1 adds
extracted tokens, Level 2 adds component contracts, Level 3 adds restraints with evidence,
Level 4 adds the locked task set and the density number, Level 5 adds the live connection.
The last level is the recurring one, and the ladder makes the jump legible instead of arbitrary.

Cost: a diagram and a page. This is the cheapest item here.

### E. Sell the tests

They put `doctor.sh` with its 29 checks in customer-facing material. Tastefield has 59 passing
tests and a checker shared by the MCP tool, the CLI, and the benchmark, and none of it appears
anywhere a buyer looks. Ship `npx @tastefield/doctor`, and put the count on the page.

This matters more for a one-time purchase than for a subscription, because a buyer with no
account and no support contract is buying the confidence that it will work on their machine.

Cost: near zero. The checker exists.

### F. Take the agency gap they published

Their known gaps: `No multi-user support. The brand memory system assumes a single brand per
project directory. Agencies managing multiple brands would need separate project directories.`

Phase 3 is already an agency workspace. That is a named, published, dated gap in the incumbent
landing on an already-planned phase, and it is the natural second price tier: one brand, or
many.

Cost: Phase 3, so this is a positioning note for later rather than a near-term build.

### G. The free artifact that does the selling

Their playbook page is the funnel, and it works because it is useful whether or not you buy.
Tastefield already has an unusual amount of this material written: nineteen ADRs, a blueprint
written as dated decisions with reasoning attached, and the page X proposal to publish a
decision log. Nobody in the competitive set publishes their reasoning with dates on it.

The move is not to write a playbook. It is to publish what is already written.

Cost: editing, and a decision about how much of the blueprint is publishable.

### H. Graceful degradation as a shipped guarantee

Their three tiers are a small idea with a large effect: no skill ever errors on a missing
file, and the empty state always names the action. That is the same discipline as the
`empty-states-need-action` voice rule already in the compiler.

Tastefield's version: a recipe with no scanned source still works, a recipe with a partial
source says which parts loaded, and a value that is not in the extracted system is reported as
not in the system rather than guessed. The third one is already Architecture principle 3.

Cost: small, and it makes a one-time purchase supportable without a support team.

### I. Compile the agent's own output format

The most interesting thing on their site is the one nobody would list as a feature. They wrote
a 33KB design system for what their skills' output looks like in a terminal, so every
deliverable looks like the same product.

Tastefield could generate that from the customer's own brand instead of authoring one house
style. The agent's output, formatted like you, not like Claude. It sits precisely on the seam
between the Visual domain and the Copy domain, and it is a product nobody in the landscape has.

Honest caveat: this is a new surface, not a repackaging, and it should not jump the funding
order. Worth recording rather than building.

## 5. What not to copy

- **Their proof.** `$443K in 8 months` is a receipt for their business, not a measurement of
  the product. Non-negotiable #3 forbids the equivalent here, and option C is the replacement.
- **The accumulation pitch.** `Gets smarter the more you use it` is the same advisory shape the
  blueprint has now found in five companies. Tastefield's version of compounding has to be
  corrections becoming checkable restraints, which is a different claim and a testable one.
- **Depth as the differentiator.** Their crown jewel is 1,238 lines plus a 1,636-line
  reference. Competing on methodology volume is competing on their ground, and their own
  trade-off section admits it costs context window.
- **The interview as the extraction method.** Two questions and the model writes your voice
  profile. Tastefield's whole thesis is that the rules already exist and should be compiled
  rather than invented.

## 6. Open questions

1. **Does the kit shape conflict with the registry?** A one-time kit and a browsable public
   registry are not the same business. The registry's install path is `npx`, which is
   compatible, but the pricing model needs one answer rather than two.
2. **What does the one-time price include when a recipe updates?** They say updates included,
   which is cheap for them because a zip has no marginal cost. A compiled recipe that tracks a
   moving repo is a different promise.
3. **Is the kit a Tastefield product or a Machinekind case study first?** Machinekind is the
   live dogfooding proof, and a kit compiled from it is a more honest first SKU than a
   generic one.
4. **Does selling a snapshot undercut the connection argument?** The blueprint says an
   exported file goes stale. Selling one for $199 needs the staleness stated on the box, which
   is the source-digest drift check already specced.
5. **The blueprint entry needs refreshing to v2.1.** Not done here, since this file is a
   brainstorm and that file records decisions.
