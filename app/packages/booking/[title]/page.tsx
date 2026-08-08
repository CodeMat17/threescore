import {
  BreadcrumbStructuredData,
  TripStructuredData,
} from "@/components/StructuredData";
import BookingForm from "@/components/booking/BookingForm";
import { Section } from "@/components/site/Section";
import { api } from "@/convex/_generated/api";
import { pageMetadata } from "@/lib/metadata";
import { fetchQuery } from "convex/nextjs";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ title?: string }>;
  searchParams: Promise<{ price?: string }>;
};

function decode(raw: string) {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

async function findPackage(title: string) {
  const packages = await fetchQuery(api.packages.getPackages).catch(() => []);
  return packages.find((p) => p.title === title) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { title } = await params;
  if (!title) return { title: "Book your trip" };

  const decoded = decode(title);
  const pkg = await findPackage(decoded);

  // Dynamic routes had no `generateMetadata` at all, so every booking page
  // shared the site-wide title and description.
  return pageMetadata({
    title: pkg ? `Book ${pkg.title}` : `Book ${decoded}`,
    description: pkg
      ? `Reserve the ${pkg.days}-day ${pkg.title} package in ${pkg.destination} from $${pkg.price.toLocaleString("en-US")} per person. Confirmed by our Nairobi team.`
      : `Reserve the ${decoded} package with Threescore Exquisite Ltd Tours.`,
    path: `/packages/booking/${title}`,
  });
}

export default async function PackageBookingPage({
  params,
  searchParams,
}: PageProps) {
  const { title } = await params;
  const { price } = await searchParams;
  if (!title) notFound();

  const decoded = decode(title);
  const pkg = await findPackage(decoded);

  // Prefer the authoritative price from the database over the query string,
  // which anyone can edit.
  const parsedPrice = price ? Number(price) : undefined;
  const priceFromUsd =
    pkg?.price ??
    (Number.isFinite(parsedPrice) ? (parsedPrice as number) : undefined);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Packages", url: "/packages" },
          { name: decoded, url: `/packages/booking/${title}` },
        ]}
      />
      {pkg && (
        <TripStructuredData
          title={pkg.title}
          image={pkg.image}
          price={pkg.price}
          days={pkg.days}
          destination={pkg.destination}
          url={`/packages/booking/${title}`}
        />
      )}

      <Section size='loose' className='max-w-4xl'>
        <header>
          <h1 className='text-4xl font-semibold md:text-5xl'>
            Book {decoded}
          </h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            Complete the form and we&apos;ll confirm availability and the final
            price by email or phone. Nothing is charged at this stage.
          </p>
        </header>

        {pkg && (
          <div className='mt-8 flex flex-col gap-5 overflow-hidden rounded-2xl border bg-card sm:flex-row'>
            <div className='relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-56'>
              <Image
                src={pkg.image}
                alt={`${pkg.title} — ${pkg.destination}`}
                fill
                priority
                sizes='(min-width: 640px) 224px, 100vw'
                className='object-cover'
              />
            </div>
            <div className='flex flex-col justify-center gap-3 p-5 sm:pl-0'>
              <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground'>
                <span className='inline-flex items-center gap-1.5'>
                  <MapPin className='size-4 text-primary' aria-hidden />
                  {pkg.destination}
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <CalendarDays className='size-4 text-primary' aria-hidden />
                  {pkg.days} {pkg.days === 1 ? "day" : "days"}
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <ShieldCheck className='size-4 text-primary' aria-hidden />
                  No payment required now
                </span>
              </div>
              <p className='text-2xl font-semibold'>
                ${pkg.price.toLocaleString("en-US")}
                <span className='ml-1 text-sm font-normal text-muted-foreground'>
                  per person
                </span>
              </p>
              <ul className='list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                {pkg.highlight.slice(0, 3).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className='mt-10'>
          <BookingForm pkg={decoded} priceFromUsd={priceFromUsd} />
        </div>
      </Section>
    </>
  );
}
