import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/**
 * MetaChip — design system chip for non-status metadata
 * (task, source, params, tags…).
 *
 * Flat by design: no borders, no shadows. Geometry mirrors StatusPill so
 * chips and status chips can sit on the same row.
 *
 * Use StatusPill for anything that communicates state.
 */
const metaChipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap select-none bg-card-elevated text-secondary-foreground",
  {
    variants: {
      size: {
        sm: "h-[22px] px-2.5 text-meta",
        md: "h-[22px] px-2.5 text-meta",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export interface MetaChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof metaChipVariants> {}

export function MetaChip({ className, size, ...props }: MetaChipProps) {
  return <span className={cn(metaChipVariants({ size }), className)} {...props} />;
}

export { metaChipVariants };
