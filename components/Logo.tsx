import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative h-10 w-10 border-4 rounded-full border-amber-300", className)} >
      <Image src='/logo.jpg' alt='logo' priority fill className="object-cover rounded-full" />
    </div>
  );
};

export default Logo;
