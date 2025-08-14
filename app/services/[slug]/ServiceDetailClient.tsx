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

export default function ServiceDetailClient({ slug }: { slug: string }) {
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
            We couldn't find a service for "{slug}".
          </p>
        </header>
        <Button asChild>
          <Link href='/services'>Back to services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container max-w-6xl mx-auto space-y-8 px-4 py-10'>
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
                Prefer a custom plan? Tell us what you need and we'll tailor it.
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
