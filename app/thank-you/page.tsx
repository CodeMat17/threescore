"use client";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/lib/motion";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouShell />}>
      <ThankYouContent />
    </Suspense>
  );
}

function ThankYouShell({ firstName }: { firstName?: string }) {
  const reduced = useReducedMotion();

  return (
    <Section
      size='loose'
      className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
      <LazyMotion features={domAnimation}>
        <m.div
          initial={reduced ? false : "hidden"}
          animate='visible'
          variants={scaleIn}
          className='flex flex-col items-center'>
          <span className='inline-flex size-20 items-center justify-center rounded-full bg-accent'>
            <CheckCircle2 className='size-10 text-primary' aria-hidden />
          </span>
          <h1 className='mt-8 text-4xl font-semibold md:text-5xl'>
            {firstName ? `Thank you, ${firstName}!` : "Thank you!"}
          </h1>
          <p className='mt-4 max-w-xl text-lg text-muted-foreground'>
            We&apos;ve received your booking details. Our team will reach out
            shortly to confirm availability and finalise your trip.
          </p>
          <div className='mt-9 flex flex-wrap justify-center gap-3'>
            <Button asChild size='xl' variant='brand'>
              <Link href='/packages'>Explore more packages</Link>
            </Button>
            <Button asChild size='xl' variant='outline'>
              <Link href='/'>Back to home</Link>
            </Button>
          </div>
        </m.div>
      </LazyMotion>
    </Section>
  );
}

function ThankYouContent() {
  const name = useSearchParams().get("name") ?? "";
  return <ThankYouShell firstName={name.trim().split(" ")[0] || undefined} />;
}
