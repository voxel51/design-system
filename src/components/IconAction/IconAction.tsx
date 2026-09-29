import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
} from "@/types";

type IconActionSize = `${Size.Sm | Size.Md | Size.Lg}`;

export interface IconActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconInput;
  size?: IconActionSize;
  "aria-label": string;
}

const sizeStyles: Record<IconActionSize, string> = {
  [Size.Sm]: "h-[24px] w-[24px]",
  [Size.Md]: "h-[28px] w-[28px]",
  [Size.Lg]: "h-[32px] w-[32px]",
};

const iconSizes: Record<IconActionSize, Size> = {
  [Size.Sm]: Size.Md,
  [Size.Md]: Size.Md,
  [Size.Lg]: Size.Lg,
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
      textColorClass(TextColor.Secondary),
      textColorClass(TextColor.Primary, ElementState.Hover),
      bgColorClass(BackgroundColor.CardNested, ElementState.Hover),
      className
    )}
    {...props}
  >
    <IconWrapper content={icon} size={iconSizes[size]} className="flex" />
  </HeadlessButton>
);

IconAction.displayName = "IconAction";
