"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

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
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-5 py-20 sm:py-28 ${className}`}>
      {(eyebrow || title || lede) && (
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          {eyebrow && <div className="eyebrow mb-3 text-[11px] text-accent">{eyebrow}</div>}
          {title && <h2 className="headline text-[28px] font-semibold sm:text-[38px]">{title}</h2>}
          {lede && <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-[16px]">{lede}</p>}
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
    <div className={`rounded-xl border border-line bg-surface p-5 ${className}`}>{children}</div>
  );
}

export function Nav() {
  return (
    <header className="chrome sticky top-0 z-50 border-b border-line">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-ink text-[11px] font-bold text-bg">
            T
          </span>
          <span className="text-[14px] font-semibold tracking-tight">Tastefield</span>
        </a>
        <div className="ml-auto hidden items-center gap-6 text-[13px] text-muted md:flex">
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#agent" className="transition-colors hover:text-ink">For agents</a>
          <a href="#recipes" className="transition-colors hover:text-ink">Recipes</a>
          <a href="#proof" className="transition-colors hover:text-ink">Proof</a>
        </div>
        <a
          href="#install"
          className="rounded-lg border border-line-strong bg-surface-strong px-3.5 py-1.5 text-[12.5px] font-medium transition-colors hover:bg-white/12"
        >
          Install
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-ink text-[11px] font-bold text-bg">
            T
          </span>
          <span className="text-[13px] font-medium">Tastefield</span>
        </div>
        <p className="text-[12px] text-faint sm:ml-4">
          Runs on your machine. Sends nothing anywhere.
        </p>
        <div className="flex gap-5 text-[12.5px] text-muted sm:ml-auto">
          <a href="#how" className="transition-colors hover:text-ink">Docs</a>
          <a href="#recipes" className="transition-colors hover:text-ink">Registry</a>
          <a href="#install" className="transition-colors hover:text-ink">Install</a>
        </div>
      </div>
    </footer>
  );
}
