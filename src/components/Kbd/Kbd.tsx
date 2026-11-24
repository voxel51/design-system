import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  BorderColor,
  bgColorClass,
  borderColorClass,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export type KbdSize = `${Size.Sm | Size.Md}`;

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize;
}

// 28px keycap at Medium; 20px at Small, for dense rows such as a shortcuts list.
const sizeStyles: Record<KbdSize, string> = {
  [Size.Sm]: "min-h-5 px-1.5",
  [Size.Md]: "min-h-7 px-1",
};

/**
 * A keycap naming a keyboard key or gesture, such as in a shortcuts list or
 * beside a menu item.
 *
 * @example
 * ```tsx
 * <Kbd>Shift</Kbd>
 * <Kbd>?</Kbd>
 * <Kbd size="sm">Esc</Kbd>
 * ```
 *
 * @param children The key, such as `"E"`, `"Esc"` or `"⌘Z"`.
 * @param size `"sm"` (20px tall, for dense rows) or `"md"` (28px). Defaults to `"md"`.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Kbd: FC<KbdProps> = ({
  size = Size.Md,
  className,
  children,
  ...props
}) => (
  <kbd
    className={cn(
      "inline-flex min-w-7 shrink-0 items-center justify-center tabular-nums whitespace-nowrap",
      sizeStyles[size],
      textStyles(TextVariant.CodePrimary),
      textColorClass(TextColor.Primary),
      bgColorClass(BackgroundColor.CardElevated),
      "border",
      borderColorClass(BorderColor.Subtle),
      radiusStyles(Radius.Full),
      className
    )}
    {...props}
  >
    {children}
  </kbd>
);

Kbd.displayName = "Kbd";
