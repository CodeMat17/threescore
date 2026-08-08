import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { Section, SectionHeader } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import {
  Award,
  Globe2,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * The About page body.
 *
 * Converted from a client component with four parallel `useQuery` calls (and
 * four hand-written skeleton branches) to a single server render. All CMS copy
 * is now in the server HTML, which is what a crawler indexes.
 */

const CHOOSE_US_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Local Roots, Global Reach": Globe2,
  "Tailor‑Made Itineraries": MapPinned,
  "Trust & Safety": ShieldCheck,
  "For Families & Teams": Users2,
  "Beautiful Moments": Sparkles,
  "Pro Service, Every Time": Award,
};

const STRENGTHS = [
  {
    title: "Excellence",
    description:
      "Every lodge, vehicle and guide we book is one we would use ourselves. No surprises on arrival.",
  },
  {
    title: "Authenticity",
    description:
      "Itineraries built by people who live here, not assembled from a brochure.",
  },
  {
    title: "Sustainability",
    description:
      "We work with conservancies and operators that keep tourism revenue in local communities.",
  },
];

export default async function AboutUsContent() {
  // One round of parallel server fetches instead of four client subscriptions.
  const [aboutHero, whoWeAre, whatWeOffer, chooseUs] = await Promise.all([
    fetchQuery(api.aboutHero.getAboutHero).catch(() => null),
    fetchQuery(api.whoWeAre.getWhoWeAre).catch(() => null),
    fetchQuery(api.whatWeOffer.getWhatWeOffer).catch(() => null),
    fetchQuery(api.whyChooseUs.getWhyChooseUs).catch(() => null),
  ]);

  return (
    <>
      <Section size='loose'>
        <div className='grid items-center gap-10 lg:grid-cols-2'>
          <Reveal>
            <span className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground'>
              <Award className='size-3.5 text-primary' aria-hidden />
              Acclaimed adventure experiences
            </span>
            <h1 className='mt-5 text-4xl font-semibold leading-tight md:text-5xl'>
              {aboutHero?.title ?? "About Threescore"}
            </h1>
            <p className='mt-5 text-lg leading-relaxed text-muted-foreground'>
              {aboutHero?.description ??
                "A Nairobi-based tour operator crafting safaris, beach escapes and international journeys across East Africa and beyond."}
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='xl' variant='brand'>
                <Link href='/packages'>Explore packages</Link>
              </Button>
              <Button asChild size='xl' variant='outline'>
                <Link href='/contact'>Plan your trip</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg'>
              {aboutHero?.image ? (
                <Image
                  src={aboutHero.image}
                  // Derived from the CMS record rather than the previous
                  // hardcoded "Safari jeep overlooking savannah at golden
                  // hour", which described an image nobody guaranteed.
                  alt={aboutHero.title}
                  fill
                  priority
                  fetchPriority='high'
                  className='object-cover'
                  sizes='(min-width: 1024px) 640px, 100vw'
                />
              ) : (
                <div className='absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground'>
                  Image coming soon
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section size='tight'>
        <RevealGroup className='grid gap-6 lg:grid-cols-2'>
          <RevealItem>
            <div className='h-full rounded-2xl border bg-accent/40 p-8 md:p-10'>
              <h2 className='text-2xl font-semibold'>
                {whoWeAre?.title ?? "Who we are"}
              </h2>
              <p className='mt-4 leading-7 text-muted-foreground'>
                {whoWeAre?.body ??
                  "We are updating this section. Please check back soon."}
              </p>
            </div>
          </RevealItem>

          <RevealItem>
            <div className='h-full rounded-2xl border bg-accent/40 p-8 md:p-10'>
              <h2 className='text-2xl font-semibold'>
                {whatWeOffer?.title ?? "What we offer"}
              </h2>
              {whatWeOffer?.items?.length ? (
                <ul className='mt-4 space-y-2 text-muted-foreground'>
                  {whatWeOffer.items.map((item: string) => (
                    <li key={item} className='flex gap-2'>
                      <span className='mt-2 size-1.5 shrink-0 rounded-full bg-primary' />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='mt-4 text-muted-foreground'>
                  Details will appear here soon.
                </p>
              )}
            </div>
          </RevealItem>
        </RevealGroup>
      </Section>

      {chooseUs?.items?.length ? (
        <Section>
          <Reveal>
            <SectionHeader
              title='Why choose us'
              description='What travellers tell us makes the difference.'
            />
          </Reveal>
          <RevealGroup className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {chooseUs.items.map((choose) => {
              const Icon = CHOOSE_US_ICONS[choose.title] ?? Sparkles;
              return (
                <RevealItem key={choose.title} className='h-full'>
                  <Card className='h-full transition-colors hover:border-primary/40'>
                    <CardContent className='flex h-full items-start gap-4 p-4'>
                      <span className='inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-primary/15'>
                        <Icon className='size-5' aria-hidden />
                      </span>
                      <div>
                        <h3 className='text-lg font-semibold'>
                          {choose.title}
                        </h3>
                        <p className='mt-1 text-muted-foreground'>
                          {choose.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Section>
      ) : null}

      <Section size='loose'>
        <Reveal>
          <SectionHeader
            title='Our strength'
            description='Three things we hold ourselves to on every trip.'
          />
        </Reveal>
        <RevealGroup className='grid gap-6 md:grid-cols-3'>
          {STRENGTHS.map((s) => (
            <RevealItem key={s.title} className='h-full'>
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle className='text-xl'>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>{s.description}</p>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
