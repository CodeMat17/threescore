import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { Section, SectionHeader } from "@/components/site/Section";
import { PackageCard, ServiceCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { testimonials } from "@/lib/data";
import { scaleIn } from "@/lib/motion";
import { fetchQuery } from "convex/nextjs";
import { Compass, HeartHandshake, LifeBuoy, Star } from "lucide-react";
import Link from "next/link";

/**
 * Homepage sections.
 *
 * These are all **server** components. They previously lived behind
 * `"use client"` + `useQuery`, which meant crawlers and first paint saw only
 * pulsing skeletons — the site's single largest SEO problem. Data now resolves
 * during the server render via `fetchQuery`; only the scroll-reveal wrappers
 * (`Reveal`) cross into the client.
 */

const VALUE_PROPS = [
  {
    icon: Compass,
    title: "Local Expertise",
    description:
      "Nairobi-based and East-Africa-native. We know every hidden gem from the Maasai Mara to Diani Beach — and the right week to see it.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Itineraries",
    description:
      "No fixed departures you have to squeeze into. Every trip is built around your style, pace, and budget.",
  },
  {
    icon: LifeBuoy,
    title: "Reliable Support",
    description:
      "From first inquiry to the flight home, a real person on our team is always one message away.",
  },
];

export function ValueProps() {
  return (
    <Section aria-labelledby='why-us'>
      <h2 id='why-us' className='sr-only'>
        Why travel with Threescore
      </h2>
      <RevealGroup className='grid gap-6 md:grid-cols-3'>
        {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
          <RevealItem key={title} className='h-full'>
            <Card className='h-full border-border/70 transition-colors hover:border-primary/40'>
              <CardHeader>
                <span className='mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-primary/15'>
                  <Icon className='size-5' aria-hidden />
                </span>
                <CardTitle className='text-lg'>{title}</CardTitle>
                <CardDescription className='mt-1 text-[0.95rem]/6'>
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export async function PopularDestinations() {
  const packages = await fetchQuery(api.packages.getPackages).catch(() => []);
  const featured = packages.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <Section aria-labelledby='popular-destinations'>
      <Reveal>
        <SectionHeader
          title={
            <span id='popular-destinations'>Popular journeys this season</span>
          }
          description='Hand-picked itineraries our travellers come back for.'
          action={
            <Button asChild variant='brand' size='lg'>
              <Link href='/packages'>View all packages</Link>
            </Button>
          }
        />
      </Reveal>

      <RevealGroup className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {featured.map((pkg) => (
          <RevealItem key={pkg._id} className='h-full'>
            <PackageCard pkg={pkg} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export async function ServicesOverview() {
  const services = await fetchQuery(api.services.getServices).catch(() => []);

  if (services.length === 0) return null;

  return (
    <Section aria-labelledby='our-services' className='rounded-3xl bg-muted/40'>
      <Reveal>
        <SectionHeader
          title={<span id='our-services'>Everything, handled</span>}
          description='From air tickets to team building, we take the trip end to end.'
          action={
            <Button asChild variant='brand' size='lg'>
              <Link href='/services'>Explore services</Link>
            </Button>
          }
        />
      </Reveal>

      <RevealGroup className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {services.map((service) => (
          <RevealItem key={service._id} className='h-full'>
            <ServiceCard service={service} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function Testimonials() {
  return (
    <Section aria-labelledby='testimonials'>
      <Reveal>
        <SectionHeader
          title={<span id='testimonials'>What our travellers say</span>}
          description='A few words from people we have sent out into the world.'
        />
      </Reveal>

      <RevealGroup className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {testimonials.map((t) => (
          <RevealItem key={t.id} className='h-full' variants={scaleIn}>
            <Card className='h-full'>
              <CardHeader>
                <div
                  className='flex gap-0.5 text-primary'
                  role='img'
                  aria-label={`Rated ${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className='size-4 fill-current' aria-hidden />
                  ))}
                </div>
                <CardTitle className='mt-3 text-base'>{t.name}</CardTitle>
                <CardDescription>{t.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <blockquote className='text-muted-foreground'>
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
