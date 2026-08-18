import { Fragment } from "react";

import { Card, Footer, MaskLines, Nav, Reveal, Section } from "@/components/site";
import { GlyphVeil, PhiMarks } from "@/components/plate";
import { TasteSampler } from "@/components/TasteSampler";
import { ViolationWipe } from "@/components/ViolationWipe";

const PIPELINE = [
  {
    step: "01",
    name: "Scan",
    body: "Reads the design system already in your repo: CSS custom properties, Tailwind theme, cva variant contracts. Your config is parsed, never executed.",
  },
  {
    step: "02",
    name: "Compile",
    body: "Turns what it found into rules that carry a checkable pattern, written to .tastefield/ where you can read and edit them.",
  },
  {
    step: "03",
    name: "Serve",
    body: "A local MCP server hands the agent only the slice it asked for, this component's contract or these tokens, at the moment it writes code.",
  },
  {
    step: "04",
    name: "Check",
    body: "The same checker runs against generated code, so the rule that was served is the rule that gets enforced.",
  },
];

const TOOLS = [
  {
    title: "Brand standards",
    name: "get_brand_standards",
    body: "Voice, restraints, and the things the product is not allowed to say.",
  },
  {
    title: "Component contract",
    name: "get_component_contract",
    body: "The real props and variants of one component, so the agent stops inventing them.",
  },
  {
    title: "Design tokens",
    name: "get_design_tokens",
    body: "Your actual scale for color, spacing, radius, and type, instead of a plausible guess.",
  },
  {
    title: "Compliance check",
    name: "check_compliance",
    body: "Verifies generated code against the compiled rules before it reaches your diff.",
  },
];

