import type { CSSProperties, FC, HTMLAttributes } from "react";

import { cn } from "@/util/classes";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The ratio expressed as `width / height`.
   * Common values: `16 / 9`, `4 / 3`, `1` (square), `3 / 2`.
   * @default 1
   */
  ratio?: number;
}

/**
 * Constrains its child to a fixed width-to-height ratio.
 * The child is absolutely positioned to fill the container, so it should
 * be a block-level element (e.g. `<img>`, `<video>`, `<iframe>`, or a `<div>`).
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." className="w-full h-full object-cover" />
 * </AspectRatio>
 * ```
 *
 * @example
 * ```tsx
 * // Square thumbnail
 * <AspectRatio ratio={1} className="w-32">
 *   <img src="..." alt="..." className="w-full h-full object-cover rounded-md" />
 * </AspectRatio>
 * ```
 *
 * @param ratio Width-to-height ratio. Defaults to `1` (square).
 * @param className `class` overrides to apply to the outer container.
 * @param children Content to constrain. Should fill its parent (`w-full h-full`).
 * @param props Additional HTML properties to apply to the outer container.
 */
export const AspectRatio: FC<AspectRatioProps> = ({
  ratio = 1,
  className,
  children,
  style,
  ...props
}) => {
  const paddingStyle: CSSProperties = {
    paddingBottom: `${(1 / ratio) * 100}%`,
    ...style,
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={paddingStyle}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};

AspectRatio.displayName = "AspectRatio";
