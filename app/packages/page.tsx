import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { DestinationFilter } from "@/components/site/Filters";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { PackageCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { pageMetadata } from "@/lib/metadata";
import { LEGAL_NAME, absoluteUrl } from "@/lib/site";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Tour Packages",
  description:
    "Curated safari, beach and city packages across Kenya, Tanzania, Uganda and Dubai — costed, planned and supported by our Nairobi team.",
  path: "/packages",
  keywords: [
    "Kenya safari packages",
    "Tanzania tour packages",
    "Uganda gorilla trekking",
    "Dubai holiday packages",
    "Maasai Mara safari",
    "East Africa tours",
  ],
});

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination } = await searchParams;
  const packages = await fetchQuery(api.packages.getPackages).catch(() => []);

  const destinations = Array.from(
    new Set(packages.map((p) => p.destination))
  ).sort();

  // Filtering happens here, in the server render, so the browser never
  // receives the full package list just to narrow it down.
  const filtered = destination
    ? packages.filter((p) => p.destination === destination)
    : packages;

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Packages", url: "/packages" },
        ]}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Tour packages by ${LEGAL_NAME}`,
            numberOfItems: filtered.length,
            itemListElement: filtered.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: absoluteUrl(
                `/packages/booking/${encodeURIComponent(p.title)}`
              ),
            })),
          }),
        }}
      />

      <Section size='loose'>
        <Reveal className='max-w-2xl'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            Curated journeys
          </p>
          <h1 className='text-4xl font-semibold md:text-5xl'>Tour packages</h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            Trips across Kenya, Uganda, Tanzania and Dubai — each one costed,
            planned and supported by our Nairobi team.
          </p>
        </Reveal>

        <div className='mt-10 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between'>
          <DestinationFilter options={destinations} value={destination} />
          <p
            className='text-sm text-muted-foreground'
            role='status'
            aria-live='polite'>
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "package" : "packages"}
            {destination ? ` in ${destination}` : ""}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className='mt-12 rounded-2xl border border-dashed p-12 text-center'>
            <h2 className='text-lg font-semibold'>No packages here yet</h2>
            <p className='mt-2 text-muted-foreground'>
              {destination
                ? "Try another destination, or tell us where you'd like to go."
                : "New itineraries are on the way — tell us what you have in mind."}
            </p>
            <Button asChild variant='brand' className='mt-6'>
              <Link href='/contact'>Plan a custom trip</Link>
            </Button>
          </div>
        ) : (
          <RevealGroup className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filtered.map((pkg, i) => (
              <RevealItem key={pkg._id} className='h-full'>
                {/* The first row is above the fold on most viewports. */}
                <PackageCard pkg={pkg} priority={i < 4} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <Reveal className='mt-16 overflow-hidden rounded-3xl bg-accent px-6 py-12 sm:px-12'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl font-semibold md:text-3xl'>
              Want something that isn&apos;t on this list?
            </h2>
            <p className='mt-3 text-muted-foreground'>
              Most of our trips start as a custom request. Tell us the dates,
              the budget and who&apos;s travelling — we&apos;ll build it.
            </p>
            <Button asChild size='xl' variant='brand' className='mt-7'>
              <Link href='/contact'>Start planning</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
