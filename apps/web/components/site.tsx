"use client";

import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.72, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Display lines rise out of a mask, one after the other. */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: "108%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 1.05, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`rhythm-section mx-auto w-full max-w-6xl px-5 ${className}`}
    >
      {(eyebrow || title || lede) && (
        <Reveal className="mb-[var(--s5)] border-t border-line pt-[var(--s3)]">
          <div className="grid gap-[var(--s3)] lg:grid-cols-[9rem_1fr]">
            <div className="label flex items-baseline gap-3 pt-[0.55rem] text-faint lg:flex-col lg:gap-2">
              {index && <span className="text-accent">{index}</span>}
              {eyebrow && <span>{eyebrow}</span>}
            </div>
            <div className="max-w-2xl">
              {title && <h2 className="display display-2">{title}</h2>}
              {lede && <p className="lede mt-[var(--s3)] text-muted">{lede}</p>}
            </div>
          </div>
        </Reveal>
      )}
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-[var(--s3)] transition-colors duration-300 hover:border-line-strong ${className}`}
    >
      {children}
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 120);
  });

  return (
    <header
      className={`tone-dusk sticky top-0 z-50 transition-colors duration-500 ${
        scrolled ? "chrome border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-[var(--s4)] px-5">
        <a href="#top" className="flex items-center" aria-label="Tastefield">
          <img src="/tastefield-logo-white.png" alt="Tastefield" className="h-7 w-auto" />
        </a>
        <div className="label ml-auto hidden items-center gap-[var(--s4)] text-muted md:flex">
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#agent" className="transition-colors hover:text-ink">
            For agents
          </a>
        </div>
        <a href="#install" className="btn btn-ghost !py-2.5">
          Install
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="plate-dusk">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-[var(--s3)] px-5 py-[var(--s5)] sm:flex-row sm:items-center">
        <div className="flex items-center">
          <img src="/tastefield-logo-white.png" alt="Tastefield" className="h-6 w-auto" />
        </div>
        <p className="label text-faint sm:ml-[var(--s3)]">
          Runs on your machine. Sends nothing anywhere.
        </p>
        <div className="label flex gap-[var(--s3)] text-muted sm:ml-auto">
          <a href="#how" className="transition-colors hover:text-ink">
            Docs
          </a>
          <a href="#install" className="transition-colors hover:text-ink">
            Install
          </a>
        </div>
      </div>
    </footer>
  );
}
