import Logo from "@/components/Logo";
import { SITE_NAME } from "@/lib/site";

/**
 * Route-level fallback shown while a page's server components stream in.
 *
 * Deliberately branded rather than a bare spinner: the logo is already in the
 * header on every route, so it is warm in cache and the swap to the real page
 * reads as continuity instead of a flash.
 */
export default function Loading() {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-busy='true'
      className='flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center'>
      <div className='relative flex items-center justify-center'>
        {/* Two offset rings: the outer one expands away, the inner holds the
            logo steady so it never appears to jitter. */}
        <span className='absolute size-24 animate-ping rounded-full bg-primary/20 [animation-duration:1.8s]' />
        <span className='absolute size-20 rounded-full border border-primary/30' />
        <Logo className='size-16 shadow-lg' />
      </div>

      <div className='space-y-2'>
        <p className='text-lg font-semibold tracking-tight'>{SITE_NAME}</p>
        <p className='text-sm text-muted-foreground'>
          Packing your itinerary&hellip;
        </p>
      </div>

      {/* Indeterminate bar — a travelling sliver rather than a percentage,
          since streaming progress is genuinely unknown. */}
      <div className='h-1 w-48 overflow-hidden rounded-full bg-muted'>
        <div className='h-full w-1/3 animate-[loading-sweep_1.4s_ease-in-out_infinite] rounded-full bg-primary' />
      </div>

      <span className='sr-only'>Loading page content</span>
    </div>
  );
}
