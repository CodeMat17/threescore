"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Award,
  Globe2,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import Image from "next/image";

export default function AboutUsContent() {
  const aboutHero = useQuery(api.aboutHero.getAboutHero);
  const whoWeAre = useQuery(api.whoWeAre.getWhoWeAre);
  const whatWeOffer = useQuery(api.whatWeOffer.getWhatWeOffer);
  const chooseUs = useQuery(api.whyChooseUs.getWhyChooseUs);

  return (
    <div className='container max-w-6xl mx-auto space-y-12 px-4 py-10'>
      {/* Hero */}
      <section className='grid items-center gap-8 lg:grid-cols-2'>
        <div className='space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground'>
            <Award className='h-3.5 w-3.5' /> Acclaimed Adventure Experiences
          </div>
          {aboutHero === undefined ? (
            <>
              <div className='h-9 w-3/4 rounded bg-muted animate-pulse' />
              <div className='h-16 w-full rounded bg-muted animate-pulse' />
              <div className='flex gap-3'>
                <div className='h-9 w-32 rounded bg-muted animate-pulse' />
                <div className='h-9 w-32 rounded bg-muted animate-pulse' />
              </div>
            </>
          ) : aboutHero === null ? (
            <>
              <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>
                About Us
              </h1>
              <p className='text-muted-foreground'>
                We are updating this section. Please check back soon.
              </p>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button asChild>
                  <a href='/packages'>Explore Packages</a>
                </Button>
                <Button asChild variant='outline'>
                  <a href='/contact'>Plan Your Trip</a>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>
                {aboutHero.title}
              </h1>
              <p className='text-muted-foreground'>{aboutHero.description}</p>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button asChild>
                  <a href='/packages'>Explore Packages</a>
                </Button>
                <Button asChild variant='outline'>
                  <a href='/contact'>Plan Your Trip</a>
                </Button>
              </div>
            </>
          )}
        </div>
        <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl border shadow-sm'>
          {aboutHero === undefined ? (
            <div className='absolute inset-0 bg-muted animate-pulse' />
          ) : aboutHero === null ? (
            <div className='absolute inset-0 flex items-center justify-center text-sm text-muted-foreground'>
              Image coming soon
            </div>
          ) : (
            <Image
              src={aboutHero.image}
              alt='Safari jeep overlooking savannah at golden hour'
              fill
              className='object-cover'
              sizes='(min-width: 1024px) 640px, 100vw'
              priority
            />
          )}
        </div>
      </section>

      {/* Story */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='border rounded-xl p-7 md:p-9 shadow-md bg-amber-500/5'>
          {whoWeAre === undefined ? (
            <>
              <div className='h-5 w-48 rounded bg-muted animate-pulse mb-3' />
              <div className='h-4 w-full rounded bg-muted animate-pulse mb-2' />
              <div className='h-4 w-5/6 rounded bg-muted animate-pulse mb-2' />
              <div className='h-4 w-2/3 rounded bg-muted animate-pulse' />
            </>
          ) : whoWeAre === null ? (
            <>
              <h2 className='text-xl font-semibold'>Who We Are</h2>
              <p className='text-muted-foreground'>
                We are updating this section. Please check back soon.
              </p>
            </>
          ) : (
            <>
              <h2 className='text-xl font-semibold'>{whoWeAre.title}</h2>
              <p>{whoWeAre.body}</p>
            </>
          )}
        </div>
        <div className='border rounded-xl p-7 md:p-9 shadow-md bg-amber-500/5'>
          {whatWeOffer === undefined ? (
            <>
              <div className='h-5 w-48 rounded bg-muted animate-pulse mb-3' />
              <div className='h-4 w-2/3 rounded bg-muted animate-pulse mb-2' />
              <div className='h-4 w-5/6 rounded bg-muted animate-pulse mb-2' />
              <div className='h-4 w-1/2 rounded bg-muted animate-pulse' />
            </>
          ) : whatWeOffer === null ? (
            <>
              <h2 className='text-xl font-semibold'>What We Offer</h2>
              <p className='text-muted-foreground'>
                Details will appear here soon.
              </p>
            </>
          ) : (
            <>
              <h2 className='text-xl font-semibold'>{whatWeOffer.title}</h2>
              {whatWeOffer.items && whatWeOffer.items.length > 0 ? (
                <ul className='list-disc pl-6'>
                  {whatWeOffer.items.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-muted-foreground'>No items available.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Value Props */}
      <section>
        <h2 className='mb-4 text-xl font-semibold'>Why Choose Us?</h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {chooseUs === undefined ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className='h-full'>
                <CardContent className='flex h-full items-start gap-4 p-6'>
                  <div className='mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border shrink-0 bg-amber-500/10' />
                  <div className='space-y-2 w-full'>
                    <div className='h-5 w-40 rounded bg-muted animate-pulse' />
                    <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !chooseUs || !chooseUs.items || chooseUs.items.length === 0 ? (
            <div className='text-sm text-muted-foreground'>
              We are updating this section. Please check back soon.
            </div>
          ) : (
            chooseUs.items.map((choose) => (
              <Card key={choose.title} className='h-full'>
                <CardContent className='flex h-full items-start gap-4 p-6'>
                  <div className='mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border shrink-0 bg-amber-500/10'>
                    {choose.title === "Local Roots, Global Reach" && (
                      <Globe2 className='h-5 w-5' />
                    )}
                    {choose.title === "Tailor‑Made Itineraries" && (
                      <MapPinned className='h-5 w-5' />
                    )}
                    {choose.title === "Trust & Safety" && (
                      <ShieldCheck className='h-5 w-5' />
                    )}
                    {choose.title === "For Families & Teams" && (
                      <Users2 className='h-5 w-5' />
                    )}
                    {choose.title === "Beautiful Moments" && (
                      <Sparkles className='h-5 w-5' />
                    )}
                    {choose.title === "Pro Service, Every Time" && (
                      <Award className='h-5 w-5' />
                    )}
                  </div>
                  <div className='space-y-1'>
                    <div className='font-semibold text-xl'>{choose.title}</div>
                    <p className=' text-muted-foreground'>
                      {choose.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Commitments */}
      <section>
        <h2 className='mb-4 text-xl font-semibold'>Our Strength</h2>
        <div className='grid gap-6 md:grid-cols-3'>
          {["Excellence", "Authenticity", "Sustainability"].map((v) => (
            <Card key={v}>
              <CardHeader>
                <CardTitle>{v}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  We strive to embody {v.toLowerCase()} in every journey we
                  craft.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
