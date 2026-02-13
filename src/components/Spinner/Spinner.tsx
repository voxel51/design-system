import type { FC, HTMLAttributes } from "react";

import { SpinnerIcon } from "@/components/Icons/Spinner";
import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: "size-3",
  [Size.Sm]: "size-4",
  [Size.Md]: "size-5",
  [Size.Lg]: "size-6",
};

/**
 * An animated spinner component.
 *
 * Note that this component is also available via the {@link Icon} component with {@link IconName.Spinner}.
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
