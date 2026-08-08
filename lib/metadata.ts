import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

/**
 * Build a page's metadata from the few fields that actually differ.
 *
 * Three route layouts previously carried ~50 lines each of near-identical
 * metadata, including hand-listed OG images. Open Graph images now come from
 * the `app/opengraph-image.tsx` file convention, which nested routes inherit
 * automatically, so they don't need restating here.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description,
      type,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}
