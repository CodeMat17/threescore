"use client";

import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section size='loose' className='flex min-h-[50vh] flex-col justify-center'>
      <div className='max-w-xl'>
        <h1 className='text-4xl font-semibold md:text-5xl'>
          Something went wrong
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          Sorry about that. Try again — if it keeps happening, give us a call
          and we&apos;ll help directly.
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Button size='xl' variant='brand' onClick={reset}>
            Try again
          </Button>
          <Button asChild size='xl' variant='outline'>
            <Link href='/contact'>Contact us</Link>
          </Button>
        </div>
        {error.digest && (
          <p className='mt-6 text-xs text-muted-foreground'>
            Reference: {error.digest}
          </p>
        )}
      </div>
    </Section>
  );
}
