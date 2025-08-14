"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function PackagesPage() {
  const packages = useQuery(api.packages.getPackages);
  const [selectedLocation, setSelectedLocation] = React.useState<
    string | undefined
  >(undefined);

  const destinationOptions = React.useMemo(() => {
    if (packages === undefined) return [] as string[];
    return Array.from(new Set(packages.map((p) => p.destination))).sort();
  }, [packages]);

  const filteredPackages = React.useMemo(() => {
    if (packages === undefined) return undefined;
    if (!selectedLocation) return packages;
    return packages.filter((p) => p.destination === selectedLocation);
  }, [packages, selectedLocation]);

  return (
    <div className='container max-w-6xl mx-auto space-y-8 px-4 py-10'>
      <div className='max-w-2xl'>
        <h1 className='bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl'>
          Packages
        </h1>
        <p className='mt-2 text-muted-foreground'>
          Explore curated trips across Kenya, Uganda, Tanzania, and Dubai. More
          to come.
        </p>
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex w-full items-baseline-last justify-between gap-4 sm:justify-start'>
          <div className='w-full max-w-md'>
            <p className='text-sm text-muted-foreground mb-1'>
              Filter by location
            </p>
            <Select
              value={selectedLocation ?? "__all__"}
              onValueChange={(v) =>
                setSelectedLocation(v === "__all__" ? undefined : v)
              }>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='All locations' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='__all__'>All locations</SelectItem>
                {destinationOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='text-xs text-muted-foreground'>
            {filteredPackages === undefined ? "—" : filteredPackages.length}{" "}
            package
            {filteredPackages !== undefined && filteredPackages.length === 1
              ? ""
              : "s"}
          </div>
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredPackages === undefined ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className='group flex h-full min-h-[26rem] flex-col overflow-hidden rounded-xl border shadow-sm'>
              <div className='relative h-44 w-full overflow-hidden bg-muted animate-pulse' />
              <CardHeader className='pb-2'>
                <div className='h-5 w-4/5 rounded bg-muted animate-pulse' />
                <div className='mt-2 h-4 w-1/3 rounded bg-muted animate-pulse' />
              </CardHeader>
              <CardContent className='flex flex-col gap-3 pt-0 flex-1'>
                <div className='h-4 w-1/2 rounded bg-muted animate-pulse' />
                <div className='space-y-2 flex-1'>
                  <div className='h-3 w-5/6 rounded bg-muted animate-pulse' />
                  <div className='h-3 w-2/3 rounded bg-muted animate-pulse' />
                  <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
                </div>
                <div className='mt-1 flex items-center gap-2'>
                  <div className='h-9 w-24 rounded bg-muted animate-pulse' />
                  <div className='h-9 w-24 rounded bg-muted animate-pulse' />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredPackages.length < 1 ? (
          <Card className='col-span-full'>
            <CardHeader>
              <CardTitle>No packages available</CardTitle>
              <CardDescription>Please check back later.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          filteredPackages.map((pkg) => (
            <Card
              key={pkg._id}
              className='group flex h-full min-h-[26rem] flex-col overflow-hidden rounded-xl border shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg'>
              <div className='relative h-44 w-full overflow-hidden'>
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
                <span className='absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur'>
                  {pkg.destination}
                </span>
              </div>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg leading-5'>
                  <span className='line-clamp-2'>{pkg.title}</span>
                </CardTitle>
                <CardDescription className='flex items-center gap-2'>
                  <span className='font-semibold'>Price:</span> From $
                  {pkg.price.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3 pt-0 flex-1'>
                <div className='flex-1'>
                  <div className='text-sm font-semibold'>
                    Destination highlights
                  </div>
                  <ul className='mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                    {pkg.highlight.map((h: string) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className='mt-1 flex items-center gap-2'>
                  <Button asChild size='sm' className='shadow'>
                    <Link
                      href={{
                        pathname: `/packages/booking/${pkg.title}`,
                        query: { price: pkg.price },
                      }}>
                      Book Now
                    </Link>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' size='sm'>
                        Itinerary
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-72'>
                      <div className='mb-2 text-sm font-semibold'>
                        Itinerary
                      </div>
                      <ul className='list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
                        {pkg.itinerary.map((it: string) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className='rounded-xl border p-6'>
        <h2 className='text-xl font-semibold'>Custom Package?</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Tell us your dream trip—we’ll tailor it for you.
        </p>
        <div className='mt-4'>
          <Button asChild>
            <Link href='/contact'>Start Planning</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
