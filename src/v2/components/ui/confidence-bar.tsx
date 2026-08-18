import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConfidenceBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Confidence as a 0–100 percentage. */
  value: number;
  /** Width of the track (Tailwind class). Defaults to a compact bar. */
  trackClassName?: string;
  /** Hide the trailing percentage label. */
  hideLabel?: boolean;
}

/**
 * ConfidenceBar — design-system bar for model confidence / scores.
 * Track uses `bg-card-elevated`, fill uses `bg-primary`, value shown in primary text.
 */
export const ConfidenceBar = React.forwardRef<HTMLDivElement, ConfidenceBarProps>(
  ({ value, trackClassName, hideLabel = false, className, ...props }, ref) => {
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div className={cn("h-1.5 w-12 overflow-hidden rounded-full bg-card-elevated", trackClassName)}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        {!hideLabel && (
          <span className="text-body tabular-nums text-foreground">{pct}%</span>
        )}
      </div>
    );
  },
);
ConfidenceBar.displayName = "ConfidenceBar";
