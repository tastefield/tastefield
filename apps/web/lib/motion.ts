import type { Transition } from "motion/react";

/**
 * Apple expresses springs as damping ratio + response rather than
 * mass/stiffness/damping. Motion's `bounce` + `duration` maps onto that pair:
 * bounce 0 == critically damped (damping 1.0), duration == response.
 */
export function appleSpring(damping: number, response: number): Transition {
  return { type: "spring", bounce: Math.max(0, 1 - damping), duration: response };
}

/** Default UI motion: critically damped, nothing overshoots. */
export const springUI = appleSpring(1.0, 0.4);

/** Reserved for motion that followed a physical drag or flick. */
export const springMomentum = appleSpring(0.8, 0.4);

/** Sheets and drawers. */
export const springSheet = appleSpring(0.8, 0.3);

/**
 * Distance-based delay so a token change propagates outward from the control
 * that caused it, instead of every card flipping on the same frame.
 */
export function radialDelay(index: number, total: number, spread = 0.28): number {
  if (total <= 1) return 0;
  return (index / (total - 1)) * spread;
}
