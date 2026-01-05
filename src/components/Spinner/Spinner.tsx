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
