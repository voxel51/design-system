import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * StatusPill — design system component for status chips.
 *
 * Tones map to the project's status tokens:
 *   reviewed     → status-success (green)
 *   in-review    → primary       (FiftyOne orange) — review-pending, attention-needed
 *   not-started  → status-default (muted gray)
 *   generating   → status-progress (purple) — long-running computation
 *   failed       → status-failed   (red, subtle background)
 *   failed-solid → status-failed   (red, solid emphasis)
 *
 * Variants:
ne size only: 22px tall, 11px text (matches MetaChip).
 *   withCaret: shows a trailing chevron (use when the pill is also a trigger)
 */
const statusPillVariants = cva(
  "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-meta font-medium whitespace-nowrap select-none",
  {
    variants: {
      tone: {
        reviewed: "bg-card-elevated text-status-success",
        "in-review": "bg-card-elevated text-icon-decorative",
        "not-started": "bg-card-elevated text-status-default",
        generating: "bg-card-elevated text-status-progress",
        failed: "bg-card-elevated text-status-failed",
        "failed-solid": "bg-status-failed text-white",
      },
    },
    defaultVariants: { tone: "not-started" },
  },
);

const dotToneClass: Record<NonNullable<VariantProps<typeof statusPillVariants>["tone"]>, string> = {
  reviewed: "bg-status-success",
  "in-review": "bg-icon-decorative",
  "not-started": "bg-status-default",
  generating: "bg-status-progress",
  failed: "bg-status-failed",
  "failed-solid": "bg-white/90",
};

export interface StatusPillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof statusPillVariants> {
  label: string;
  withCaret?: boolean;
  showDot?: boolean;
  spinning?: boolean;
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, tone = "not-started", label, withCaret = false, showDot = true, spinning = false, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(statusPillVariants({ tone }), className)} {...props}>
        {spinning ? (
          <svg
            className={"h-3 w-3 animate-spin"}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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
        ) : showDot ? (
          <span
            className={cn("h-1.5 w-1.5 rounded-full", dotToneClass[tone!])}
          />
        ) : null}
        {label}
        {withCaret && <ChevronDown className="h-3 w-3" />}
      </span>
    );
  },
);
StatusPill.displayName = "StatusPill";
