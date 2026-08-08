import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary. Every variant animates only `transform` and
 * `opacity` so work stays on the compositor: no layout thrash, no CLS, and no
 * measurable hit to Lighthouse's TBT.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const transition: Transition = {
  duration: 0.55,
  ease: EASE_OUT,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

/** Parent for grids/lists — children inherit `hidden`/`visible`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Standard scroll-reveal trigger: fire once, slightly before full entry. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

/**
 * Collapse a variant set to a no-op. Used with `useReducedMotion()` so reduced
 * motion means "content appears", not "content stays invisible".
 */
export const noMotion: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};
