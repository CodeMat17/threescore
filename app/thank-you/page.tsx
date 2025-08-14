"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className='container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10'>
          <div className='h-6 w-40 rounded bg-muted animate-pulse' />
        </div>
      }>
      <ThankYouContent />
    </Suspense>
  );
}

function ThankYouContent() {
  const sp = useSearchParams();
  const name = sp.get("name") ?? "";
  const firstName = name?.split(" ")[0] ?? "";
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-10 text-center'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className='flex flex-col items-center gap-4'>
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 150,
            damping: 10,
          }}>
          <CheckCircle2 className='h-16 w-16 text-green-600' />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className='text-3xl font-bold md:text-4xl'>
          {firstName ? `Thank you, ${firstName}!` : "Thank you!"}
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='max-w-xl text-muted-foreground'>
          We’ve received your booking details. Our team will reach out shortly
          to confirm and finalize your trip.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className='flex gap-3'>
        <Button asChild>
          <Link href='/'>Go to Home</Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href='/packages'>Explore more packages</Link>
        </Button>
      </motion.div>
    </div>
  );
}
