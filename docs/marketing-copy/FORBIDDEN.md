# Forbidden patterns (marketing copy)

Load this file before you write or edit user-facing copy. If a draft matches a
pattern here, rewrite it. Then add the new example to this file.

House rules (always):

- ASD-STE100 Simplified Technical English
- Zinsser: simplicity, brevity, clarity, humanity
- Never use em dashes (`—`) or en dashes (`–`) in user-facing copy. Use a period, a comma, or a new sentence.

Do not apply this file to code, rule IDs, or file names.

---

## STE100 (what we actually use)

Write instructions and claims as if a technician must act on them.

- One idea per sentence.
- Keep sentences short. Prefer under 20 words.
- Use active voice. Name the actor.
- Use everyday verbs: use, make, check, add, show, stop, keep.
- Do not stack nouns ("portable taste engine layer").
- Do not use slang, hype, or unmeasured intensifiers (always, never, nobody) unless the product-marketing file already locked that line.
- If a word is not needed, delete it.

## Zinsser

1. **Simplicity.** Say the thing. Do not decorate it.
2. **Brevity.** Cut the second sentence if the first already did the job.
3. **Clarity.** A stranger must get the point on first read. No puzzles.
4. **Humanity.** Write to one person at a desk, not to a category.

---

## Banned rhetoric

### Em dashes

Ban: `—` and `–` in user-facing copy.

Caught:

- "so it guesses — default blue"
- "so it guesses — a hex that isn't in your palette"
- "Next — on the horizon"

Use a period. Or a comma. Or a new sentence.

### Staccato pairs

Ban: two or more tiny sentences in a drumbeat, same length, same shape, used for punch.

Caught:

- "It compiled. It rendered. It passed review. It was wrong."
- "Encode your brand with taste. / Take it into Cursor, Claude Code, and Windsurf." (two poster lines as a pair)

Write one clear sentence. Or two sentences that are not a chant.

### Antithesis reframe / negative parallelism

Ban: "not X, Y" / "X. Not Y." / "alongside A. Replaces none of them." as the clever turn.

Caught:

- "That's the failure: not broken code. Generic UI that passes a glance."
- "Works alongside Figma, zeroheight and Storybook. Replaces none of them."
- "Coexistence, not replacement" as a section eyebrow or slogan (section 06 review, 2026-08-17). Positioning can stay locked in product-marketing docs; user-facing copy should say what happens (tools stay, Tastefield reads in) without the "not X" turn.
- "Figma is where your team decides. Tastefield is where the agent complies." (section 06 plan recommended; isocolon pair)

Say what happens. Do not win the point by naming the opposite.

Note: the product thesis ("advisory vs enforcement") lives in `.agents/product-marketing.md`. Do not keep restating it as a not-X-but-Y couplet in every section.

### Isocolon metaphor-pairs

Ban: matched clauses with the same rhythm and a swapped noun, used as poetry.

Caught:

- "Your colors live in a stylesheet. Your brand rules live in a PDF."
- "Your design system lives in Figma. — Your agent has never opened it." (and the rest of the null-answer stack)

If two facts belong together, join them in plain prose. Do not typeset a litany.

### Backward-references

Ban: "that's the…", "this is why", "neither", "anyway" as the punch that points at the last paragraph.

Caught:

- "That's the failure: …"
- "It ships anyway."
- "Neither is in the room when Cursor writes a component."
- "That is the miss."

Repeat the noun. Do not point backward and hope the reader still holds the image.

---

## Also ban (add here when spotted)

- Fake-specific counts used as atmosphere (`200 components`).
- Puzzle copy: hex codes, class names, and variant counts in the hero/problem prose. Put those in the demo, not in the sentence.
- `taste engine`, `design system intelligence`, first-prompt quality guarantees (see product-marketing rejects).
- Present-tense "every AI tool" / "everywhere your brand goes" when the shipped clients are Claude Code, Codex, and Cursor (trio updated 2026-08-17, Windsurf dropped).
- ChatGPT and Lovable as current destinations. Badge `Soon` if you name them.
- Staccato hero pair: "Encode your brand with taste. Take it with you into every AI tool."
- "portable taste engine that can plug into…" (noun stack + unshipped list).

Caught (section 01 review, 2026-08-17):

- "Tastefield is a portable taste engine that can plug into Claude, Cursor, ChatGPT, Lovable, everywhere your brand goes."
- Do not put MCP tool names (`check_compliance`, `get_brand_standards`) in user-facing marketing copy. Say what the person sees: it flags work that is still off-brand.

---

## How to add a pattern

When you catch slop:

1. Name the pattern in one line.
2. Paste the offending phrase under **Caught**.
3. Write the rewrite rule in one line.
4. Fix the draft in the same turn.
