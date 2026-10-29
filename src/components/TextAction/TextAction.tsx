import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import { ActionTooltip } from "@/components/Tooltip/ActionTooltip";
import collapseStyles, {
  type Collapse,
  resolveCollapse,
  useLabelHidden,
} from "@/styles/collapse";
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
import { COLLAPSE_LABEL_ATTR, useOverflowRowFit } from "@/util/compact";

type TextActionSize = `${Size.Sm | Size.Md | Size.Lg}`;

export type TextActionTone = "default" | "danger";

export interface TextActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: TextActionSize;
  tone?: TextActionTone;
  leadingIcon?: IconInput;
  trailingIcon?: IconInput;
  /**
   * Hides the label below a breakpoint, leaving the icons: `true` or `"lg"`
   * below 1024px, `"sm"` below 640px, `"always"` at every width, `"auto"`
   * while the enclosing row is compact. Give it an `aria-label`.
   */
  collapse?: Collapse;
  /**
   * More about the action, such as why it is disabled: its tooltip, under its
   * name while the label is collapsed.
   */
  hint?: ReactNode;
}

// Figma BorderlessButton, label styles: Small is 28px tall with 12px side
// padding and a 12/16 label; Medium 32px, 16px and 14/20; Large 36px, 16px
// and 15/20. The icon-to-label gap is 4px at Small and 6px above.
const sizeStyles: Record<TextActionSize, string> = {
  [Size.Sm]: clsx("h-7 gap-1", TEXT_STYLES[TextVariant.BodyTertiary]),
  [Size.Md]: clsx("h-8 gap-1.5", TEXT_STYLES[TextVariant.BodySecondary]),
  [Size.Lg]: clsx("h-9 gap-1.5", TEXT_STYLES[TextVariant.BodyPrimary]),
};

// A collapsed action drops to icon padding while its label is hidden, so an
// icon alone sits in a square rather than a label-wide pill.
const paddingStyles: Record<
  "full" | "sm" | "lg" | "always",
  Record<TextActionSize, string>
> = {
  full: { [Size.Sm]: "px-3", [Size.Md]: "px-4", [Size.Lg]: "px-4" },
  sm: {
    [Size.Sm]: "px-1.5 sm:px-3",
    [Size.Md]: "px-2 sm:px-4",
    [Size.Lg]: "px-2 sm:px-4",
  },
  lg: {
    [Size.Sm]: "px-1.5 lg:px-3",
    [Size.Md]: "px-2 lg:px-4",
    [Size.Lg]: "px-2 lg:px-4",
  },
  always: { [Size.Sm]: "px-1.5", [Size.Md]: "px-2", [Size.Lg]: "px-2" },
};

const iconSizes: Record<TextActionSize, number> = {
  [Size.Sm]: 14,
  [Size.Md]: 16,
  [Size.Lg]: 18,
};

/**
 * A borderless pill for secondary actions: secondary text that fills on hover.
 *
 * As a toggle, pass `aria-pressed`: while it is `true` the pill keeps its
 * hover fill and primary text.
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
 * @param collapse Hides the label below a breakpoint, leaving the icons: `true` or `"lg"` below 1024px, `"sm"` below 640px, `"always"` at every width, `"auto"` while the enclosing row is compact (then its tooltip names it). Pass an `aria-label`, since the label no longer names the button.
 * @param hint More about the action, such as why it is disabled: its tooltip, under its name while the label is collapsed.
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
  hint,
  className,
  children,
  ...props
}) => {
  const fit = useOverflowRowFit();
  const resolved = resolveCollapse(collapse, fit.compact);
  const labelHidden = useLabelHidden(resolved);
  // a row short of room cuts an "auto" label before it drops it
  const labelMax = collapse === "auto" ? fit.labelMax : null;
  return (
    <ActionTooltip
      collapsed={labelHidden}
      truncatable={collapse === "auto"}
      label={props["aria-label"] ?? children}
      hint={hint}
    >
      <HeadlessButton
        className={clsx(
          "inline-flex shrink-0 items-center whitespace-nowrap transition-colors",
          "hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
          radiusStyles(Radius.Full),
          sizeStyles[size],
          paddingStyles[
            resolved ? (resolved === true ? "lg" : resolved) : "full"
          ][size],
          textColorClass(
            tone === "danger" ? TextColor.Failure : TextColor.Secondary
          ),
          textColorClass(
            tone === "danger" ? TextColor.Failure : TextColor.Primary,
            ElementState.Hover
          ),
          bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
          bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active),
          // a toggle that is on (`aria-pressed`) keeps its hover look
          tone !== "danger" && "aria-pressed:text-content-text-primary",
          "aria-pressed:bg-content-interactive-secondary-hover",
          className
        )}
        {...props}
      >
        <IconWrapper
          content={leadingIcon}
          size={iconSizes[size]}
          className="flex items-center"
        />
        {collapse ? (
          <span
            {...{ [COLLAPSE_LABEL_ATTR]: "" }}
            className={collapseStyles(resolved || undefined)}
            style={labelMax === null ? undefined : { maxWidth: labelMax }}
          >
            {children}
          </span>
        ) : (
          children
        )}
        <IconWrapper
          content={trailingIcon}
          size={iconSizes[size]}
          className="flex items-center"
        />
      </HeadlessButton>
    </ActionTooltip>
  );
};

TextAction.displayName = "TextAction";
