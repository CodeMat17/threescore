import heroImage from "@/assets/hero-1.jpg";

/**
 * The always-available first hero slide.
 *
 * Bundled as a static import so Next emits it with a content hash, an
 * immutable cache header and an inlined base64 `blurDataURL` — the LCP image
 * is therefore never blocked on a Convex round-trip. The remaining slides stay
 * fully CMS-managed; this one is the floor, not the ceiling.
 *
 * Source: the first `heroCarousel` entry, re-encoded to 1824px / mozjpeg q72
 * (520kb -> 107kb).
 */
export const HERO_FALLBACK = {
  image: heroImage,
  title: "Fly Beyond Borders",
  subtitle:
    "Book affordable air tickets today and explore the world your way — safaris, beach escapes and international journeys, arranged end to end.",
  alt: "Aircraft wing above the clouds at sunrise, departing on an international journey",
} as const;
