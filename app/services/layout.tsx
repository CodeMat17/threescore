import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Services",
  description:
    "Comprehensive travel services including air ticketing, car rentals, safari tours, team building, hotel reservations, and Airbnb arrangements across East Africa and beyond.",
  keywords: [
    "travel services Kenya",
    "air ticketing East Africa",
    "safari car rental",
    "team building retreats",
    "hotel reservations Kenya",
    "Airbnb arrangements",
    "corporate travel services",
    "group travel planning",
    "travel logistics",
    "tourism services",
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Travel Services — Threescore Tours",
    description:
      "Comprehensive travel services including air ticketing, car rentals, safari tours, team building, and accommodation arrangements across East Africa.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Professional travel services with Threescore Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Services — Threescore Tours",
    description:
      "Comprehensive travel services including air ticketing, car rentals, safari tours, and team building across East Africa.",
    images: ["/opengraph-image.png"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
