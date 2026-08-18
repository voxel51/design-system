import { cn } from "../../lib/utils";

/**
 * TextBadge — a minimal, backgroundless label rendered as small uppercase,
 * letter-spaced text. Mirrors the design-system TextBadge component.
 *
 * Defaults to the `text/accent` color token. Pass a different token class via
 * `colorClassName` (e.g. "text-muted-foreground") for the Custom Color variant.
 */
export interface TextBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color token class. Defaults to the accent token (`text-accent`). */
  colorClassName?: string;
}

export function TextBadge({
  className,
  colorClassName = "text-accent",
  ...props
}: TextBadgeProps) {
  return (
    <span
      className={cn(
        "text-meta font-semibold uppercase tracking-wider",
        colorClassName,
        className,
      )}
      {...props}
    />
  );
}
