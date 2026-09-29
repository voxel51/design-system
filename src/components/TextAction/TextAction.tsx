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

type TextActionSize = `${Size.Sm | Size.Md}`;

export interface TextActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TextActionSize;
  leadingIcon?: IconInput;
  trailingIcon?: IconInput;
}

const sizeStyles: Record<TextActionSize, string> = {
  [Size.Sm]: "h-[28px] px-[8px] text-md/5",
  [Size.Md]: "h-[32px] px-[10px] text-lg/5",
};

const iconSizes: Record<TextActionSize, Size> = {
  [Size.Sm]: Size.Sm,
  [Size.Md]: Size.Md,
};

/**
 * A borderless pill for secondary actions: secondary text that fills on hover.
 *
 * @example
 * ```tsx
 * <TextAction size="sm" trailingIcon={ArrowUpRightIcon} onClick={upgrade}>
 *   Upgrade
 * </TextAction>
 * ```
 *
 * @param size `"sm"` or `"md"`. Defaults to `"md"`.
 * @param leadingIcon Optional icon before the label: a per-icon component.
 * @param trailingIcon Optional icon after the label: a per-icon component.
 * @param className Additional CSS class names to apply to the button.
 * @param children The label.
 * @param props Additional HTML button properties, such as `onClick`.
 */
export const TextAction: FC<TextActionProps> = ({
  size = Size.Md,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...props
}) => (
  <HeadlessButton
    className={clsx(
      "inline-flex shrink-0 items-center gap-[4px] whitespace-nowrap transition-colors",
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
    <IconWrapper
      content={leadingIcon}
      size={iconSizes[size]}
      className="flex items-center"
    />
    {children}
    <IconWrapper
      content={trailingIcon}
      size={iconSizes[size]}
      className="flex items-center"
    />
  </HeadlessButton>
);

TextAction.displayName = "TextAction";
