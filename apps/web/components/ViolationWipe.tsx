"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const VIOLATIONS = [
  { top: "14%", left: "6%", label: "Hardcoded #7C3AED", detail: "not a token" },
  { top: "47%", left: "40%", label: "variant=\"primary-large\"", detail: "prop does not exist" },
  { top: "74%", left: "10%", label: "padding: 13px", detail: "off the spacing scale" },
  { top: "26%", left: "62%", label: "Destructive action", detail: "no confirmation step" },
];

/**
 * One wipe line across the whole panel rather than a control per card: the
 * shared x-position is what makes the two states read as the same system
 * rendered twice, instead of four unrelated toggles.
 */
export function ViolationWipe() {
  const [pct, setPct] = useState(52);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, setFromClientX]);

  // Idle auto-pulse so the mechanic is discoverable without instruction.
  useEffect(() => {
    if (dragging || reduced) return;
    const id = setInterval(() => {
      setPct((p) => (p > 50 ? 34 : 66));
    }, 3600);
    return () => clearInterval(id);
  }, [dragging, reduced]);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full touch-none overflow-hidden rounded-2xl border border-line bg-bg-raised select-none sm:aspect-[16/8]"
      onPointerDown={(e) => {
        setDragging(true);
        setFromClientX(e.clientX);
      }}
    >
      {/* Governed: the full panel, always rendered underneath. */}
      <div className="absolute inset-0">
        <PanelGoverned />
      </div>

      {/* Ungoverned: clipped to the wipe. */}
      <motion.div
        className="absolute inset-0"
        animate={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        transition={dragging ? { duration: 0 } : { duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
      >
        <PanelUngoverned />
        {VIOLATIONS.map((v) => (
          <div
            key={v.label}
            className="absolute hidden max-w-[190px] rounded-md border border-bad/40 bg-bad/12 px-2 py-1 backdrop-blur-sm sm:block"
            style={{ top: v.top, left: v.left }}
          >
            <div className="font-mono text-[10px] leading-tight text-bad">{v.label}</div>
            <div className="text-[9.5px] leading-tight text-bad/70">{v.detail}</div>
          </div>
        ))}
      </motion.div>

      {/* Handle */}
      <motion.div
        className="absolute inset-y-0 z-10 w-px bg-white/70"
        animate={{ left: `${pct}%` }}
        transition={dragging ? { duration: 0 } : { duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-white/25 bg-black/60 backdrop-blur-md active:cursor-grabbing">
          <span className="text-[11px] leading-none text-white/80">⇄</span>
        </div>
      </motion.div>

      <Tag className="left-3 top-3 border-bad/40 bg-bad/12 text-bad">Ungoverned</Tag>
      <Tag className="right-3 top-3 border-ok/40 bg-ok/12 text-ok">Governed</Tag>
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-20 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

function PanelGoverned() {
  return (
    <div className="flex h-full flex-col gap-3 p-5 sm:p-7" style={{ background: "#0d0e12" }}>
      <div className="flex items-center gap-2.5">
        <span className="size-2.5 rounded-full" style={{ background: "#7c74ff" }} />
        <span className="text-[13px] font-medium text-[#eceef4]">Billing</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#25262f] bg-[#15161c] p-4">
          <div className="mb-2 text-[10.5px] text-[#8b8e9e]">Current plan</div>
          <div className="text-[22px] font-medium tracking-tight text-[#eceef4]">$149</div>
          <button className="mt-4 w-full rounded-md py-2 text-[11.5px] font-medium text-white" style={{ background: "#7c74ff" }}>
            Manage
          </button>
        </div>
        <div className="rounded-lg border border-[#25262f] bg-[#15161c] p-4">
          <div className="mb-2 text-[10.5px] text-[#8b8e9e]">Seats</div>
          <div className="text-[22px] font-medium tracking-tight tabular-nums text-[#eceef4]">12</div>
          <button className="mt-4 w-full rounded-md border border-[#25262f] py-2 text-[11.5px] text-[#8b8e9e]">
            Invite
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-[#25262f] bg-[#15161c] p-4">
        <div className="text-[11.5px] text-[#eceef4]">Cancel subscription</div>
        <div className="mt-1 text-[10.5px] text-[#8b8e9e]">Asks for confirmation before anything is lost.</div>
      </div>
    </div>
  );
}

function PanelUngoverned() {
  return (
    <div className="flex h-full flex-col gap-2 p-5 sm:p-7" style={{ background: "#101014" }}>
      <div className="flex items-center gap-2">
        <span className="size-3" style={{ background: "#7C3AED", borderRadius: 3 }} />
        <span className="text-[15px] font-bold text-white">Billing</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div style={{ background: "#1a1a22", borderRadius: 5, padding: 13 }}>
          <div className="mb-1 text-[11px] text-[#999]">Current plan</div>
          <div className="text-[26px] font-extrabold text-white">$149</div>
          <button
            className="mt-3 w-full text-[12px] font-bold text-white"
            style={{ background: "#7C3AED", borderRadius: 5, padding: "9px 0" }}
          >
            Manage
          </button>
        </div>
        <div style={{ background: "#1a1a22", borderRadius: 5, padding: 13 }}>
          <div className="mb-1 text-[11px] text-[#999]">Seats</div>
          <div className="text-[26px] font-extrabold text-white">12</div>
          <button
            className="mt-3 w-full text-[12px] text-white"
            style={{ background: "#2a2a35", borderRadius: 5, padding: "9px 0" }}
          >
            Invite
          </button>
        </div>
      </div>
      <div style={{ background: "#2a1216", borderRadius: 5, padding: 13 }}>
        <div className="text-[12px] font-bold text-[#ff6b6b]">Cancel subscription</div>
        <div className="mt-1 text-[10.5px] text-[#a08]">Deletes immediately.</div>
      </div>
    </div>
  );
}
