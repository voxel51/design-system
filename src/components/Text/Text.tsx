import type { FC, HTMLAttributes } from "react";
import { cn } from "@/util/classes";

export type TextVariant =
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "label"
  | "caption";

export type TextColor = "fg" | "primary" | "secondary" | "tertiary" | "muted";

export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
  color?: TextColor;
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

const colorStyles: Record<TextColor, string> = {
  fg: "text-content-text-fg",
  primary: "text-content-text-primary",
  secondary: "text-content-text-secondary",
  tertiary: "text-content-text-tertiary",
  muted: "text-content-text-muted",
};

export const Text: FC<TextProps> = ({
  variant = "md",
  color = "primary",
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(colorStyles[color], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};

Text.displayName = "Text";
