import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { BackgroundColor, Radius, Shadow, Size, TextColor } from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColor;
  backgroundColor?: BackgroundColor;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

export const Pill: FC<PillProps> = ({
  size = Size.Sm,
  radius = Radius.Full,
  shadow = undefined,
  color = TextColor.Muted,
  backgroundColor = BackgroundColor.Muted,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        "font-small",
        textColorClass(color),
        bgColorClass(backgroundColor),
        radiusStyles(radius),
        shadowStyles(shadow),
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Pill.displayName = "Pill";
