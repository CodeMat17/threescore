"use client";

import {
  fadeUp,
  noMotion,
  staggerContainer,
  viewportOnce,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import * as React from "react";

/**
 * `LazyMotion` + `m` load only the DOM animation feature set (~15kb) instead of
 * the full ~110kb `motion` bundle that the previous `motion.div` usage pulled
 * in on every page.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

type RevealProps = React.ComponentProps<typeof m.div> & {
  /** Override the default fade-up. */
  variants?: Variants;
  /** Seconds to wait before animating in. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

/** Scroll-triggered reveal for a single element. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial='hidden'
        whileInView='visible'
        viewport={viewportOnce}
        variants={reduced ? noMotion : variants}
        transition={reduced ? { duration: 0 } : { delay }}
        className={cn(className)}
        {...props}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

/**
 * Reveal a group of children in sequence. Wrap each child in `<RevealItem>`.
 */
export function RevealGroup({
  children,
  className,
  ...props
}: React.ComponentProps<typeof m.div>) {
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial='hidden'
        whileInView='visible'
        viewport={viewportOnce}
        variants={reduced ? noMotion : staggerContainer}
        className={cn(className)}
        {...props}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** A child of `<RevealGroup>`; inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  ...props
}: React.ComponentProps<typeof m.div> & { variants?: Variants }) {
  const reduced = useReducedMotion();

  return (
    <m.div
      variants={reduced ? noMotion : variants}
      className={cn(className)}
      {...props}>
      {children}
    </m.div>
  );
}
