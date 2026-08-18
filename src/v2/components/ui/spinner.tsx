import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Spinner — smooth, perfectly-centered loading indicator.
 * Uses an SVG arc that rotates around its true center (no wobble),
 * unlike lucide's Loader2 which has asymmetric geometry.
 */
export function Spinner({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("h-3.5 w-3.5 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset="14"
        opacity="0.9"
      />
    </svg>
  );
}
