import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import { ServiceCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { pageMetadata } from "@/lib/metadata";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Travel Services",
  description:
    "Air ticketing, car rental, safari tours, team building, hotel reservations and Airbnb arrangements — handled end to end from Nairobi.",
  path: "/services",
  keywords: [
    "air ticketing Nairobi",
    "car rental Kenya",
    "safari tours East Africa",
    "corporate team building Kenya",
    "hotel reservations Nairobi",
  ],
});

export default async function ServicesPage() {
  const services = await fetchQuery(api.services.getServices).catch(() => []);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      {/* Every service, as an itemised list search engines can read. */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Travel services by ${SITE_NAME}`,
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/services/${s.slug}`),
              name: s.title,
            })),
          }),
        }}
      />

      <Section size='loose'>
        <Reveal className='max-w-2xl'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            What we do
          </p>
          <h1 className='text-4xl font-semibold md:text-5xl'>
            Travel services, handled end to end
          </h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            Flights, vehicles, lodges, safaris and corporate retreats — arranged
            by a Nairobi team that has done it hundreds of times.
          </p>
        </Reveal>

        {services.length === 0 ? (
          <p className='mt-12 text-muted-foreground'>
            Our services are being updated. Please{" "}
            <Link href='/contact' className='text-primary underline'>
              get in touch
            </Link>{" "}
            and we&apos;ll help you directly.
          </p>
        ) : (
          <RevealGroup className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {services.map((service) => (
              <RevealItem key={service._id} className='h-full'>
                <ServiceCard service={service} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <Reveal className='mt-16 rounded-3xl bg-accent px-6 py-12 text-center sm:px-12'>
          <h2 className='text-2xl font-semibold md:text-3xl'>
            Not sure which you need?
          </h2>
          <p className='mx-auto mt-3 max-w-xl text-muted-foreground'>
            Tell us where you want to go and when. We&apos;ll put together the
            options and the costs.
          </p>
          <Button asChild size='xl' variant='brand' className='mt-7'>
            <Link href='/contact'>Talk to a travel consultant</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
