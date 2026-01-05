import { textStyles } from "@/styles/text";
import { IconColor, TextColor, TextVariant } from "@/types";
import { textColorClass } from "@/types/color";
import type { FC, HTMLAttributes } from "react";
import clsx from "clsx";

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  color?: TextColor | IconColor;
}

export const Text: FC<TextProps> = ({
  variant = TextVariant.Md,
  color = TextColor.Primary,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={clsx(textColorClass(color), textStyles(variant), className)}
      {...props}
    >
      {children}
    </span>
  );
};

Text.displayName = "Text";
