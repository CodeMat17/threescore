import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * Page section wrapper: one container width, one gutter, one vertical rhythm.
 * Replaces the `' mx-auto px-4 md:px-8 lg:px-12 py-12'` string (note the stray
 * leading space) that was duplicated across ~8 files.
 */
export function Section({
  className,
  as: Tag = "section",
  size = "default",
  ...props
}: React.ComponentPropsWithoutRef<"section"> & {
  as?: "section" | "div" | "article";
  size?: "default" | "tight" | "loose";
}) {
  return (
    <Tag
      className={cn(
        "site-container",
        size === "tight" && "py-8 md:py-10",
        size === "default" && "py-12 md:py-16",
        size === "loose" && "py-16 md:py-24",
        className
      )}
      {...props}
    />
  );
}

/**
 * Section heading + optional description and trailing action, so every section
 * shares the same type scale and alignment.
 */
export function SectionHeader({
  title,
  description,
  action,
  as: Heading = "h2",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}>
      <div className='max-w-2xl'>
        <Heading className='text-3xl font-semibold md:text-4xl'>{title}</Heading>
        {description ? (
          <p className='mt-2 text-muted-foreground'>{description}</p>
        ) : null}
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  );
}
