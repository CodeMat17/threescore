import AboutUsContent from "@/components/AboutUsContent";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Threescore Tours, East Africa's premier tour operator. Our story, mission, and commitment to creating unforgettable safari and travel experiences since our founding.",
  keywords: [
    "about Threescore Tours",
    "East Africa tour operator",
    "safari company Kenya",
    "travel company history",
    "professional tour guides",
    "sustainable tourism",
    "local expertise",
    "award winning tours",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — Threescore Tours",
    description:
      "Learn about Threescore Tours, East Africa's premier tour operator. Our story, mission, and commitment to creating unforgettable experiences.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "About Threescore Tours - East Africa's premier tour operator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Threescore Tours",
    description:
      "Learn about Threescore Tours, East Africa's premier tour operator and our commitment to unforgettable experiences.",
    images: ["/opengraph-image.png"],
  },
};

export default function AboutPage() {
  return <AboutUsContent />;
}
