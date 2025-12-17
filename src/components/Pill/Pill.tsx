import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { BackgroundColor, Radius, Shadow, Size, TextColor } from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

type PillSize = Exclude<Size, Size.Lg>;

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: PillSize;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColor;
  isStatus?: boolean;
  backgroundColor?: BackgroundColor;
}

const sizeStyles: Record<PillSize, string> = {
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
  isStatus = false,
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
      {isStatus && ( // TODO: change this to an icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5"
          height="5"
          viewBox="0 0 5 5"
          fill="none"
          className="mr-1"
        >
          <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
        </svg>
      )}
      {children}
    </span>
  );
};

Pill.displayName = "Pill";
