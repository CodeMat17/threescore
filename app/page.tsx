import { HeroCarousel } from "@/components/site/HeroCarousel";
import {
  PopularDestinations,
  ServicesOverview,
  Testimonials,
  ValueProps,
} from "@/components/site/Sections";

export default function HomePage() {
  return (
    <div className='space-y-12 w-full max-w-6xl mx-auto'>
      <section className='container mx-auto max-w- px-4 pt-6'>
        <HeroCarousel />
      </section>
      <ValueProps />
      <PopularDestinations />
      <ServicesOverview />
      <Testimonials />
    </div>
  );
}
