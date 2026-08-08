import { HeroCarousel } from "@/components/site/HeroCarousel";
import {
  PopularDestinations,
  ServicesOverview,
  Testimonials,
  ValueProps,
} from "@/components/site/Sections";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";

// Marketing content changes rarely. `force-static` opts out of the dynamic
// rendering that Convex's `fetchQuery`/`preloadQuery` would otherwise trigger,
// so the page is prerendered at build and refreshed in the background every
// 5 minutes — a cached HTML response instead of a Convex round-trip per visit.
export const dynamic = "force-static";
export const revalidate = 300;

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
  alternates: { canonical: "/" },
  openGraph: {
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Discover celebrated safaris, beach escapes, and adventure tours across Kenya, Tanzania, Uganda, and Dubai. Expert guides and unforgettable experiences.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Discover award-winning safaris, beach escapes, and adventure tours across Kenya, Tanzania, Uganda, and Dubai.",
  },
};

export default async function HomePage() {
  const preloadedSlides = await preloadQuery(api.carousel.getCarousel);

  return (
    <>
      <HeroCarousel preloadedSlides={preloadedSlides} />
      <ValueProps />
      <PopularDestinations />
      <ServicesOverview />
      <Testimonials />
    </>
  );
}
