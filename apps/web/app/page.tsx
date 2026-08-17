import { TasteSampler } from "@/components/TasteSampler";
import { ViolationWipe } from "@/components/ViolationWipe";
import { Card, Footer, Nav, Reveal, Section } from "@/components/site";

const PIPELINE = [
  {
    step: "01",
    name: "Scan",
    body: "Reads the design system already in your repo — CSS custom properties, Tailwind theme, cva variant contracts. Your config is parsed, never executed.",
  },
  {
    step: "02",
    name: "Compile",
    body: "Turns what it found into rules that cite your real tokens and your real components, each carrying a machine-checkable pattern wherever one can be expressed.",
  },
  {
    step: "03",
    name: "Serve",
    body: "A local MCP server hands the agent only the slice it asked for — this component's contract, these tokens — at the moment it writes code.",
  },
  {
    step: "04",
    name: "Check",
    body: "The same checker the rules were compiled from verifies the output. One implementation, so what you claim and what you measure cannot drift apart.",
  },
];

const TOOLS = [
  { name: "get_brand_standards", body: "Voice, restraints, and the things the product is not allowed to say." },
  { name: "get_component_contract", body: "The real props and variants of one component, so the agent stops inventing them." },
  { name: "get_design_tokens", body: "Your actual scale — color, spacing, radius, type — instead of a plausible guess." },
  { name: "check_compliance", body: "Verifies generated code against the compiled rules before it reaches your diff." },
];

const SOURCES = [
  { name: "Local repo", note: "Already on disk", ready: true },
  { name: "GitHub", note: "Same parsing, remote", ready: true },
  { name: "Figma", note: "Files & Variables API", ready: false },
  { name: "zeroheight", note: "Published styleguide", ready: false },
  { name: "Storybook", note: "On the connect list", ready: false },
  { name: "Supernova", note: "On the connect list", ready: false },
];

