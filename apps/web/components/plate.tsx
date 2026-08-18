"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
  Glyphs, not strings. Rule IDs streak horizontally and start competing with the
  headline for attention; single characters stay dither.
*/
const GLYPHS = "0123456789abcdef#-:{}/*$<>";
const COLS = 110;
const ROWS = 24;

function glyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/** Seeded so the server and the first client render agree. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildField() {
  const rand = mulberry32(0x7a57e);
  return Array.from({ length: ROWS }, () => {
    let row = "";
    for (let x = 0; x < COLS; x++) {
      // Field resolves left to right: dense at the margin, open under the copy.
      const density = 0.92 - (x / COLS) * 0.8;
      row += rand() < density ? GLYPHS[Math.floor(rand() * GLYPHS.length)] : " ";
    }
    return row;
  });
}

/** Character veil. Refreshes a handful of cells in gusts rather than at a constant rate. */
export function GlyphVeil({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<string[]>(buildField);
  const lull = useRef(0);

  useEffect(() => {
    if (reduced) return;

    const id = window.setInterval(() => {
      // Hold still for a beat every so often. Constant refresh is what makes
      // this kind of field feel busy.
      if (lull.current > 0) {
        lull.current -= 1;
        return;
      }
      if (Math.random() < 0.28) {
        lull.current = 2 + Math.floor(Math.random() * 6);
        return;
      }

      setRows((prev) => {
        const next = [...prev];
        const edits = 6 + Math.floor(Math.random() * 10);
        for (let i = 0; i < edits; i++) {
          const r = Math.floor(Math.random() * ROWS);
          const c = Math.floor(Math.random() * COLS);
          const row = next[r];
          if (row[c] === " ") continue;
          next[r] = row.slice(0, c) + glyph() + row.slice(c + 1);
        }
        return next;
      });
    }, 160);

    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{
        maskImage:
          "radial-gradient(115% 95% at 0% 42%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 44%, transparent 76%)",
        WebkitMaskImage:
          "radial-gradient(115% 95% at 0% 42%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 44%, transparent 76%)",
      }}
    >
      <pre
        className="font-mono text-[10px] leading-[1.35] whitespace-pre text-ink"
        style={{ opacity: 0.11, letterSpacing: "0.18em" }}
      >
        {rows.join("\n")}
      </pre>
    </div>
  );
}

/*
  Construction marks on divisions the layout actually uses: the φ column split and
  the φ baseline. Drawing marks over a grid that isn't there would be ornament.
*/
export function PhiMarks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const draw = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-ink"
        viewBox="0 0 1000 618"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.line
          x1="618"
          y1="0"
          x2="618"
          y2="618"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : draw }}
        />
        <motion.line
          x1="0"
          y1="382"
          x2="1000"
          y2="382"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : draw }}
        />
        <motion.circle
          cx="618"
          cy="382"
          r="34"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : draw }}
        />
      </svg>
    </div>
  );
}
