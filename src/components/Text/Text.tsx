import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { textStyles } from "@/styles/text";
import { IconColor, TextColor, TextVariant } from "@/types";
import { textColorClass } from "@/types/color";

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  color?: TextColor | IconColor;
}

/**
 * A basic text component.
 *
 * All text in the app should be wrapped in this component to ensure compatibility with theme changes.
 *
 * @param variant The variant of the text; this controls the size and related styling of the text. See {@link Variant}.
 * @param color The color of the text. See {@link TextColor}.
 * @param children The content wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
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
