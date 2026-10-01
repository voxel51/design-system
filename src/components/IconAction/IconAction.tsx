import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  bgColorClass,
  ElementState,
  IconColor,
  InteractiveColor,
  Radius,
  Size,
  textColorClass,
} from "@/types";

type IconActionSize = `${Size.Sm | Size.Md | Size.Lg}`;

export interface IconActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconInput;
  size?: IconActionSize;
  "aria-label": string;
}

// Figma BorderlessButton, icon style: 26px round hit area with a 14px glyph
// at Small, 36px with 16px at Medium (the file says 35), 40px with 20px at
// Large.
const sizeStyles: Record<IconActionSize, string> = {
  [Size.Sm]: "size-[26px]",
  [Size.Md]: "size-9",
  [Size.Lg]: "size-10",
};

const iconSizes: Record<IconActionSize, number> = {
  [Size.Sm]: 14,
  [Size.Md]: 16,
  [Size.Lg]: 20,
};

/**
 * A round, icon-only action (close, kebab, toolbar affordances) that fills on hover.
 *
 * @example
 * ```tsx
 * <IconAction icon={CloseIcon} aria-label="Dismiss" onClick={dismiss} />
 * ```
 *
 * @param icon The icon to show: a per-icon component such as `CloseIcon`.
 * @param size `"sm"`, `"md"` or `"lg"`. Defaults to `"md"`.
 * @param aria-label Required, because the action has no visible text.
 * @param className Additional CSS class names to apply to the button.
 * @param props Additional HTML button properties, such as `onClick`.
 */
export const IconAction: FC<IconActionProps> = ({
  icon,
  size = Size.Md,
  className,
  ...props
}) => (
  <HeadlessButton
    className={clsx(
      "inline-flex shrink-0 items-center justify-center transition-colors",
      "hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
      radiusStyles(Radius.Full),
      sizeStyles[size],
      textColorClass(IconColor.Default),
      textColorClass(IconColor.Emphasis, ElementState.Hover),
      bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
      bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active),
      className
    )}
    {...props}
  >
    <IconWrapper content={icon} size={iconSizes[size]} className="flex" />
  </HeadlessButton>
);

IconAction.displayName = "IconAction";
