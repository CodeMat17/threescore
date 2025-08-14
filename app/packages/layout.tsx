import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Packages",
  description:
    "Explore our curated travel packages across Kenya, Tanzania, Uganda, and Dubai. From budget safaris to luxury experiences, discover the perfect adventure for you.",
  keywords: [
    "Kenya safari packages",
    "Tanzania tour packages",
    "Uganda gorilla packages",
    "Dubai holiday packages",
    "Maasai Mara safari",
    "Serengeti tours",
    "Bwindi gorilla trekking",
    "East Africa travel deals",
    "wildlife tour packages",
    "beach safari combinations",
  ],
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Travel Packages — Threescore Tours",
    description:
      "Explore our curated travel packages across Kenya, Tanzania, Uganda, and Dubai. From budget safaris to luxury experiences, find your perfect adventure.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Discover amazing travel packages with Threescore Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Packages — Threescore Tours",
    description:
      "Explore our curated travel packages across Kenya, Tanzania, Uganda, and Dubai. From budget safaris to luxury experiences.",
    images: ["/opengraph-image.png"],
  },
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
