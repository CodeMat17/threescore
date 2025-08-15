import { HeroCarousel } from "@/components/site/HeroCarousel";
import {
  PopularDestinations,
  ServicesOverview,
  Testimonials,
  ValueProps,
} from "@/components/site/Sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover celebrated safaris, beach escapes, and adventure tours across Kenya, Tanzania, Uganda, and Dubai. Expert guides, personalized itineraries, and unforgettable wildlife experiences await.",
  keywords: [
    "safari tours Kenya",
    "Tanzania wildlife",
    "Uganda gorilla trekking",
    "Dubai vacation packages",
    "Maasai Mara tours",
    "African adventure travel",
    "beach holidays East Africa",
    "wildlife photography tours",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Discover celebrated safaris, beach escapes, and adventure tours across Kenya, Tanzania, Uganda, and Dubai. Expert guides and unforgettable experiences.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Experience the best of East Africa with Threescore Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Discover award-winning safaris, beach escapes, and adventure tours across Kenya, Tanzania, Uganda, and Dubai.",
    images: ["/opengraph-image.png"],
  },
};

export default function HomePage() {
  return (
    <div className='space-y-12 w-full mx-auto'>
      <section className=' mx-auto'>
        <HeroCarousel />
      </section>
      <ValueProps />
      <PopularDestinations />
      <ServicesOverview />
      <Testimonials />
    </div>
  );
}
