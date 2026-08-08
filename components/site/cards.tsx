import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItineraryPopover } from "@/components/site/ItineraryPopover";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BedDouble,
  Binoculars,
  CalendarDays,
  Car,
  Home,
  MapPin,
  Plane,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type PackageLike = {
  _id: string;
  title: string;
  destination: string;
  price: number;
  days: number;
  highlight: string[];
  itinerary?: string[];
  image: string;
};

/**
 * The package tile, shared by the homepage and `/packages`. Previously each
 * page carried its own near-identical copy of this markup.
 */
export function PackageCard({
  pkg,
  priority = false,
  className,
}: {
  pkg: PackageLike;
  /** Set on above-the-fold cards only. */
  priority?: boolean;
  className?: string;
}) {
  const bookingHref = `/packages/booking/${encodeURIComponent(pkg.title)}?price=${pkg.price}`;

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl py-0 gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}>
      <div className='relative aspect-[16/10] w-full overflow-hidden'>
        <Image
          src={pkg.image}
          alt={`${pkg.title} — ${pkg.destination}`}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className='object-cover transition-transform duration-700 group-hover:scale-[1.06]'
          sizes='(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent' />
        <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur'>
          <MapPin className='size-3.5 text-primary' aria-hidden />
          {pkg.destination}
        </span>
        <span className='absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur'>
          <CalendarDays className='size-3.5' aria-hidden />
          {pkg.days} {pkg.days === 1 ? "day" : "days"}
        </span>
      </div>

      <CardHeader className='gap-1 pt-5'>
        <CardTitle className='text-base leading-snug'>{pkg.title}</CardTitle>
        <CardDescription>
          From{" "}
          <span className='font-semibold text-foreground'>
            ${pkg.price.toLocaleString("en-US")}
          </span>{" "}
          per person
        </CardDescription>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col pb-6'>
        <ul className='mb-5 flex-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
          {pkg.highlight.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className='flex items-center gap-3'>
          <Button asChild size='sm' variant='brand'>
            <Link href={bookingHref}>
              Book
              <ArrowRight
                className='transition-transform group-hover:translate-x-0.5'
                aria-hidden
              />
            </Link>
          </Button>
          <ItineraryPopover title={pkg.title} itinerary={pkg.itinerary ?? []} />
        </div>
      </CardContent>
    </Card>
  );
}

const SERVICE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "air-ticketing": Plane,
  "car-rentals": Car,
  "safari-tours": Binoculars,
  "team-building": UsersRound,
  "hotel-reservations": BedDouble,
  "airbnb-arrangements": Home,
};

export type ServiceLike = {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
};

/**
 * Service tile. The per-slug rainbow gradient map was dropped in favour of the
 * brand accent, so services read as one family rather than six unrelated apps.
 */
export function ServiceCard({ service }: { service: ServiceLike }) {
  const Icon = SERVICE_ICONS[service.slug] ?? Home;

  return (
    <Card className='group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <CardHeader>
        <span className='mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-105'>
          <Icon className='size-5' />
        </span>
        <CardTitle className='leading-tight'>
          <Link
            href={`/services/${service.slug}`}
            className='after:absolute after:inset-0 hover:text-primary'>
            {service.title}
          </Link>
        </CardTitle>
        <CardDescription className='mt-1'>{service.subtitle}</CardDescription>
      </CardHeader>
    </Card>
  );
}
