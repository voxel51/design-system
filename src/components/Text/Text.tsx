import { textStyles } from "@/styles/text";
import { TextColor, TextVariant } from "@/types";
import { textColorClass } from "@/types/color";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
  color?: TextColor;
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
