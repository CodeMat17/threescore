import BookingForm from "@/components/booking/BookingForm";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ title?: string }>;
  searchParams: Promise<{ price?: string }>;
};

export default async function PackageBookingPage({
  params,
  searchParams,
}: PageProps) {
  const { title } = await params;
  const { price } = await searchParams;
  if (!title) return notFound();

  let decodedTitle: string = title;
  try {
    decodedTitle = decodeURIComponent(title);
  } catch {
    // leave as-is if decoding fails
  }
  const priceFromUsd = price ? Number(price) : undefined;

  return (
    <div className='w-full max-w-3xl mx-auto space-y-8 px-4 py-10'>
      <div className=''>
        <h1 className='text-3xl font-bold md:text-4xl'>Book Your Trip</h1>
        <p className='mt-2 text-muted-foreground'>
          Complete the form to reserve your package. We’ll confirm details by
          email/phone.
        </p>
      </div>

      <div className=''>
        {/* Booking form goes here */}
        <BookingForm pkg={decodedTitle} priceFromUsd={priceFromUsd} />
      </div>
    </div>
  );
}
