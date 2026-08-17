import { useState } from "react";

type Pillar = "methods" | "design" | "skills";

const PILLARS: { id: Pillar; label: string }[] = [
  { id: "methods", label: "❖ Methods" },
  { id: "design", label: "🎨 Design System" },
  { id: "skills", label: "⚡ Skills" },
];

// Static placeholders until the Rust backend / MCP server are wired up.
const DETECTED_AGENTS = [
  { name: "Cursor", count: 12 },
  { name: "Claude", count: 8 },
  { name: "Codex", count: 3 },
];

const SURFACES = [
  { name: "Color", meta: "24 tokens" },
  { name: "Typography", meta: "9 scales" },
  { name: "Spacing", meta: "8 steps" },
  { name: "Radii", meta: "5 tokens" },
  { name: "Shadow", meta: "4 levels" },
  { name: "Motion", meta: "6 curves" },
];

const SKILLS = [
  { name: "frontend-taste", pkg: "@tastefield/core", desc: "Enforce restraint before the agent writes UI." },
  { name: "reality-check", pkg: "@tastefield/core", desc: "Adversarial review of a proposed change." },
  { name: "streamline", pkg: "@tastefield/core", desc: "Parse .tsx into a Streamlined Component Schema." },
];

export default function App() {
  const [active, setActive] = useState<Pillar>("methods");
  const [tweaker, setTweaker] = useState<string | null>(null);
  const [density, setDensity] = useState(5);
  const [darkMode, setDarkMode] = useState(true);
  const [target, setTarget] = useState<"web" | "native">("web");

  return (
    <div className="app">
      <header className="titlebar">
        <div className="left">
          <div className="traffic">
            <span className="c" />
            <span className="y" />
            <span className="g" />
          </div>
          <button className="workspace">
            acme-frontend <span className="chev">▾</span>
          </button>
        </div>

        <nav className="pill" role="tablist" aria-label="Pillars">
          {PILLARS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={active === p.id}
              onClick={() => setActive(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className="right">
          <span className="mcp">
            <i /> MCP :3000
          </span>
          <button className="search">
            🔍 <kbd>⌘K</kbd>
          </button>
        </div>
      </header>

      <div className="main">
        <main className="canvas">
          {active === "methods" && <MethodsView />}
          {active === "design" && <DesignView />}
          {active === "skills" && <SkillsView onTweak={setTweaker} activeTweak={tweaker} />}
        </main>

        <aside className={`inspector${tweaker ? " open" : ""}`} aria-hidden={!tweaker}>
          <div className="inspector-inner">
            <p className="eyebrow">Parametric Tweaker</p>
            <h2>{tweaker ?? ""}</h2>
            <p className="meta">Runtime parameters compiled into the exported SKILL.md.</p>

            <div className="field">
              <label>
                Visual Density <span className="meta">{density}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
              />
              <div className="ends">
                <span>Minimalist</span>
                <span>Brutalist</span>
              </div>
            </div>

            <div className="field">
              <div className="toggle-row">
                <label style={{ margin: 0 }}>Enforce Dark Mode</label>
                <button
                  className="toggle"
                  role="switch"
                  aria-checked={darkMode}
                  onClick={() => setDarkMode((v) => !v)}
                >
                  <i />
                </button>
              </div>
            </div>

            <div className="field">
              <label>Target</label>
              <div className="seg" role="tablist">
                {(["web", "native"] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={target === t}
                    onClick={() => setTarget(t)}
                  >
                    {t === "web" ? "React (web)" : "React Native"}
                  </button>
                ))}
              </div>
            </div>

            <div className="actions" style={{ marginTop: 24 }}>
              <button className="btn primary">Apply</button>
              <button className="btn ghost" onClick={() => setTweaker(null)}>
                Close
              </button>
            </div>
          </div>
        </aside>
      </div>

      <footer className="statusbar">
        <span>
          Field <code>acme-frontend</code> · {DETECTED_AGENTS.reduce((n, a) => n + a.count, 0)} skills
          discovered
        </span>
        <span>Tastefield Studio 0.1.0</span>
      </footer>
    </div>
  );
}

function MethodsView() {
  return (
    <section className="panel">
      <p className="eyebrow">Methods</p>
      <h1>Package your expertise into executable workflows</h1>
      <p className="lede">
        A Method is your structured expertise — Skills, Rules, and knowledge — packaged into an
        executable workflow the agent can run.
      </p>

      <div className="agents">
        {DETECTED_AGENTS.map((a) => (
          <span key={a.name} className="agent-chip">
            <b>{a.name}</b> <span className="count">{a.count} skills</span>
          </span>
        ))}
      </div>

      <div className="empty">
        <h2>No Methods yet</h2>
        <p>
          Compose Skills, Rules, and knowledge into a Method, then lock and export it as a thin
          orchestrator <code>SKILL.md</code> your agents can load on demand.
        </p>
        <div className="actions">
          <button className="btn primary">New Method</button>
          <button className="btn">Browse examples</button>
          <button className="btn ghost">Import from field.yaml</button>
        </div>
      </div>
    </section>
  );
}

function DesignView() {
  return (
    <section className="panel">
      <div className="toolbar">
        <div>
          <p className="eyebrow">Design System</p>
          <h1>Streamlined component schemas</h1>
        </div>
        <div className="actions">
          <button className="btn">Re-scan components</button>
        </div>
      </div>
      <p className="lede">
        Tastefield parses local <code>.tsx</code> components into token-light schemas and enforces
        visual restraints before the agent writes code.
      </p>
      <div className="grid">
        {SURFACES.map((s) => (
          <button key={s.name} className="surface-card">
            <div className="swatch" />
            <h3>{s.name}</h3>
            <div className="meta">{s.meta}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SkillsView({
  onTweak,
  activeTweak,
}: {
  onTweak: (name: string | null) => void;
  activeTweak: string | null;
}) {
  return (
    <section className="panel">
      <div className="toolbar">
        <div>
          <p className="eyebrow">Skills</p>
          <h1>First-party core skills</h1>
        </div>
        <div className="actions">
          <button className="btn">Browse examples</button>
          <button className="btn primary">Add Skill</button>
        </div>
      </div>
      <p className="lede">
        A Skill is a procedure. Skills with a <code>parameters:</code> block open the Parametric
        Tweaker so you can tune them before export.
      </p>
      <div className="grid">
        {SKILLS.map((s) => (
          <button
            key={s.name}
            className="skill-card"
            aria-pressed={activeTweak === s.name}
            onClick={() => onTweak(activeTweak === s.name ? null : s.name)}
          >
            <div className="pkg">{s.pkg}</div>
            <h3>{s.name}</h3>
            <div className="meta">{s.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
