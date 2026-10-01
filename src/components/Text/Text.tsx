import type { FC, HTMLAttributes } from "react";

import { textStyles } from "@/styles/text";
import {
  type ThemeableColor,
  isColorToken,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

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
 * <Text>Plain body text</Text>
 * <Text variant="heading-md">Section title</Text>
 * <Text variant="body-secondary" color="text-secondary">
 *   Supporting detail
 * </Text>
 * ```
 *
 * @param variant The text's role in the type tier, which sets its size, line
 *  height and weight together. Defaults to `"body-primary"`. The size-only
 *  variants (`"xxs"` to `"xxl"`) are deprecated. See {@link TextVariant}.
 * @param color The color of the text. See {@link TextProps.color}.
 * @param children The content wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Text: FC<TextProps> = ({
  variant = TextVariant.BodyPrimary,
  color,
  children,
  className,
  style,
  ...props
}) => {
  // No default colour: a role that carries its own (Caption is tertiary)
  // shows it, and everything else inherits the surrounding text colour.
  const isToken = color !== undefined && isColorToken(color);

  return (
    <span
      // Merged rather than concatenated: the Caption role carries its own
      // tertiary colour, so an explicit `color` must come after it to win.
      className={cn(
        textStyles(variant),
        isToken && textColorClass(color),
        className
      )}
      style={color !== undefined && !isToken ? { color, ...style } : style}
      {...props}
    >
      {children}
    </span>
  );
};

Text.displayName = "Text";
