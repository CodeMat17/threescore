/**
 * Single source of truth for the canonical origin.
 *
 * Previously each consumer re-derived this, and `StructuredData.tsx` fell back
 * to `https://example.com` — which shipped placeholder URLs into the JSON-LD
 * whenever the env var was missing at build time.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://threescoretours.com"
).replace(/\/$/, "");

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE_NAME = "Threescore Tours";
export const LEGAL_NAME = "Threescore Exquisite Collections Ltd";
export const SITE_DESCRIPTION =
  "Threescore Exquisite Ltd Tours crafts unforgettable safaris, beach escapes, and international trips across Kenya, East Africa, and beyond.";
