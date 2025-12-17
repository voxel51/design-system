import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { bg, text } from "@/styles/tailwind";
import {
  BackgroundColor,
  BackgroundColorProp,
  Radius,
  Shadow,
  Size,
  TextColor,
  TextColorProp,
} from "@/types";
import { cn } from "@/util/classes";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColorProp;
  backgroundColor?: BackgroundColorProp;
}

const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

export const Badge: FC<BadgeProps> = ({
  size = Size.Sm,
  radius = Radius.Full,
  shadow = undefined,
  color = undefined,
  backgroundColor = undefined,
  className,
  children,
  ...props
}) => {
  const colorClass = cn(TextColor.Muted, text(color));
  const backgroundColorClass = cn(BackgroundColor.Muted, bg(backgroundColor));
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        "font-small",
        colorClass,
        backgroundColorClass,
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

Badge.displayName = "Badge";
