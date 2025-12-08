import { TextColor, TextColorProp, TextVariant } from "@/types";
import type { FC, HTMLAttributes } from "react";
import { textStyles } from "@/styles/text";
import clsx from "clsx";

export interface TextProps extends HTMLAttributes<any> {
  variant?: TextVariant;
  color?: TextColorProp;
}

export const Text: FC<TextProps> = ({
  variant = TextVariant.Md,
  color = TextColor.Primary,
  children,
  className,
  ...props
}) => {
  return (
    <span className={clsx(color, textStyles(variant), className)} {...props}>
      {children}
    </span>
  );
};

Text.displayName = "Text";
