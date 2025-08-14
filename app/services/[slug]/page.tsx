import type { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";

// Generate metadata for dynamic service pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Service titles for metadata
  const serviceData: Record<string, { title: string; description: string }> = {
    "air-ticketing": {
      title: "Air Ticketing Services",
      description:
        "Professional air ticketing services for domestic and international flights. Best fares, flexible options, and expert support for all your travel needs.",
    },
    "car-rentals": {
      title: "Car Rental Services",
      description:
        "Reliable car rental services with a wide range of vehicles. Self-drive or chauffeur options for safaris, city tours, and business travel.",
    },
    "safari-tours": {
      title: "Safari Tours",
      description:
        "Expert-guided safari tours across East Africa. Experience the Big Five, Great Migration, and breathtaking landscapes with our professional guides.",
    },
    "team-building": {
      title: "Team Building Services",
      description:
        "Corporate team building retreats and activities. Strengthen your team with adventure-based programs and professional facilitation.",
    },
    "hotel-reservations": {
      title: "Hotel Reservations",
      description:
        "Professional hotel booking services with competitive rates. From luxury resorts to budget accommodations across East Africa and beyond.",
    },
    "airbnb-arrangements": {
      title: "Airbnb Arrangements",
      description:
        "Curated Airbnb and vacation rental arrangements. Comfortable, verified properties for families, groups, and extended stays.",
    },
  };

  const service = serviceData[slug] || {
    title: "Travel Service",
    description: "Professional travel services with Threescore Tours.",
  };

  return {
    title: service.title,
    description: service.description,
    keywords: [
      slug.replace("-", " "),
      "travel services Kenya",
      "East Africa travel",
      "professional travel support",
      "tourism services",
    ],
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} — Threescore Tours`,
      description: service.description,
      type: "website",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${service.title} with Threescore Tours`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} — Threescore Tours`,
      description: service.description,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}
