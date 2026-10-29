import {
  type FC,
  type HTMLAttributes,
  type SyntheticEvent,
  useState,
} from "react";

import { Tooltip } from "@/components/Tooltip/Tooltip";
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
  /** Fills the text with the expressive gradient, overriding `color`. */
  gradient?: boolean;
  /** Keeps the text on one line, cut with an ellipsis; a cut text shows in full in a tooltip. */
  truncate?: boolean;
}

const GRADIENT_TEXT =
  "bg-(image:--gradient-action-expressive) bg-clip-text text-transparent selection:text-[HighlightText]";

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
 * <Text variant="heading-lg" truncate>
 *   A title that may not fit
 * </Text>
 * ```
 *
 * @param variant The text's role in the type tier, which sets its size, line
 *  height and weight together. Defaults to `"body-primary"`. The size-only
 *  variants (`"xxs"` to `"xxl"`) are deprecated. See {@link TextVariant}.
 * @param color The color of the text. See {@link TextProps.color}.
 * @param gradient Fills the text with the expressive gradient, overriding `color`.
 * @param truncate Keeps the text on one line, cut with an ellipsis; when cut,
 *  hovering or tapping it shows it in full in a tooltip.
 * @param children The content wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Text: FC<TextProps> = ({
  variant = TextVariant.BodyPrimary,
  color,
  gradient,
  truncate = false,
  children,
  className,
  style,
  ...props
}) => {
  const [cut, setCut] = useState(false);
  // No default colour: a role that carries its own (Caption is tertiary)
  // shows it, and everything else inherits the surrounding text colour.
  const isToken = color !== undefined && isColorToken(color);

  const text = (
    <span
      // Merged rather than concatenated: the Caption role carries its own
      // tertiary colour, so an explicit `color` must come after it to win.
      className={cn(
        textStyles(variant),
        isToken && !gradient && textColorClass(color),
        gradient && GRADIENT_TEXT,
        truncate && "block min-w-0 truncate",
        className
      )}
      style={
        color !== undefined && !isToken && !gradient
          ? { color, ...style }
          : style
      }
      {...props}
    >
      {children}
    </span>
  );
  if (!truncate) return text;
  const measure = (event: SyntheticEvent<HTMLElement>): void => {
    const el = event.currentTarget.firstElementChild;
    setCut(!!el && el.scrollWidth > el.clientWidth);
  };
  return (
    <Tooltip
      content={cut ? children : null}
      wrapperClassName="min-w-0"
      onMouseOverCapture={measure}
      onPointerDownCapture={measure}
    >
      {text}
    </Tooltip>
  );
};

Text.displayName = "Text";
