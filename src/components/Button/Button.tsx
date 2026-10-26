import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  Children,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import { ActionTooltip } from "@/components/Tooltip/ActionTooltip";
import collapseStyles, {
  type Collapse,
  resolveCollapse,
} from "@/styles/collapse";
import radiusStyles from "@/styles/radius";
import { CAPTION_SIZE, TEXT_STYLES } from "@/styles/text";
import {
  InteractiveColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";
import { useOverflowRowCompact } from "@/util/compact";

// Template-literal wrap defeats TS alias preservation so hovers and type
// errors list the accepted strings instead of the alias name.
type ButtonSize = `${Exclude<Size, Size.Lg | Size.Xl>}`;

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> {
  /**
   * Renders an anchor with the button's look. For a navigation action — a
   * docs link in a toolbar — so the element is a real link (middle-click,
   * copy address) without nesting a button inside one.
   */
  href?: string;
  variant?: Variant;
  size?: ButtonSize;
  leadingIcon?: IconInput;
  trailingIcon?: IconInput;
  borderless?: boolean;
  /**
   * Hides the text label below a breakpoint, leaving the icons: `true` or
   * `"lg"` below 1024px, `"sm"` below 640px, `"always"` at every width,
   * `"auto"` while the enclosing row is compact. Give it an `aria-label`.
   */
  collapse?: Collapse;
  /**
   * More about the action, such as why it is disabled: its tooltip, under its
   * name while the label is collapsed.
   */
  hint?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  [Variant.Primary]: clsx(
    bgColorClass(InteractiveColor.PrimaryDefault),
    bgColorClass(InteractiveColor.PrimaryHover, ElementState.Hover),
    bgColorClass(InteractiveColor.PrimaryPressed, ElementState.Active),
    "disabled:opacity-50"
  ),
  // Figma: the outlined button has no fill in any state. Hover and pressed
  // move the border only (border/hover, then border/focus), and disabled
  // swaps to the disabled border and tertiary text instead of fading.
  [Variant.Secondary]: clsx(
    "border-1",
    "bg-transparent",
    borderColorClass(BorderColor.Default),
    borderColorClass(BorderColor.Hover, ElementState.Hover),
    borderColorClass(BorderColor.Focus, ElementState.Active),
    borderColorClass(BorderColor.Disabled, ElementState.Disabled)
  ),
  [Variant.Success]: clsx(
    bgColorClass(InteractiveColor.SuccessDefault),
    bgColorClass(InteractiveColor.SuccessHover, ElementState.Hover),
    bgColorClass(InteractiveColor.SuccessPressed, ElementState.Active),
    "disabled:opacity-50"
  ),
  [Variant.Danger]: clsx(
    bgColorClass(InteractiveColor.DangerDefault),
    bgColorClass(InteractiveColor.DangerHover, ElementState.Hover),
    bgColorClass(InteractiveColor.DangerPressed, ElementState.Active),
    "disabled:opacity-50"
  ),
  // Icon and borderless share BorderlessButton's surface: no fill at rest,
  // interactive/secondary-hover on hover, -pressed while pressed.
  [Variant.Icon]: clsx(
    "min-w-0 shrink-0", // Figma: 40×36, not a square; padding sets the size
    "bg-transparent",
    bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
    bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active),
    "disabled:opacity-50"
  ),
  [Variant.Borderless]: clsx(
    "bg-transparent",
    "border-0",
    bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
    bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active),
    radiusStyles(Radius.Full),
    "disabled:opacity-50"
  ),
  [Variant.Expressive]: clsx(
    "bg-(image:--gradient-action-expressive)",
    "hover:brightness-110",
    "active:brightness-95",
    "disabled:opacity-50"
  ),
};

// The filled variants need a color that contrasts with the *fill*, not with
// the page. Figma has no contrast-text token -- the old `action-*-text` tokens
// were invented here and never existed as variables -- so the filled variants
// take white directly. All three fills (orange 500, green 500, red 500) are
// mode-independent, so one literal is correct in both themes.
const ON_FILL = "text-white";

