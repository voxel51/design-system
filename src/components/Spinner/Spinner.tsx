import type { FC, HTMLAttributes } from "react";

import { SpinnerIcon } from "@/components/Icons/Spinner";
import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

const sizeStyles: Record<Size, string> = {
  // Figma LoadingIndicator: XXS 10, SM-XS 14, MD 16, LG 18, XL 22.
  [Size.Xs]: "size-2.5",
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
  [Size.Xl]: "size-[22px]",
};

/**
 * An animated spinner component.
 *
 * @example
 * ```tsx
 * <Spinner size={Size.Md} />
 * ```
 *
 * @param className `class` overrides to apply to the component.
 * @param size Size of the component. See {@link Size}.
 * @param props Additional HTML properties to apply to the component.
 */
export const Spinner: FC<SpinnerProps> = ({
  className,
  size = Size.Md,
  ...props
}) => (
  <div
    className={cn(
      sizeStyles[size],
      textColorClass(TextColor.Primary),
      className
    )}
    {...props}
  >
    <SpinnerIcon className="animate-spin" />
  </div>
);

Spinner.displayName = "Spinner";
