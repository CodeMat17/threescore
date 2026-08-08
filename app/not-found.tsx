import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section size='loose' className='flex min-h-[50vh] flex-col justify-center'>
      <div className='max-w-xl'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
          404
        </p>
        <h1 className='mt-4 text-4xl font-semibold md:text-5xl'>
          We can&apos;t find that page
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          The link may be out of date, or the page may have moved. Here&apos;s
          where most people go next.
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Button asChild size='xl' variant='brand'>
            <Link href='/packages'>Browse packages</Link>
          </Button>
          <Button asChild size='xl' variant='outline'>
            <Link href='/'>Back to home</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
