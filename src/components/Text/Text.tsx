import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { textStyles } from "@/styles/text";
import {
  type ThemeableColor,
  isColorToken,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  /**
   * A theme-aware color token for anything the design system controls, or a
   * raw CSS color for anything the app controls (user-defined palettes,
   * data-driven colors) — a token can't exist for a color chosen at runtime
   * by app data, so this isn't a fallback, it's the correct tool for that
   * case.
   */
  color?: ThemeableColor | (string & {});
}

/**
 * A basic text component.
 *
 * All text in the app should be wrapped in this component to ensure compatibility with theme changes.
 *
 * @example
 * ```tsx
 * <Text>
 *   Some text
 * </Text>
 * ```
 *
 * @param variant The variant of the text; this controls the size and related styling of the text. See {@link Variant}.
 * @param color The color of the text. See {@link TextProps.color}.
 * @param children The content wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Text: FC<TextProps> = ({
  variant = TextVariant.Md,
  color = TextColor.Primary,
  children,
  className,
  style,
  ...props
}) => {
  const isToken = isColorToken(color);

  return (
    <span
      className={clsx(
        isToken && textColorClass(color),
        textStyles(variant),
        className
      )}
      style={!isToken ? { color, ...style } : style}
      {...props}
    >
      {children}
    </span>
  );
};

Text.displayName = "Text";