const RECIPES = [
  {
    family: "fintech-trust-first",
    variants: [
      ["institutional", "Boardroom conservative"],
      ["neobank", "Confident and modern"],
      ["embedded", "Invisible and fast"],
    ],
  },
  {
    family: "devtool-dark-first",
    variants: [
      ["core", "Dark-first and quiet"],
      ["terminal", "Dense and monospaced"],
    ],
  },
  {
    family: "consumer-checkout-safe",
    variants: [
      ["conversion", "Warm and reassuring"],
      ["regulated", "Plain and unpushy"],
    ],
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="grid-faint relative overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
            <Reveal className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] text-muted">
                <span className="size-1.5 rounded-full bg-ok" />
                Local MCP server · nothing leaves your machine
              </div>
              <h1 className="display text-[40px] font-semibold sm:text-[62px]">
                Your design system,
                <br />
                enforced as the AI types.
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17.5px]">
                Cursor doesn&apos;t know your tokens, so it invents them. Tastefield compiles the
                design system you already have into rules your agent has to follow — then checks
                the output before it reaches your diff.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#install"
                className="rounded-lg bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-90"
              >
                Add to your editor
              </a>
              <a
                href="#how"
                className="rounded-lg border border-line-strong px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-surface"
              >
                See how it works
              </a>
              <span className="text-[12.5px] text-faint">
                Works alongside Figma, zeroheight and Storybook — it replaces none of them.
              </span>
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[14px] font-medium">Point it at a site. Watch a whole system land at once.</h2>
                <p className="text-[12.5px] text-faint">
                  Every primitive re-renders on the extracted tokens — that cascade is the proof it&apos;s systemic, not a theme switch.
                </p>
              </div>
              <TasteSampler />
            </Reveal>
          </div>
        </section>

        {/* Problem */}
        <Section
          eyebrow="The problem"
          title="An agent with no constraints will always produce something plausible."
          lede="Plausible is the problem. It compiles, it renders, it passes review at a glance — and it quietly carries a hardcoded hex, a prop that never existed, and a destructive action with no confirmation. Drag the handle."
        >
          <Reveal>
            <ViolationWipe />
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-faint">
              These are the four failure modes Tastefield compiles rules against: values outside
              the token scale, props that don&apos;t exist on the real component, spacing off the
              scale, and missing safeguards on irreversible actions.
            </p>
          </Reveal>
        </Section>

        {/* How it works */}
        <Section
          id="how"
          eyebrow="How it works"
          title="Four stages, one checker."
          lede="A rule an agent merely reads is advice. A rule that can be verified is enforcement — so every compiled rule carries the pattern that proves it."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {PIPELINE.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <Card className="h-full">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-accent">{s.step}</span>
                    <span className="text-[14px] font-semibold">{s.name}</span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-muted">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-bg-raised p-4">
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
          eyebrow="Coexistence, not replacement"
          title="Your source of truth doesn't move."
          lede="Figma, zeroheight, Storybook and Supernova stay where your team already decides things. Tastefield reads from them and never writes back — it's the layer that makes those decisions stick inside the editor."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <Card className="flex items-center gap-3">
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${s.ready ? "bg-ok" : "bg-white/25"}`}
                  />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium">{s.name}</div>
                    <div className="text-[11.5px] text-faint">{s.note}</div>
                  </div>
                  <span className="ml-auto shrink-0 text-[10px] tracking-wide text-faint">
                    {s.ready ? "READ-ONLY" : "PLANNED"}
                  </span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* For agents */}
        <Section
          id="agent"
          eyebrow="What the agent gets"
          title="Four narrow tools. Deliberately no fifth."
          lede="There is no get_everything. Dumping a whole design system into a context window is the exact failure this product exists to fix, so the agent asks for one thing at a time and gets one thing at a time."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <Card className="h-full">
                  <code className="font-mono text-[12.5px] text-accent">{t.name}</code>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{t.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Card className="mt-3 border-dashed">
              <p className="text-[13.5px] leading-relaxed text-muted">
                <span className="text-ink">Brand and voice outlast visual rules.</span> Base models
                keep getting better at spacing and color on their own. They will never
                independently know that your company can&apos;t say &ldquo;cheap,&rdquo; or
                can&apos;t put red on a checkout button for compliance reasons.
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* Recipes */}
        <Section
          id="recipes"
          eyebrow="Registry"
          title="Start from a recipe, not a blank file."
          lede="Recipes are browsed by the problem they solve, not by company name. Each family ships variants, and you pick by mood before you ever read a token table."
        >
          <div className="grid gap-3 lg:grid-cols-3">
            {RECIPES.map((r, i) => (
              <Reveal key={r.family} delay={i * 0.06}>
                <Card className="h-full">
                  <code className="font-mono text-[12.5px] text-ink">{r.family}</code>
                  <div className="mt-4 flex flex-col gap-3">
                    {r.variants.map(([v, mood]) => (
                      <div key={v} className="border-l border-line pl-3">
                        <div className="font-mono text-[11.5px] text-accent">{v}</div>
                        <div className="text-[12.5px] text-muted">{mood}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Proof */}
        <Section
          id="proof"
          eyebrow="Proof"
          title="The honest version of the numbers."
          lede="A governance tool that overstates its own results has no business telling your agent to behave. So here is exactly what has been measured, and exactly what hasn't."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["31.21", "Baseline violation density", "49 errors and 5 warnings across 173 lines"],
              ["0", "Governed violation density", "Same 8 tasks, same checker"],
              ["59", "Tests passing", "Core engine, run on every change"],
            ].map(([v, label, note], i) => (
              <Reveal key={label} delay={i * 0.05}>
                <Card className="h-full">
                  <div className="text-[34px] font-semibold tracking-tight tabular-nums">{v}</div>
                  <div className="mt-1 text-[13px] font-medium">{label}</div>
                  <div className="mt-1 text-[11.5px] leading-relaxed text-faint">{note}</div>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.18}>
            <Card className="mt-3 border-warn/25 bg-warn/5">
              <div className="mb-1.5 text-[12px] font-semibold text-warn">
                What this does not yet prove
              </div>
              <p className="text-[13.5px] leading-relaxed text-muted">
                That run was synthetic: both arms were authored by the same coding agent against a
                fixture app, by an author who knew what each arm was meant to show. It demonstrates
                the harness and the checker work end to end on realistic code. It does not yet
                prove the result against real prompt variance — that needs two independent agent
                sessions, one with the MCP server wired in and one without. We will publish that
                run when it exists, and we will never claim clean output on the first pass; models
                are stochastic and that claim would not survive a live demo.
              </p>
            </Card>
          </Reveal>
        </Section>

        {/* Trust */}
        <Section
          eyebrow="Constraints we won't trade away"
          title="Boring guarantees, in writing."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["No telemetry", "Nothing is sent anywhere. Your git history is never read. There is no account and no key to paste on day one."],
              ["Your config is never executed", "A scanned Tailwind config is detected and parsed, never run. Executing arbitrary code out of a repo you just cloned is not a feature."],
              ["Unknown stays unknown", "A number we haven't measured renders as an em dash, never as a zero. There's a test that enforces it."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.05}>
                <Card className="h-full">
                  <div className="mb-2 text-[13.5px] font-semibold">{title}</div>
                  <p className="text-[13px] leading-relaxed text-muted">{body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Install */}
        <Section id="install" className="pb-24 sm:pb-32">
          <Reveal>
            <div className="rounded-2xl border border-line bg-bg-raised p-7 sm:p-12">
              <h2 className="headline max-w-lg text-[28px] font-semibold sm:text-[36px]">
                One command. No account.
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
                Point it at the repo you&apos;re already in. It scans, compiles, and starts serving
                your design system to whatever agent is connected.
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-bg p-4">
                <code className="font-mono text-[13px] whitespace-nowrap">
                  <span className="text-faint">$</span> npx{" "}
                  <span className="text-ink">@tastefield/mcp</span>{" "}
                  <span className="text-accent">--recipe=fintech-trust-first/neobank</span>
                </code>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#top"
                  className="rounded-lg bg-ink px-4 py-2.5 text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-90"
                >
                  Try in Cursor
                </a>
                <a
                  href="#recipes"
                  className="rounded-lg border border-line-strong px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-surface"
                >
                  Browse recipes
                </a>
                <span className="text-[12px] text-faint">
                  Cursor · Claude Code · Windsurf
                </span>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>

      <Footer />
    </>
  );
}
