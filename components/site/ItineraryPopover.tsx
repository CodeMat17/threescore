"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Day-by-day itinerary, revealed on demand. Kept as its own client island so
 * the surrounding package card can stay a server component.
 */
export function ItineraryPopover({
  title,
  itinerary,
}: {
  title: string;
  itinerary: string[];
}) {
  if (itinerary.length === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm'>
          Itinerary
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ol className='min-h-0 flex-1 overflow-y-auto overscroll-contain list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground'>
          {itinerary.map((step, i) => (
            <li key={`${i}-${step}`}>{step}</li>
          ))}
        </ol>
        <SheetClose asChild>
          <Button variant='outline' size='sm' className='mt-4 self-start'>
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
