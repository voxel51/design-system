import { cn } from "../../lib/utils";

export type CountPillTone = "neutral" | "primary";
export type CountPillSize = "sm" | "md" | "lg";

interface CountPillProps {
  count: number;
  /**
   * Size variant. Mirrors common design-system count/badge scales
   * (GitHub Primer CounterLabel, Chakra Badge, Ant count).
   * - `sm` — 20px tall, use inline next to icons/labels and in dense toolbars.
   *   Default choice for facet counts, thread counts, list-row badges.
   * - `md` — 24px tall, for section headers or standalone counts that need
   *   more presence.
   * - `lg` — 28px tall, for hero/summary counts (empty states, KPIs).
   */
  size?: CountPillSize;
  /**
   * Visual tone.
   * - `neutral` (default) — quiet gray chip, matches SelectionPill. Use for
   *   passive counts (thread counts, list totals, badge counts on nav rows).
   * - `primary` — filled brand chip. Reserve for active/notification counts
   *   (unread, active filters, pending review).
   */
  tone?: CountPillTone;
  /** Optional aria label override; defaults to "{count} items". */
  "aria-label"?: string;
  className?: string;
}

/**
 * Small numeric pill used anywhere a raw count needs to sit inline with a
 * label or icon (facets filter count, discussion thread count, list badges).
 *
 * Never a circle — every size enforces min-width > height so single-digit
 * counts stay a horizontal pill. Roboto Mono, medium weight, tabular nums.
 * Consistent with `<SelectionPill>` in radius + tone.
 */
export function CountPill({
  count,
  size = "sm",
  tone = "neutral",
  className,
  "aria-label": ariaLabel,
}: CountPillProps) {
  const sizeClasses = {
    // h : min-w : px : font-size — min-w is always > h so no circle
    sm: "h-5 min-w-8 px-1.5 text-[11px]",
    md: "h-6 min-w-10 px-2 text-[12px]",
    lg: "h-7 min-w-12 px-2.5 text-[13px]",
  }[size];

  return (
    <span
      aria-label={ariaLabel ?? `${count} items`}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "font-mono font-medium leading-none tabular-nums",
        sizeClasses,
        tone === "primary"
          ? "bg-primary text-primary-foreground"
          : "bg-card-elevated text-foreground/80",
        className,
      )}
    >
      {count.toLocaleString()}
    </span>
  );
}
