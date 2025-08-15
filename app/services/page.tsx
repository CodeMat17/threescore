"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
// import { services } from "@/lib/data";
import Link from "next/link";

export default function ServicesPage() {
  const services = useQuery(api.services.getServices);

  return (
    <div className=' mx-auto space-y-8 px-4 md:px-8 lg:px-12 py-10'>
      <div className='max-w-2xl'>
        <h1 className='text-3xl font-bold md:text-4xl'>Services</h1>
        <p className='mt-2 text-muted-foreground'>
          Core travel solutions tailored for you.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {services === undefined ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className='overflow-hidden'>
              <CardHeader>
                <div className='h-5 w-2/3 rounded bg-muted animate-pulse' />
                <div className='mt-2 h-4 w-1/2 rounded bg-muted animate-pulse' />
              </CardHeader>
              <CardContent>
                <div className='flex gap-2'>
                  <div className='h-9 w-20 rounded bg-muted animate-pulse' />
                  <div className='h-9 w-24 rounded bg-muted animate-pulse' />
                </div>
              </CardContent>
            </Card>
          ))
        ) : services.length < 1 ? (
          <Card className='col-span-full'>
            <CardHeader>
              <CardTitle>No services available</CardTitle>
              <CardDescription>Please check back later.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          services.map((s) => (
            <Card key={s._id}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2'>
                  <Button asChild size='sm'>
                    <Link href={`/contact`}>Inquire</Link>
                  </Button>
                  <Button asChild size='sm' variant='outline'>
                    <Link href={`/services/${s.slug}`}>Explore</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
