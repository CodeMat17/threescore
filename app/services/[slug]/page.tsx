import {
  BreadcrumbStructuredData,
  ServiceStructuredData,
} from "@/components/StructuredData";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import {
  ArrowRight,
  BedDouble,
  Binoculars,
  Car,
  Home,
  Plane,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "air-ticketing": Plane,
  "car-rentals": Car,
  "safari-tours": Binoculars,
  "team-building": UsersRound,
  "hotel-reservations": BedDouble,
  "airbnb-arrangements": Home,
};

async function getServices() {
  return fetchQuery(api.services.getServices).catch(() => []);
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServices()).find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service not found",
      robots: { index: false, follow: true },
    };
  }

  // Descriptions come from the CMS rather than the hardcoded lookup table
  // this file used to carry, which drifted from the actual service records.
  const description = service.description.slice(0, 158);

  return {
    title: service.title,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.title,
      description,
      type: "website",
      url: `/services/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  const Icon = ICONS[slug] ?? Home;
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <ServiceStructuredData
        title={service.title}
        description={service.description}
        url={`/services/${slug}`}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.title, url: `/services/${slug}` },
        ]}
      />

      <Section size='loose'>
        <header className='max-w-3xl'>
          <span className='inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground ring-1 ring-primary/15'>
            <Icon className='size-6' />
          </span>
          <h1 className='mt-6 text-4xl font-semibold md:text-5xl'>
            {service.title}
          </h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            {service.subtitle}
          </p>
        </header>

        <div className='mt-12 grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>What&apos;s included</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='leading-7 text-muted-foreground'>
                {service.description}
              </p>
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card className='bg-accent'>
              <CardHeader>
                <CardTitle>Ready to proceed?</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button asChild variant='brand' className='w-full'>
                  <Link href='/contact'>Send an inquiry</Link>
                </Button>
                <p className='text-xs text-muted-foreground'>
                  Prefer a custom plan? Tell us what you need and we&apos;ll
                  tailor it.
                </p>
              </CardContent>
            </Card>

            {others.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Other services</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-2 text-sm'>
                  {others.map((s) => (
                    <Link
                      key={s._id}
                      href={`/services/${s.slug}`}
                      className='inline-flex items-center justify-between rounded-md border px-3 py-2 transition-colors hover:bg-accent'>
                      <span>{s.title}</span>
                      <ArrowRight
                        className='size-4 text-muted-foreground'
                        aria-hidden
                      />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
