import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories & Tips",
  description:
    "Discover travel stories, destination guides, and expert tips for your East Africa adventure. From wildlife photography to cultural experiences, get inspired for your next journey.",
  keywords: [
    "travel blog East Africa",
    "safari tips",
    "Kenya travel guide",
    "Tanzania stories",
    "Uganda adventures",
    "wildlife photography tips",
    "travel inspiration",
    "destination guides",
    "cultural experiences",
    "adventure stories",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Stories & Tips — Threescore Tours",
    description:
      "Discover travel stories, destination guides, and expert tips for your East Africa adventure. Get inspired for your next journey.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Travel stories and tips from Threescore Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories & Tips — Threescore Tours",
    description:
      "Discover travel stories, destination guides, and expert tips for your East Africa adventure.",
    images: ["/opengraph-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
