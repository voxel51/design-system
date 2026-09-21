import clsx from "clsx";
import type { CSSProperties, FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
  type Color,
  getColorCssVar,
  Radius,
  Size,
} from "@/types";

import styles from "./Progress.module.css";

export type ProgressSize = `${Exclude<Size, Size.Xs | Size.Xl>}`;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value, clamped to `[0, max]`. Omit it for work with no known end. */
  value?: number;
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
 * fraction of `max`. Without a `value` it sweeps instead, for work that has
 * no known end. For an interactive range input, see {@link Slider}.
 *
 * @example
 * ```tsx
 * <Progress value={68} aria-label="Voxel tokens used" />
 * <Progress aria-label="Loading" />
 * ```
 *
 * @param value Current value, clamped to `[0, max]`. Omit it for work with no
 *  known end, which sweeps rather than filling.
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
  style,
  ...props
}) => {
  const known = value !== undefined;
  const ratio = known && max > 0 ? Math.min(Math.max(value, 0), max) / max : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={known ? Math.round(ratio * 100) : undefined}
      aria-valuemin={known ? 0 : undefined}
      aria-valuemax={known ? 100 : undefined}
      style={
        known
          ? style
          : ({
              "--voodo-progress": getColorCssVar(color),
              ...style,
            } as CSSProperties)
      }
      className={clsx(
        "relative w-full overflow-hidden",
        bgColorClass(trackColor),
        radiusStyles(Radius.Full),
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {known ? (
        <div
          className={clsx(
            "h-full",
            bgColorClass(color),
            radiusStyles(Radius.Full)
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      ) : (
        <div className={styles.sweep} />
      )}
    </div>
  );
};

Progress.displayName = "Progress";
