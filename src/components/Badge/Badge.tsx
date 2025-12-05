import { Radius, Shadow, Size } from "@/enums";
import radius_styles from "@/styles/radius";
import shadow_styles from "@/styles/shadow";
import { bg, text } from "@/styles/tailwind";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  radius?: Radius;
  shadow?: Shadow;
  color?: string;
  backgroundColor?: string;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-sm/5"),
};

export const Badge: FC<BadgeProps> = ({
  size = Size.Sm,
  radius = Radius.Full,
  shadow = undefined,
  color,
  backgroundColor,
  className,
  children,
  ...props
}) => {
  const colorClass = color ? text(color) : "text-content-text-muted";
  const backgroundColorClass = backgroundColor
    ? bg(backgroundColor)
    : "bg-content-bg-muted";
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        "font-small",
        colorClass,
        backgroundColorClass,
        radius_styles(radius),
        shadow_styles(shadow),
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
