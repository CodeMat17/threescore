import { LEGAL_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30",
        className
      )}>
      <Image
        src='/logo.jpg'
        alt={`${LEGAL_NAME} logo`}
        fill
        // Not `priority`: a 48px logo does not deserve a preload, and the one
        // it emitted competed with the hero image for early bandwidth.
        sizes='96px'
        quality={80}
        className='object-cover'
      />
    </div>
  );
};

export default Logo;
