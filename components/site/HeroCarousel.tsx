"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { HERO_FALLBACK } from "@/lib/hero";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import * as React from "react";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  /** Static import for the bundled first slide, URL string for CMS slides. */
  image: StaticImageData | string;
  alt: string;
};

const ROTATE_MS = 6500;

/**
 * Hero carousel.
 *
 * LCP strategy: slide 0 is a locally bundled, pre-optimized image
 * (`lib/hero.ts`) rather than a Convex storage URL, so the preload scanner can
 * start fetching it from the HTML with no round-trip to the CMS. Because the
 * parent uses `preloadQuery`, the CMS slides are resolved on the server too —
 * the heading, copy and CTAs are all present in the initial HTML, which is
 * what a crawler indexes.
 *
 * Accessibility: the rotation stops on hover, on focus, when the tab is
 * hidden, when the user presses the pause control, and whenever the OS
 * requests reduced motion (WCAG 2.2.2).
 */
export function HeroCarousel({
  preloadedSlides,
}: {
  preloadedSlides: Preloaded<typeof api.carousel.getCarousel>;
}) {
  const data = usePreloadedQuery(preloadedSlides);
  const reduced = useReducedMotion();

  const slides = React.useMemo<Slide[]>(() => {
    const fromCms = (Array.isArray(data) ? data : data ? [data] : [])
      // Guard against records with a missing storage URL — the previous code
      // passed `""` to <Image>, which fires a request for the current page.
      .filter((s) => typeof s?.image === "string" && s.image.length > 0)
      .map((s) => ({
        key: s._id as string,
        title: s.title,
        subtitle: s.subtitle,
        image: s.image as string,
        alt: s.title,
      }));

    return [
      {
        key: "static-hero",
        title: HERO_FALLBACK.title,
        subtitle: HERO_FALLBACK.subtitle,
        image: HERO_FALLBACK.image,
        alt: HERO_FALLBACK.alt,
      },
      ...fromCms,
    ];
  }, [data]);

  const [index, setIndex] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);

  const canRotate = slides.length > 1 && !reduced;
  const running = canRotate && !userPaused && !interacting;

  React.useEffect(() => {
    if (!running) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS
    );
    return () => clearTimeout(id);
  }, [running, index, slides.length]);

  // Don't advance in a background tab — it wastes work and desynchronises the
  // visible slide from the announced one.
  React.useEffect(() => {
    const onVisibility = () => setInteracting(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const go = React.useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const active = slides[index] ?? slides[0];

  return (
    <LazyMotion features={domAnimation}>
      {/* Pausing rotation on hover and focus is a WCAG 2.2.2 requirement, and
          it necessarily means listening for pointer events on the carousel
          region itself — the region is not, and must not become, a control. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <section
        aria-roledescription='carousel'
        aria-label='Featured journeys'
        onKeyDown={onKeyDown}
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={() => setInteracting(false)}
        className='relative isolate w-full overflow-hidden'>
        {/* Fixed-height box so nothing shifts as slides swap (CLS = 0). The
            height is the viewport minus the sticky 5rem header, so the whole
            hero — copy, CTAs and dots — is visible without scrolling. `svh`
            uses the small viewport height, which is the stable value on mobile
            browsers with collapsing toolbars. */}
        <div className='relative h-[calc(100svh-5rem)] min-h-[30rem] w-full'>
          {/* Slide 0 is always mounted and never animated out: it is the LCP
              element and must not be torn down and re-created. */}
          <Image
            src={HERO_FALLBACK.image}
            alt={HERO_FALLBACK.alt}
            fill
            priority
            fetchPriority='high'
            placeholder='blur'
            quality={72}
            sizes='100vw'
            className='object-top object-cover'
          />

          <AnimatePresence initial={false}>
            {index > 0 && (
              <m.div
                key={active.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT }}
                className='absolute inset-0'>
                <Image
                  src={active.image}
                  alt={active.alt}
                  fill
                  quality={72}
                  sizes='100vw'
                  className='object-top object-cover'
                />
              </m.div>
            )}
          </AnimatePresence>

          {/* Two scrims: a bottom-up one that guarantees AA contrast for the
              copy, and a left tint so bright skies don't wash out the CTAs. */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent' />

          <div className='site-container relative flex h-full items-end pb-20 lg:pb-24'>
            <div
              className='max-w-2xl text-white'
              aria-live='polite'
              aria-atomic='true'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/85'>
                Threescore Exquisite Ltd Tours
              </p>

              <AnimatePresence mode='wait' initial={false}>
                <m.div
                  key={active.key}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: EASE_OUT }}>
                  <h1 className='text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl'>
                    {active.title}
                  </h1>
                  <p className='mt-4 max-w-xl text-base text-white/95 sm:text-lg'>
                    {active.subtitle}
                  </p>
                </m.div>
              </AnimatePresence>

              <div className='mt-8 flex flex-wrap gap-3'>
                <Button asChild size='xl' variant='brand'>
                  <Link href='/packages'>Explore Packages</Link>
                </Button>
                <Button asChild size='xl' variant='onImage'>
                  <Link href='/contact'>Plan My Trip</Link>
                </Button>
              </div>
            </div>
          </div>

          {slides.length > 1 && (
            <div className='absolute bottom-5 right-4 flex items-center gap-3 sm:right-6 lg:right-8'>
              <div className='flex items-center gap-2'>
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    type='button'
                    onClick={() => go(i)}
                    aria-label={`Show slide ${i + 1} of ${slides.length}: ${s.title}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                      i === index
                        ? "w-7 bg-white"
                        : "w-2.5 bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>

              {canRotate && (
                <button
                  type='button'
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={
                    userPaused
                      ? "Resume automatic slide rotation"
                      : "Pause automatic slide rotation"
                  }
                  className='inline-flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
                  {userPaused ? (
                    <Play className='size-4' />
                  ) : (
                    <Pause className='size-4' />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
