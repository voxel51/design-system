import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { bgColorClass, BrandColor, type Color, Radius } from "@/types";
import { cn } from "@/util/classes";

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  color?: Color;
  pulse?: boolean;
}

/**
 * A small dot marking an ongoing or notable state beside text.
 *
 * @example
 * ```tsx
 * <StatusDot pulse aria-hidden />
 * ```
 *
 * @param color Dot color. See {@link Color}. Defaults to `"brand-primary"`.
 * @param pulse Pulses while `true`, for work in progress. Defaults to `false`.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const StatusDot: FC<StatusDotProps> = ({
  color = BrandColor.Primary,
  pulse = false,
  className,
  ...props
}) => (
  <span
    className={cn(
      "inline-block size-1.5 shrink-0",
      radiusStyles(Radius.Full),
      bgColorClass(color),
      pulse && "animate-pulse",
      className
    )}
    {...props}
  />
);

StatusDot.displayName = "StatusDot";
