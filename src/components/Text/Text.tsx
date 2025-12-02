import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";

export type TextVariant = "base" | "subtext";

export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
}

const variantStyles: Record<TextVariant, string> = {
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