const SOURCES = [
  { name: "Local repo", note: "Already on disk", ready: true },
  { name: "GitHub", note: "Same parsing, remote", ready: true },
  { name: "Figma", note: "Files & Variables API", ready: false },
  { name: "zeroheight", note: "Published styleguide", ready: false },
  { name: "Storybook", note: "On the connect list", ready: false },
  { name: "Supernova", note: "On the connect list", ready: false },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top" className="flex-1">
        {/* Hero. Pulled up so the nav floats over the dusk plate rather than above it. */}
        <section className="plate-dusk relative -mt-16 overflow-hidden">
          <div className="horizon pointer-events-none absolute inset-0" />
          <GlyphVeil />
          <PhiMarks />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center px-5 pt-[calc(var(--s6)+4rem)] pb-[var(--s6)] sm:min-h-[92vh]">
            <MaskLines
              className="display display-sans display-1 max-w-[21ch]"
              lines={[
                <Fragment key="line-1">
                  The brand and <em>taste</em>
                </Fragment>,
                <Fragment key="line-2">layer for agents.</Fragment>,
              ]}
            />

            <Reveal delay={0.5} className="mt-[var(--s4)] max-w-xl">
              <p className="lede text-muted">
                The portable brand engine that travels with your agent and plugs into Claude
                Code, Codex, and Cursor.
              </p>
            </Reveal>

            <Reveal
              delay={0.62}
              className="mt-[var(--s4)] flex flex-wrap items-center gap-[var(--s2)]"
            >
              <a href="#install" className="btn btn-primary">
                Add to your editor
              </a>
              <a href="#how" className="btn btn-ghost">
                See what it catches
              </a>
            </Reveal>

            <Reveal
              delay={0.74}
              className="label mt-[var(--s5)] flex flex-wrap items-center gap-[var(--s2)] text-faint"
            >
              <span>Works with</span>
              <span className="h-px w-8 bg-line-strong" />
              <span className="text-muted">Claude Code</span>
              <span className="text-muted">Codex</span>
              <span className="text-muted">Cursor</span>
            </Reveal>
          </div>
        </section>

        {/* Sampler */}
        <section className="rhythm-section mx-auto w-full max-w-6xl px-5">
          <Reveal className="mb-[var(--s3)] max-w-2xl">
            <h2 className="display display-3">
              Point it at a site. Watch a whole system land at once.
            </h2>
            <p className="lede mt-[var(--s2)] text-muted">
              Every primitive re-renders on the extracted tokens. That cascade is the proof it
              works across the system.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <TasteSampler />
          </Reveal>
        </section>

        {/* Problem */}
        <Section
          index="I"
          eyebrow="The problem"
          title={
            <>
              Off-brand work can <em>still</em> pass review.
            </>
          }
          lede="The agent fills the gap with generic-looking UI. AI coding tools do not continually sync with your design system, Figma file, or stylesheet. Drag the handle."
        >
          <Reveal>
            <ViolationWipe />
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-[var(--s3)] max-w-2xl text-[0.875rem] leading-relaxed text-faint">
              These are the four failure modes Tastefield compiles rules against: values outside
              the token scale, props that don&apos;t exist on the real component, spacing off the
              scale, and missing safeguards on irreversible actions.
            </p>
          </Reveal>
        </Section>

        {/* How it works */}
        <Section
          id="how"
          index="II"
          eyebrow="How it works"
          title="Four stages, one checker."
          lede="A rule an agent merely reads is advice. A rule that can be verified is enforcement, so every compiled rule carries the pattern that proves it."
        >
          <div className="grid gap-[var(--s2)] sm:grid-cols-2">
            {PIPELINE.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <Card className="h-full">
                  <div className="mb-[var(--s2)] flex items-center gap-2.5">
                    <span className="label text-accent">{s.step}</span>
                    <span className="label text-ink">{s.name}</span>
                  </div>
                  <p className="text-[0.9rem] leading-relaxed text-muted">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-[var(--s2)] overflow-x-auto rounded-2xl border border-line bg-bg-raised p-[var(--s3)]">
              <code className="font-mono text-[12.5px] whitespace-nowrap text-muted">
                scan(repo) <span className="text-faint">→</span> ScanResult{" "}
                <span className="text-faint">→</span> compile(){" "}
                <span className="text-faint">→</span>{" "}
                <span className="text-ink">.tastefield/</span>{" "}
                <span className="text-faint">→</span> MCP server{" "}
                <span className="text-faint">→</span> <span className="text-ok">agent</span>
              </code>
            </div>
          </Reveal>
        </Section>

        {/* Coexistence */}
        <Section
          index="III"
          eyebrow="Coexistence"
          title={
            <>
              Your source of truth stays <em>yours</em>.
            </>
          }
          lede="Your team's design system process doesn't change, whether it's in Figma, zeroheight, or Storybook. Tastefield reads where those design decisions land and keeps your agent in the loop."
        >
          <div className="grid gap-[var(--s2)] sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <Card className="flex items-center gap-3">
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      s.ready ? "bg-ok" : "bg-line-strong"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[0.9rem] font-medium">{s.name}</div>
                    <div className="text-[0.8rem] text-faint">{s.note}</div>
                  </div>
                  <span className="label ml-auto shrink-0 text-faint">
                    {s.ready ? "Read-only" : "Planned"}
                  </span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* For agents */}
        <Section
          id="agent"
          index="IV"
          eyebrow="What the agent gets"
          title="Four narrow tools. Deliberately no fifth."
          lede="There is no get_everything. Dumping a whole design system into a context window is the exact failure this product exists to fix, so the agent asks for one thing at a time and gets one thing at a time."
        >
          <div className="grid gap-[var(--s2)] sm:grid-cols-2">
            {TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <Card className="h-full">
                  <div className="label text-ink">{t.title}</div>
                  <code className="mt-2 block font-mono text-[11.5px] text-faint">{t.name}</code>
                  <p className="mt-[var(--s2)] text-[0.9rem] leading-relaxed text-muted">
                    {t.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Card className="mt-[var(--s2)] border-dashed">
              <p className="text-[0.9rem] leading-relaxed text-muted">
                <span className="text-ink">Brand and voice outlast visual rules.</span> Base models
                keep getting better at spacing and color on their own. They will never
                independently know that your company can&apos;t say &ldquo;cheap,&rdquo; or
                can&apos;t put red on a checkout button for compliance reasons.
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* Registry / recipes hidden until the public roadmap is less fuzzy. */}

        {/* Proof — hidden for now (2026-08-17). Synthetic bench numbers read as proof before independent agent sessions exist.
        <Section index="V" eyebrow="Proof" title="The honest version of the numbers." />
        */}

        {/* Trust — hidden for now (2026-08-17).
        <Section eyebrow="Constraints we won't trade away" title="Boring guarantees, in writing." />
        */}

        {/* Install */}
        <section id="install" className="plate-dusk relative isolate overflow-hidden">
          <div className="lattice pointer-events-none absolute inset-0 opacity-60" />
          <div className="horizon pointer-events-none absolute inset-0" />
          <div className="rhythm-section relative mx-auto w-full max-w-6xl px-5">
            <Reveal className="max-w-2xl">
              <h2 className="display display-2">One command. No account.</h2>
              <p className="lede mt-[var(--s3)] max-w-lg text-muted">
                Point it at the repo you&apos;re already in. It scans, compiles, and starts serving
                your design system to whatever agent is connected.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-[var(--s4)] max-w-lg overflow-x-auto rounded-xl border border-line bg-bg-raised p-[var(--s3)]">
                <code className="font-mono text-[13px] whitespace-nowrap">
                  <span className="text-faint">$</span> npx{" "}
                  <span className="text-ink">@tastefield/mcp</span>
                </code>
              </div>
            </Reveal>
            <Reveal
              delay={0.14}
              className="mt-[var(--s3)] flex flex-wrap items-center gap-[var(--s2)]"
            >
              <a href="#top" className="btn btn-primary">
                Try in Cursor
              </a>
              <span className="label text-faint">Claude Code · Codex · Cursor</span>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
