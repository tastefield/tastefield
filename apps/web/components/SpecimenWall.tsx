"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import type { TasteTokens } from "@/lib/tokens";
import { radialDelay } from "@/lib/motion";
import { SPECIMENS, type SpecimenProps } from "./specimens";

type CardProps = {
  target: TasteTokens;
  generation: number;
  index: number;
  total: number;
  Component: (p: SpecimenProps) => React.ReactElement;
};

/**
 * Each card owns the moment it adopts new tokens. A card late in the cascade
 * keeps rendering the old design system until its own dip reaches the trough,
 * which is what makes the change read as travelling across the wall rather
 * than every card cutting on the same frame.
 */
function SpecimenCard({ target, generation, index, total, Component }: CardProps) {
  const [shown, setShown] = useState(target);
  const [scope, animate] = useAnimate();
  const seenGeneration = useRef(generation);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Slider drag: track the control 1:1, no flourish.
    if (generation === seenGeneration.current) {
      setShown(target);
      return;
    }
    seenGeneration.current = generation;

    const delay = radialDelay(index, total);

    if (reduced) {
      const swap = setTimeout(() => setShown(target), delay * 1000);
      animate(scope.current, { opacity: [1, 0.4, 1] }, { duration: 0.3, delay });
      return () => clearTimeout(swap);
    }

    const swap = setTimeout(() => setShown(target), (delay + 0.17) * 1000);
    animate(
      scope.current,
      {
        filter: ["blur(0px)", "blur(9px)", "blur(0px)"],
        scale: [1, 0.972, 1],
        opacity: [1, 0.45, 1],
      },
      { duration: 0.66, delay, times: [0, 0.28, 1], ease: [0.32, 0.72, 0, 1] },
    );
    return () => clearTimeout(swap);
  }, [target, generation, index, total, animate, scope, reduced]);

  return (
    <motion.div ref={scope} style={{ willChange: "transform, filter, opacity" }}>
      <Component t={shown} />
    </motion.div>
  );
}

export function SpecimenWall({
  tokens,
  generation,
}: {
  tokens: TasteTokens;
  generation: number;
}) {
  const [sweeping, setSweeping] = useState(false);
  const reduced = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSweeping(true);
    const done = setTimeout(() => setSweeping(false), 900);
    return () => clearTimeout(done);
  }, [generation]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-raised p-3 sm:p-4">
      <motion.div
        aria-hidden
        animate={{ backgroundColor: tokens.canvas }}
        transition={{ duration: 0.66, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-3 rounded-xl sm:inset-4"
      />

      <div className="relative grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {SPECIMENS.map(({ id, Component }, i) => (
          <div key={id} className={id === "table" ? "sm:col-span-2 lg:col-span-1" : undefined}>
            <SpecimenCard
              target={tokens}
              generation={generation}
              index={i}
              total={SPECIMENS.length}
              Component={Component}
            />
          </div>
        ))}
      </div>

      {/* Specular sweep: the light that travels with the handoff. */}
      {sweeping && !reduced && (
        <motion.div
          aria-hidden
          initial={{ x: "-40%" }}
          animate={{ x: "140%" }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
          className="handoff-sweep pointer-events-none absolute inset-y-0 w-1/2"
        />
      )}
    </div>
  );
}
