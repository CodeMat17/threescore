import ContactClient from "@/components/contact/ContactClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Threescore Tours for your East Africa adventure. Plan your safari, book travel services, or ask about custom itineraries. We're here to help create your perfect journey.",
  keywords: [
    "contact Threescore Tours",
    "safari booking Kenya",
    "travel planning East Africa",
    "tour operator contact",
    "custom travel itinerary",
    "safari consultation",
    "travel inquiry",
    "book safari Kenya",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us — Threescore Tours",
    description:
      "Get in touch with Threescore Tours for your East Africa adventure. Plan your safari, book travel services, or create custom itineraries.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Threescore Tours for your East Africa adventure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Threescore Tours",
    description:
      "Get in touch with Threescore Tours for your East Africa adventure. Plan your safari or book travel services.",
    images: ["/opengraph-image.png"],
  },
};

export default function ContactPage() {
  return (
    <Suspense>
      <ContactClient />
    </Suspense>
  );
}
