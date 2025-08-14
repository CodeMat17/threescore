"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  BedDouble,
  Binoculars,
  Car,
  Home,
  Plane,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// const DETAILS: Record<ServiceSlug, ServiceDetail> = {
//   ticketing: {
//     slug: "ticketing",
//     title: "Air Ticketing",
//     shortDescription:
//       "Domestic and international flights with flexible fares and trusted carriers.",
//     longDescription:
//       "Whether you’re planning a quick regional hop or a complex multi‑city itinerary, our team scans global inventories to surface smart, wallet‑friendly options. We handle fare rules, baggage, seat selection, and schedule changes so you don’t have to. Need refundable or flexible tickets? We’ll advise on the best combinations and hold seats while you decide. From solo travelers to corporate groups, expect proactive support before, during, and after departure for a smooth, confidence‑building booking experience.",
//     highlights: [
//       "Best‑fare search across global inventory",
//       "Hold & flexible change support",
//       "Group and corporate bookings",
//     ],
//     Icon: Plane,
//     bookNow: "https://www.aviasales.com",
//   },
//   "car-rentals": {
//     slug: "car-rentals",
//     title: "Car Rentals",
//     shortDescription:
//       "Reliable vehicles for city rides, safaris, and events—chauffeur or self‑drive.",
//     longDescription:
//       "Choose from compact sedans, rugged 4x4 SUVs, vans, and premium models suited for errands, road trips, safaris, and VIP events. Every vehicle is well maintained, insured, and delivered clean and ready. Opt for self‑drive or a vetted chauffeur with local expertise. We arrange airport pickups, one‑way rentals, long‑term leases, child seats, and optional onboard Wi‑Fi. Travel comfortably and safely while we manage the logistics around your schedule and preferences.",
//     highlights: [
//       "Wide vehicle categories (sedan to 4x4)",
//       "Chauffeur or self‑drive options",
//       "Airport pickups & long‑term leases",
//     ],
//     bookNow: "",
//     Icon: Car,
//   },
//   "safari-tours": {
//     slug: "safari-tours",
//     title: "Safari Tours",
//     shortDescription:
//       "Curated safaris across East Africa with expert guides and tailor‑made itineraries.",
//     longDescription:
//       "Experience East Africa’s remarkable wilderness with itineraries that balance wildlife, landscapes, and culture. Track the Big Five with expert driver‑guides, time the Great Migration, and enjoy sunrise game drives and golden sundowners. We match you to boutique lodges and classic tented camps that fit comfort and budget. Private or small groups, photography or family‑friendly pacing—your safari is planned end‑to‑end with park fees, transfers, safety briefings, and responsive support from start to finish.",
//     highlights: [
//       "Private and group departures",
//       "Expert driver‑guides",
//       "Handpicked lodges & camps",
//     ],
//     bookNow: "",
//     Icon: Binoculars,
//   },
//   "team-building": {
//     slug: "team-building",
//     title: "Team Building",
//     shortDescription:
//       "Energizing retreats and corporate programs that build trust and performance.",
//     longDescription:
//       "Energize performance with expertly facilitated offsites that turn business objectives into memorable shared wins. We co‑design agendas, challenges, and reflection moments that build trust, communication, and accountability. Venues, transport, accommodation, catering, and permits are handled seamlessly, with options from urban adventures to nature retreats. Expect clear outcomes, inclusive participation, and risk‑managed activities. Afterward, receive a concise debrief with recommendations to sustain momentum and embed learning back at work.",
//     highlights: [
//       "Custom agendas & facilitation",
//       "Venues, logistics, and transport",
//       "Measurable team outcomes",
//     ],
//     bookNow: "",
//     Icon: UsersRound,
//   },
//   reservations: {
//     slug: "reservations",
//     title: "Hotel Reservations",
//     shortDescription:
//       "Handpicked stays—from boutique lodges to luxury resorts—at competitive rates.",
//     longDescription:
//       "Secure the right room, in the right neighborhood, at the right rate—without the guesswork. We compare trusted hotel partners for value, safety, and convenience, then negotiate perks such as flexible cancellation, early check‑in, breakfast, and upgrades where available. Business trip, family holiday, or group block, we coordinate invoices, special requests, and loyalty preferences. Expect transparent options, rapid confirmations, and attentive service from initial planning through checkout.",
//     highlights: [
//       "Global hotel partners",
//       "Corporate & group rates",
//       "Flexible policies",
//     ],
//     bookNow: "https://search.hotellook.com",
//     Icon: BedDouble,
//   },
//   "airbnb-arrangements": {
//     slug: "airbnb-arrangements",
//     title: "Airbnb Arrangements",
//     shortDescription:
//       "Comfortable, vetted apartments tailored to your travel style and budget.",
//     longDescription:
//       "Enjoy the comforts of home with vetted apartments and homes aligned to your budget, location, and style. We verify hosts, clarify house rules, and match amenities—kitchens, parking, workspaces, lifts, or pet‑friendly needs. Ideal for families, teams, and longer stays, options span studios to multi‑bedroom units near business hubs and attractions. We coordinate check‑ins, deposits, and support throughout your stay, ensuring clarity, safety, and peace of mind.",
//     highlights: [
//       "Verified hosts & properties",
//       "Prime locations",
//       "Stays for families & teams",
//     ],
//     bookNow: "",
//     Icon: Home,
//   },
// };

