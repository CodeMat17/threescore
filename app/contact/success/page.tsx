import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ContactSuccessPage() {
  return (
    <div className='container mx-auto max-w-2xl space-y-6 px-4 py-16 text-center'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50'>
        <CheckCircle2 className='h-10 w-10 text-emerald-600' />
      </div>
      <h1 className='text-3xl font-bold md:text-4xl'>
        Thanks for reaching out!
      </h1>
      <p className='text-muted-foreground'>
        We’ve received your message and will get back to you shortly.
      </p>
      <div className='pt-2'>
        <Button asChild>
          <Link href='/'>Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
