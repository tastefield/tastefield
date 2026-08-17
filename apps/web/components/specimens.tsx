import type { CSSProperties } from "react";
import type { TasteTokens } from "@/lib/tokens";

export type SpecimenProps = { t: TasteTokens };

const sp = (t: TasteTokens, n: number) => `${Math.round(n * t.density)}px`;

function surface(t: TasteTokens): CSSProperties {
  return {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: t.radius,
    boxShadow: t.shadow,
    color: t.ink,
    fontFamily: t.font,
    padding: sp(t, 18),
  };
}

function heading(t: TasteTokens, size: number): CSSProperties {
  return {
    fontSize: size,
    fontWeight: t.weightHeading,
    letterSpacing: t.tracking,
    color: t.ink,
    margin: 0,
    lineHeight: 1.2,
  };
}

function button(t: TasteTokens, variant: "solid" | "quiet" = "solid"): CSSProperties {
  return {
    borderRadius: Math.max(0, t.radius - 2),
    padding: `${sp(t, 9)} ${sp(t, 14)}`,
    fontSize: 12.5,
    fontWeight: 560,
    fontFamily: t.font,
    border: variant === "solid" ? "1px solid transparent" : `1px solid ${t.border}`,
    background: variant === "solid" ? t.accent : "transparent",
    color: variant === "solid" ? t.accentInk : t.inkMuted,
    cursor: "pointer",
    width: "100%",
  };
}

export function PricingCard({ t }: SpecimenProps) {
  return (
    <div style={surface(t)}>
      <div style={{ fontSize: 11, color: t.inkMuted, marginBottom: sp(t, 8) }}>Team</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={heading(t, 30)}>$149</span>
        <span style={{ fontSize: 12, color: t.inkMuted }}>/mo</span>
      </div>
      <div style={{ display: "grid", gap: sp(t, 7), margin: `${sp(t, 14)} 0` }}>
        {["Unlimited recipes", "5 connected repos", "Priority review"].map((f) => (
          <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: t.inkMuted }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: t.accent, flexShrink: 0 }} />
            {f}
          </div>
        ))}
      </div>
      <button style={button(t)}>Start trial</button>
    </div>
  );
}

export function SettingsForm({ t }: SpecimenProps) {
  return (
    <div style={surface(t)}>
      <h3 style={heading(t, 14)}>Preferences</h3>
      <label style={{ display: "block", fontSize: 11, color: t.inkMuted, margin: `${sp(t, 14)} 0 ${sp(t, 6)}` }}>
        Workspace name
      </label>
      <div
        style={{
          border: `1px solid ${t.border}`,
          borderRadius: Math.max(0, t.radius - 2),
          padding: `${sp(t, 9)} ${sp(t, 11)}`,
          fontSize: 12.5,
          color: t.ink,
          background: t.canvas,
        }}
      >
        acme-frontend
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: sp(t, 14),
        }}
      >
        <span style={{ fontSize: 12, color: t.ink }}>Enforce on save</span>
        <span
          style={{
            width: 38,
            height: 22,
            borderRadius: 999,
            background: t.accent,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: 18,
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#fff",
            }}
          />
        </span>
      </div>
    </div>
  );
}

export function DataTable({ t }: SpecimenProps) {
  const rows = [
    ["button.tsx", "12 variants", "Passing"],
    ["dialog.tsx", "4 variants", "Passing"],
    ["input.tsx", "7 variants", "Review"],
  ];
  return (
    <div style={{ ...surface(t), padding: 0, overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr auto",
          gap: sp(t, 10),
          padding: `${sp(t, 10)} ${sp(t, 14)}`,
          borderBottom: `1px solid ${t.border}`,
          fontSize: 10.5,
          color: t.inkMuted,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span>Component</span>
        <span>Contract</span>
        <span>State</span>
      </div>
      {rows.map(([a, b, c], i) => (
        <div
          key={a}
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr auto",
            gap: sp(t, 10),
            padding: `${sp(t, 10)} ${sp(t, 14)}`,
            borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : "none",
            fontSize: 12,
            color: t.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{a}</span>
          <span style={{ color: t.inkMuted }}>{b}</span>
          <span style={{ color: c === "Passing" ? t.accent : t.inkMuted, fontSize: 11 }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

export function ConfirmModal({ t }: SpecimenProps) {
  return (
    <div style={surface(t)}>
      <h3 style={heading(t, 14)}>Delete recipe?</h3>
      <p style={{ fontSize: 12, color: t.inkMuted, lineHeight: 1.5, margin: `${sp(t, 8)} 0 ${sp(t, 14)}` }}>
        Its shared install link stops working immediately. This cannot be undone.
      </p>
      <div style={{ display: "flex", gap: sp(t, 8) }}>
        <button style={button(t, "quiet")}>Cancel</button>
        <button style={{ ...button(t), background: "#e5484d", color: "#fff" }}>Delete</button>
      </div>
    </div>
  );
}

export function NavBar({ t }: SpecimenProps) {
  return (
    <div
      style={{
        ...surface(t),
        padding: `${sp(t, 11)} ${sp(t, 14)}`,
        display: "flex",
        alignItems: "center",
        gap: sp(t, 14),
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: t.radius > 6 ? 999 : 2, background: t.accent }} />
      <span style={{ fontSize: 12.5, fontWeight: t.weightHeading, letterSpacing: t.tracking }}>Acme</span>
      <span style={{ marginLeft: "auto", display: "flex", gap: sp(t, 12), fontSize: 11.5, color: t.inkMuted }}>
        <span>Docs</span>
        <span>Pricing</span>
      </span>
    </div>
  );
}

export function StatTiles({ t }: SpecimenProps) {
  const stats = [
    ["Violations", "0"],
    ["Tokens", "148"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp(t, 10) }}>
      {stats.map(([label, value]) => (
        <div key={label} style={{ ...surface(t), padding: sp(t, 14) }}>
          <div style={{ fontSize: 10.5, color: t.inkMuted, marginBottom: 4 }}>{label}</div>
          <div style={{ ...heading(t, 22), fontVariantNumeric: "tabular-nums" }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

export const SPECIMENS = [
  { id: "nav", Component: NavBar },
  { id: "pricing", Component: PricingCard },
  { id: "form", Component: SettingsForm },
  { id: "table", Component: DataTable },
  { id: "modal", Component: ConfirmModal },
  { id: "stats", Component: StatTiles },
] as const;
