import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "base" | "subtext";

export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
}

const variantStyles: Record<TextVariant, string> = {
  h1: "text-2xl",
  h2: "text-xl",
  h3: "text-lg",
  h4: "text-md",
  base: "text-base",
  subtext: "text-sm",
};

export const Text: FC<TextProps> = ({
  variant = "base",
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "text-content-text-primary",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Text.displayName = "Text";
