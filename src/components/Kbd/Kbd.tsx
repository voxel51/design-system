import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  BorderColor,
  bgColorClass,
  borderColorClass,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export type KbdProps = HTMLAttributes<HTMLElement>;

/**
 * A keycap naming a keyboard key or gesture, such as in a shortcuts list or
 * beside a menu item.
 *
 * @example
 * ```tsx
 * <Kbd>Shift</Kbd>
 * <Kbd>?</Kbd>
 * ```
 *
 * @param children The key, such as `"E"`, `"Esc"` or `"⌘Z"`.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Kbd: FC<KbdProps> = ({ className, children, ...props }) => (
  <kbd
    className={cn(
      "inline-flex min-w-7 shrink-0 items-center justify-center px-1 tabular-nums whitespace-nowrap",
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
