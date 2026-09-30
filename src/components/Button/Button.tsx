import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  Children,
  FC,
} from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
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
    "aspect-square min-w-0 shrink-0", // square icon button, not a rectangle
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
  // Figma ExpressiveButton: the gradient itself steps darker on hover and
  // pressed instead of a brightness filter.
  [Variant.Expressive]: clsx(
    "bg-(image:--gradient-action-expressive)",
    "hover:bg-(image:--gradient-action-expressive-hover)",
    "active:bg-(image:--gradient-action-expressive-pressed)",
    "disabled:opacity-50"
  ),
};

// The filled variants need a color that contrasts with the *fill*, not with
// the page. Figma has no contrast-text token -- the old `action-*-text` tokens
// were invented here and never existed as variables -- so the filled variants
// take white directly. All three fills (orange 500, green 500, red 500) are
// mode-independent, so one literal is correct in both themes.
const ON_FILL = "text-white";

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

// Filled buttons carry a medium label (type/heading-sm, heading-xs); the
// outlined secondary carries a regular one (type/body-secondary, -tertiary).
// X-small is type/caption for both.
const filledLabelStyles: Record<ButtonSize, string> = {
  [Size.Xs]: TEXT_STYLES[TextVariant.Caption],
  [Size.Sm]: TEXT_STYLES[TextVariant.HeadingXs],
  [Size.Md]: TEXT_STYLES[TextVariant.HeadingSm],
};

const outlinedLabelStyles: Record<ButtonSize, string> = {
  [Size.Xs]: TEXT_STYLES[TextVariant.Caption],
  [Size.Sm]: TEXT_STYLES[TextVariant.BodyTertiary],
  [Size.Md]: TEXT_STYLES[TextVariant.BodySecondary],
};

// Icon glyph sizes from the Figma set: 16px at Medium, 14px below.
const iconSizes: Record<ButtonSize, number> = {
  [Size.Xs]: 14,
  [Size.Sm]: 14,
  [Size.Md]: 16,
};

// Figma ExpressiveButton is its own set with its own scale: Large 36px tall
// (6/16 padding, 8px gap, 18px icon, 15/20), Medium 32px (6/12, 6px, 16px,
// 14/20), Small 24px (4/10, 6px, 14px, 12/16), all regular weight. Md / Sm /
// Xs here map onto Large / Medium / Small.
const expressiveSizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: "px-2.5 py-1 gap-1.5",
  [Size.Sm]: "px-3 py-1.5 gap-1.5",
  [Size.Md]: "px-4 py-1.5 gap-2",
};

const expressiveLabelStyles: Record<ButtonSize, string> = {
  [Size.Xs]: TEXT_STYLES[TextVariant.BodyTertiary],
  [Size.Sm]: TEXT_STYLES[TextVariant.BodySecondary],
  [Size.Md]: TEXT_STYLES[TextVariant.BodyPrimary],
};

const expressiveIconSizes: Record<ButtonSize, number> = {
  [Size.Xs]: 14,
  [Size.Sm]: 16,
  [Size.Md]: 18,
};

/**
 * A basic button component.
 *
 * @example
 * ```tsx
 *   <Button onClick={() => alert("Button clicked")}>
 *     Click me
 *   </Button>
 * ```
 *
 * @param variant The button variant; this controls the general styling of the button. See {@link Variant}.
 * @param size The size of the button; this controls both the text size and the button size. See {@link Size}.
 * @param borderless Boolean controlling whether the button should be "borderless," removing any borders and
 *  rounding the corners.
 * @param leadingIcon Optional icon component which prefixes the button's content.
 * @param trailingIcon Optional icon component which postfixes the button's content.
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
  const hasLabel = Children.toArray(children).some(
    (child) =>
      (typeof child === "string" && child.trim() !== "") ||
      typeof child === "number"
  );
  const isIconOnly =
    variant === Variant.Icon ||
    (!hasLabel && (borderless || Boolean(leadingIcon || trailingIcon)));

  const isExpressive = variant === Variant.Expressive;
  const labelStyles = isExpressive
    ? expressiveLabelStyles
    : variant === Variant.Secondary
      ? outlinedLabelStyles
      : filledLabelStyles;
  const glyphSize = (isExpressive ? expressiveIconSizes : iconSizes)[size];

  const classes = cn(
    "inline-flex items-center justify-center",
    borderless && !hasLabel && "aspect-square min-w-0 shrink-0", // circular
    borderless ? radiusStyles(Radius.Full) : radiusStyles(Radius.Sm),
    labelStyles[size],
    "transition-colors",
    "hover:cursor-pointer",
    "disabled:cursor-not-allowed disabled:pointer-events-none",
    isIconOnly
      ? iconOnlySizeStyles[size]
      : isExpressive
        ? expressiveSizeStyles[size]
        : sizeStyles[size],
    variantStyles[variant],
    borderless && "border-0",
    className
  );

  const content = (
    <div
      className={clsx(
        "flex flex-nowrap items-center justify-center",
        isExpressive && size === Size.Md ? "gap-2" : "gap-1.5",
        variantTextStyles[variant]
      )}
    >
      <IconWrapper
        content={leadingIcon}
        size={glyphSize}
        className="flex shrink-0 items-center justify-center"
      />

      {children}

      <IconWrapper
        content={trailingIcon}
        size={glyphSize}
        className="flex shrink-0 items-center justify-center"
      />
    </div>
  );

  // A disabled link is a disabled button: an anchor has no `disabled` state,
  // so it would still navigate and never wear the disabled styles
  if (href && !props.disabled) {
    const { type: _type, ...anchorProps } = props;
    return (
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

  return (
    <HeadlessButton className={classes} {...props}>
      {content}
    </HeadlessButton>
  );
};

Button.displayName = "Button";