// Applied to the <button> itself, not the content wrapper: `disabled:` only
// matches form elements, so a disabled text colour on an inner div never
// fires, and `hover:` should cover the padding too.
const variantTextStyles: Record<Variant, string> = {
  [Variant.Primary]: ON_FILL,
  [Variant.Secondary]: clsx(
    textColorClass(TextColor.Secondary),
    textColorClass(TextColor.Tertiary, ElementState.Disabled)
  ),
  [Variant.Success]: ON_FILL,
  [Variant.Danger]: ON_FILL,
  [Variant.Icon]: clsx(
    textColorClass(TextColor.Secondary),
    textColorClass(TextColor.Primary, ElementState.Hover)
  ),
  [Variant.Borderless]: clsx(
    textColorClass(TextColor.Secondary),
    textColorClass(TextColor.Primary, ElementState.Hover)
  ),
  [Variant.Expressive]: ON_FILL,
};

// Figma Button: padding is 8/16 for Medium, 6/12 for Small and 4/10 for
// X-small, with a 6px gap between icon and label at every size.
const sizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: "px-2.5 py-1",
  [Size.Sm]: "px-3 py-1.5",
  [Size.Md]: "px-4 py-2",
};

// Icon-only buttons are not square in Figma: 40×36, 36×32 and 30×26.
const iconOnlySizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: "px-2 py-1.5",
  [Size.Sm]: "px-2.5 py-2",
  [Size.Md]: "px-3 py-2.5",
};

// A collapsed button is sized as icon-only while its label is hidden.
const collapsedSizeStyles: Record<
  "sm" | "lg" | "always",
  Record<ButtonSize, string>
> = {
  sm: {
    [Size.Xs]: "px-2 py-1.5 sm:px-2.5 sm:py-1",
    [Size.Sm]: "px-2.5 py-2 sm:px-3 sm:py-1.5",
    [Size.Md]: "px-3 py-2.5 sm:px-4 sm:py-2",
  },
  lg: {
    [Size.Xs]: "px-2 py-1.5 lg:px-2.5 lg:py-1",
    [Size.Sm]: "px-2.5 py-2 lg:px-3 lg:py-1.5",
    [Size.Md]: "px-3 py-2.5 lg:px-4 lg:py-2",
  },
  always: iconOnlySizeStyles,
};

// Filled buttons carry a medium label (type/heading-sm, heading-xs); the
// outlined secondary carries a regular one (type/body-secondary, -tertiary).
// X-small is type/caption for both.
const filledLabelStyles: Record<ButtonSize, string> = {
  [Size.Xs]: CAPTION_SIZE,
  [Size.Sm]: TEXT_STYLES[TextVariant.HeadingXs],
  [Size.Md]: TEXT_STYLES[TextVariant.HeadingSm],
};

const outlinedLabelStyles: Record<ButtonSize, string> = {
  [Size.Xs]: CAPTION_SIZE,
  [Size.Sm]: TEXT_STYLES[TextVariant.BodyTertiary],
  [Size.Md]: TEXT_STYLES[TextVariant.BodySecondary],
};

// Icon glyph sizes from the Figma set: 16px at Medium, 14px below.
const iconSizes: Record<ButtonSize, number> = {
  [Size.Xs]: 14,
  [Size.Sm]: 14,
  [Size.Md]: 16,
};