export default function ServiceDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const services = useQuery(api.services.getServices);
  const svc = (services ?? []).find((s) => s.slug === slug);

  const iconBySlug: Record<
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

  const Icon = slug ? (iconBySlug[slug] ?? Home) : Home;

  if (!slug) {
    return (
      <div className='container mx-auto space-y-8 px-4 py-10'>
        <header className='max-w-3xl space-y-3'>
          <h1 className='text-3xl font-bold md:text-4xl'>Service not found</h1>
          <p className='text-muted-foreground'>Missing service slug.</p>
        </header>
        <Button asChild>
          <Link href='/services'>Back to services</Link>
        </Button>
      </div>
    );
  }

  if (services === undefined) {
    return (
      <div className='container mx-auto space-y-8 px-4 py-10'>
        <header className='max-w-3xl space-y-3'>
          <div className='inline-flex size-14 items-center justify-center rounded-full border bg-card shadow-sm'>
            <span className='size-6 rounded bg-muted animate-pulse' />
          </div>
          <div className='h-8 w-1/2 rounded bg-muted animate-pulse' />
          <div className='h-4 w-2/3 rounded bg-muted animate-pulse' />
        </header>
        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='h-5 w-40 rounded bg-muted animate-pulse' />
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='h-4 w-full rounded bg-muted animate-pulse' />
              <div className='h-4 w-5/6 rounded bg-muted animate-pulse' />
              <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
            </CardContent>
          </Card>
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='h-5 w-44 rounded bg-muted animate-pulse' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='h-9 w-28 rounded bg-muted animate-pulse' />
                <div className='h-3 w-48 rounded bg-muted animate-pulse' />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className='h-5 w-48 rounded bg-muted animate-pulse' />
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='h-8 w-full rounded bg-muted animate-pulse' />
                <div className='h-8 w-full rounded bg-muted animate-pulse' />
                <div className='h-8 w-full rounded bg-muted animate-pulse' />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!svc) {
    return (
      <div className='container mx-auto space-y-8 px-4 py-10'>
        <header className='max-w-3xl space-y-3'>
          <h1 className='text-3xl font-bold md:text-4xl'>Service not found</h1>
          <p className='text-muted-foreground'>
            We couldn’t find a service for “{slug}”.
          </p>
        </header>
        <Button asChild>
          <Link href='/services'>Back to services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-8 px-4 py-10'>
      <header className='max-w-3xl space-y-3'>
        <div className='inline-flex size-14 items-center justify-center rounded-full border bg-card shadow-sm'>
          <Icon className='size-6' />
        </div>
        <h1 className='text-3xl font-bold md:text-4xl'>{svc.title}</h1>
        <p className='text-muted-foreground'>{svc.subtitle}</p>
      </header>

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>What&apos;s Included</CardTitle>
          </CardHeader>
          <CardContent className=''>
            <p className='leading-6 text-muted-foreground'>{svc.description}</p>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Ready to proceed?</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className=''>
                <Button asChild>
                  <Link href={`/contact`}>Inquire</Link>
                </Button>
              </div>
              <p className='text-xs text-muted-foreground'>
                Prefer a custom plan? Tell us what you need and we’ll tailor it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Explore More Services</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-2 text-sm'>
              {(services ?? [])
                .filter((d) => d.slug !== slug)
                .map((d) => (
                  <Link
                    key={d._id}
                    className='inline-flex items-center justify-between rounded-md border px-3 py-2 hover:bg-accent'
                    href={`/services/${d.slug}`}>
                    <span>{d.title}</span>
                    <span className='text-muted-foreground'>→</span>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
