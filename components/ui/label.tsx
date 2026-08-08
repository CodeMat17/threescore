import { cn } from "@/lib/utils";
import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  requiredMark?: boolean;
};

export function Label({
  className,
  requiredMark,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground select-none",
        className
      )}
      {...props}>
      {children}
      {requiredMark ? (
        // Decorative: the control carries `required`, which is what assistive
        // tech announces. Reading "asterisk" aloud adds nothing.
        <span aria-hidden className='ml-0.5 text-destructive'>
          *
        </span>
      ) : null}
    </label>
  );
}