/**
 * A basic button component.
 *
 * @example
 * ```tsx
 *   <Button variant="primary" size="sm" leadingIcon={AddIcon} onClick={save}>
 *     Add dataset
 *   </Button>
 * ```
 *
 * @param variant The button variant; this controls the general styling of the button. See {@link Variant}.
 * @param size The size of the button; this controls both the text size and the button size: `"xs"`, `"sm"` or `"md"`. Defaults to `"md"`.
 * @param target Link target; only used with `href`.
 * @param rel Link rel; only used with `href`. Defaults to `"noreferrer"` when `target` is `"_blank"`.
 * @param borderless Boolean controlling whether the button should be "borderless," removing any borders and
 *  rounding the corners.
 * @param leadingIcon Optional icon component which prefixes the button's content.
 * @param trailingIcon Optional icon component which postfixes the button's content.
 * @param collapse Hides the text label below a breakpoint, leaving the icons (including icons passed as children): `true` or `"lg"` below 1024px, `"sm"` below 640px, `"always"` at every width, `"auto"` while the enclosing row is compact (then its tooltip names it). Pass an `aria-label`.
 * @param hint More about the action, such as why it is disabled: its tooltip, under its name while the label is collapsed.
 * @param className `class` overrides to apply to the component.
 * @param children Button content.
 * @param props Additional HTML properties to apply to the component.
 */
export const Button: FC<ButtonProps> = ({
  variant = Variant.Primary,
  size = Size.Md,
  borderless = false,
  leadingIcon,
  trailingIcon,
  collapse: collapseProp,
  hint,
  className,
  children,
  href,
  target,
  rel,
  ...props
}) => {
  // A borderless button is a circle unless it carries a text label, in which
  // case it is a pill and aspect-square would inflate it to its width. Only
  // text nodes count as a label: an icon passed as a child keeps the circle.
  const collapse = resolveCollapse(collapseProp, useOverflowRowCompact());
  const childArray = Children.toArray(children);
  const hasLabel = childArray.some(
    (child) =>
      (typeof child === "string" && child.trim() !== "") ||
      typeof child === "number"
  );
  // With an icon prop set, an element child (e.g. a translation component)
  // is the label, not a second icon, so it keeps the rectangular padding.
  const hasElementChild = childArray.some((child) => isValidElement(child));
  const isIconOnly =
    variant === Variant.Icon ||
    (!hasLabel &&
      (borderless ||
        (!hasElementChild && Boolean(leadingIcon || trailingIcon))));

  const labelStyles =
    variant === Variant.Secondary ? outlinedLabelStyles : filledLabelStyles;

  const classes = cn(
    "inline-flex items-center justify-center",
    borderless && !hasLabel && "aspect-square min-w-0 shrink-0", // circular
    borderless ? radiusStyles(Radius.Full) : radiusStyles(Radius.Sm),
    labelStyles[size],
    variant === Variant.Expressive
      ? "transition-[filter]"
      : "transition-colors",
    "hover:cursor-pointer",
    "disabled:cursor-not-allowed disabled:pointer-events-none",
    isIconOnly
      ? iconOnlySizeStyles[size]
      : collapse
        ? collapsedSizeStyles[collapse === true ? "lg" : collapse][size]
        : sizeStyles[size],
    variantStyles[variant],
    variantTextStyles[variant],
    borderless && "border-0",
    className
  );

  const content = (
    <div className="flex flex-nowrap items-center justify-center gap-1.5">
      <IconWrapper
        content={leadingIcon}
        size={iconSizes[size]}
        className="flex shrink-0 items-center justify-center"
      />

      {collapse
        ? Children.map(children, (child) =>
            typeof child === "string" || typeof child === "number" ? (
              <span className={collapseStyles(collapse)}>{child}</span>
            ) : (
              child
            )
          )
        : children}

      <IconWrapper
        content={trailingIcon}
        size={iconSizes[size]}
        className="flex shrink-0 items-center justify-center"
      />
    </div>
  );

  const withTooltip = (element: ReactElement): ReactElement => (
    <ActionTooltip
      collapsed={collapse === "always"}
      label={props["aria-label"] ?? (hasLabel ? children : undefined)}
      hint={hint}
    >
      {element}
    </ActionTooltip>
  );

  // A disabled link is a disabled button: an anchor has no `disabled` state,
  // so it would still navigate and never wear the disabled styles
  if (href && !props.disabled) {
    const { type: _type, ...anchorProps } = props;
    return withTooltip(
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
        {...(anchorProps as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return withTooltip(
    <HeadlessButton className={classes} {...props}>
      {content}
    </HeadlessButton>
  );
};

Button.displayName = "Button";
