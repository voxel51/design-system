import type { CSSProperties, FC, HTMLAttributes } from "react";

import { cn } from "@/util/classes";

import styles from "./Skeleton.module.css";

export interface SkeletonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Width of the block. Defaults to filling its container. */
  width?: CSSProperties["width"];
  /** Height of the block. Defaults to 12px, one line of text. */
  height?: CSSProperties["height"];
  /** Corner radius of the block. Defaults to 6px. */
  radius?: CSSProperties["borderRadius"];
}

/**
 * A shimmering placeholder block shown where content is still loading; compose
 * several to sketch the shape of the page that will replace them. The shimmer
 * stops under reduced motion.
 *
 * @example
 * ```tsx
 * <Skeleton width={160} height={16} />
 * ```
 *
 * @param width Width of the block. Defaults to filling its container.
 * @param height Height of the block. Defaults to 12px, one line of text.
 * @param radius Corner radius of the block. Defaults to 6px.
 * @param className `class` overrides to apply to the component.
 * @param style Inline style overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Skeleton: FC<SkeletonProps> = ({
  width = "100%",
  height = 12,
  radius = 6,
  className,
  style,
  ...props
}) => (
  <div
    aria-hidden="true"
    className={cn(styles.block, className)}
    style={{
      width,
      height,
      borderRadius: radius,
      flexShrink: 0,
      ...style,
    }}
    {...props}
  />
);

Skeleton.displayName = "Skeleton";
