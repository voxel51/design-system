import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
  type Color,
  Radius,
  Size,
} from "@/types";

export type ProgressSize = `${Exclude<Size, Size.Xs | Size.Xl>}`;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value, clamped to `[0, max]`. */
  value: number;
  /** Maximum value the bar represents. */
  max?: number;
  /** Track thickness. See {@link Size}. */
  size?: ProgressSize;
  /** Fill color. See {@link Color}. */
  color?: Color;
  /** Background color of the unfilled track. See {@link BackgroundColor}. */
  trackColor?: BackgroundColor;
}

const sizeStyles: Record<ProgressSize, string> = {
  [Size.Sm]: "h-1",
  [Size.Md]: "h-1.5",
  [Size.Lg]: "h-2",
};

/**
 * A read-only progress / meter bar: a filled track showing `value` as a
 * fraction of `max`. For an interactive range input, see {@link Slider}.
 *
 * @example
 * ```tsx
 * <Progress value={68} aria-label="Voxel tokens used" />
 * ```
 *
 * @param value Current value, clamped to `[0, max]`.
 * @param max Maximum value the bar represents. Defaults to `100`.
 * @param size Track thickness. See {@link Size}. Defaults to {@link Size.Md}.
 * @param color Fill color. See {@link Color}. Defaults to {@link BrandColor.Primary}.
 * @param trackColor Background color of the unfilled track. See {@link BackgroundColor}.
 *  Defaults to {@link BackgroundColor.CardElevated}.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  size = Size.Md,
  color = BrandColor.Primary,
  trackColor = BackgroundColor.CardElevated,
  className,
  ...props
}) => {
  const ratio = max > 0 ? Math.min(Math.max(value, 0), max) / max : 0;
  const percent = Math.round(ratio * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={clsx(
        "relative w-full overflow-hidden",
        bgColorClass(trackColor),
        radiusStyles(Radius.Full),
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <div
        className={clsx(
          "h-full",
          bgColorClass(color),
          radiusStyles(Radius.Full)
        )}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
};

Progress.displayName = "Progress";
