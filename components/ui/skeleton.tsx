import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

/**
 * The loading placeholder for a media card. Replaces five near-identical
 * copy-pasted skeleton blocks (Sections, packages, services, blog, about).
 */
export function SkeletonCard({
  media = true,
  lines = 3,
  className,
}: {
  media?: boolean;
  lines?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm",
        className
      )}>
      {media ? <Skeleton className='h-44 w-full rounded-none' /> : null}
      <div className='space-y-3 p-6'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-3 w-1/3' />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className='h-3' style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    </div>
  );
}

/** A grid of skeleton cards, matching the grids they stand in for. */
export function SkeletonGrid({
  count = 4,
  media = true,
  className,
}: {
  count?: number;
  media?: boolean;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} media={media} className={className} />
      ))}
    </>
  );
}
