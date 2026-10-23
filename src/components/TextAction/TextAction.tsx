import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  bgColorClass,
  ElementState,
  InteractiveColor,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";

type TextActionSize = `${Size.Sm | Size.Md | Size.Lg}`;

export type TextActionTone = "default" | "danger";

export interface TextActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TextActionSize;
  tone?: TextActionTone;
  leadingIcon?: IconInput;
  trailingIcon?: IconInput;
  /** Hides the label below 1024px, leaving the icons. Give it an `aria-label`. */
  collapse?: boolean;
}

// Figma BorderlessButton, label styles: Small is 28px tall with 12px side
// padding and a 12/16 label; Medium 32px, 16px and 14/20; Large 36px, 16px
// and 15/20. The icon-to-label gap is 4px at Small and 6px above.
const sizeStyles: Record<TextActionSize, string> = {
  [Size.Sm]: clsx("h-7 px-3 gap-1", TEXT_STYLES[TextVariant.BodyTertiary]),
  [Size.Md]: clsx("h-8 px-4 gap-1.5", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Lg]: clsx("h-9 px-4 gap-1.5", TEXT_STYLES[TextVariant.BodyPrimary]),
};

const iconSizes: Record<TextActionSize, number> = {
  [Size.Sm]: 14,
  [Size.Md]: 16,
  [Size.Lg]: 18,
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
 * @param size `"sm"`, `"md"` or `"lg"`. Defaults to `"md"`.
 * @param tone `"danger"` colors the label as a destructive action. Defaults to `"default"`.
 * @param leadingIcon Optional icon before the label: a per-icon component.
 * @param trailingIcon Optional icon after the label: a per-icon component.
 * @param collapse Hides the label below 1024px, leaving the icons: pass an `aria-label`, since the label no longer names the button.
 * @param className Additional CSS class names to apply to the button.
 * @param children The label.
 * @param props Additional HTML button properties, such as `onClick`.
 */
export const TextAction: FC<TextActionProps> = ({
  size = Size.Md,
  tone = "default",
  leadingIcon,
  trailingIcon,
  collapse,
  className,
  children,
  ...props
}) => (
  <HeadlessButton
    className={clsx(
      "inline-flex shrink-0 items-center whitespace-nowrap transition-colors",
      "hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
      radiusStyles(Radius.Full),
      sizeStyles[size],
      textColorClass(
        tone === "danger" ? TextColor.Failure : TextColor.Secondary
      ),
      textColorClass(
        tone === "danger" ? TextColor.Failure : TextColor.Primary,
        ElementState.Hover
      ),
      bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
      bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active),
      className
    )}
    {...props}
  >
    <IconWrapper
      content={leadingIcon}
      size={iconSizes[size]}
      className="flex items-center"
    />
    {collapse ? <span className="hidden lg:inline">{children}</span> : children}
    <IconWrapper
      content={trailingIcon}
      size={iconSizes[size]}
      className="flex items-center"
    />
  </HeadlessButton>
);

TextAction.displayName = "TextAction";
