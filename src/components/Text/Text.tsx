import { TextColor, TextColorProp, TextVariant } from "@/types";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";
import { cn } from "@/util/classes";


export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
  color?: TextColorProp;
}

const variantStyles: Record<TextVariant, string> = {
  xxs: "text-xxs/4",
  xs: "text-xs/5",
  sm: "text-sm/6",
  md: "text-md/7",
  lg: "text-lg/9",
  xl: "text-xl/11",
  xxl: "text-xxl/13",
  label: "text-xs/5 text-bold uppercase",
  caption: "text-xs/5 text-content-text-tertiary",
};

export const Text: FC<TextProps> = ({
  variant = TextVariant.Md,
  color = TextColor.Primary,
  children,
  className,
  ...props
}) => {
  return (
    <span className={clsx(color, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};

Text.displayName = "Text";
