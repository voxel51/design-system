import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  ActionColor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
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
    bgColorClass(ActionColor.PrimaryDefault),
    bgColorClass(ActionColor.PrimaryHover, ElementState.Hover),
    bgColorClass(ActionColor.PrimaryFocus, ElementState.Active)
  ),
  [Variant.Secondary]: clsx(
    "border-1",
    "bg-transparent",
    borderColorClass(BorderColor.Default),
    borderColorClass(BorderColor.Focus, ElementState.Hover), // design calls for focus color on hover
    borderColorClass(BorderColor.Focus, ElementState.Active),
    borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    bgColorClass(ActionColor.SecondaryFocus, ElementState.Active)
  ),
  [Variant.Success]: clsx(
    bgColorClass(ActionColor.SuccessDefault),
    bgColorClass(ActionColor.SuccessHover, ElementState.Hover),
    bgColorClass(ActionColor.SuccessFocus, ElementState.Active)
  ),
  [Variant.Danger]: clsx(
    bgColorClass(ActionColor.DangerDefault),
    bgColorClass(ActionColor.DangerHover, ElementState.Hover),
    bgColorClass(ActionColor.DangerFocus, ElementState.Active)
  ),
  [Variant.Icon]: clsx(
    "aspect-square min-w-0 shrink-0", // square icon button, not a rectangle
    "bg-transparent",
    // `card-2`, not `card-elevated`: in the light theme `card-elevated` and
    // `card-1` are both `neutral[0]`, so an elevated hover fill is invisible
    // on a card and near-invisible on the page. `card-2` differs from every
    // surface a transparent button sits on, in both themes.
    bgColorClass(BackgroundColor.Card2, ElementState.Hover)
  ),
  [Variant.Borderless]: clsx(
    "bg-transparent",
    "border-0",
    bgColorClass(BackgroundColor.Card2, ElementState.Hover),
    radiusStyles(Radius.Full)
  ),
};

const variantTextStyles: Record<Variant, string> = {
  [Variant.Primary]: textColorClass(ActionColor.PrimaryText),
  [Variant.Secondary]: textColorClass(ActionColor.SecondaryText),
  [Variant.Success]: textColorClass(ActionColor.SuccessText),
  [Variant.Danger]: textColorClass(ActionColor.DangerText),
  [Variant.Icon]: textColorClass(ActionColor.IconDefault),
  [Variant.Borderless]: clsx(
    textColorClass(TextColor.Secondary),
    // `text-primary`, not `action-primary-text`. The latter is the colour for
    // text sitting ON a filled primary button -- `neutral[0]`, white, in both
    // themes -- and this variant has no fill to sit on. In light it turned the
    // label white on a white surface and the button disappeared on hover.
    textColorClass(TextColor.Primary, ElementState.Hover)
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

// Symmetric padding for icon-only (square) buttons. The rectangular `sizeStyles`
// padding is asymmetric (tuned for text + horizontal breathing room), which combined
// with `aspect-square` inflates the button to its wider dimension.
const iconOnlySizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: "p-1",
  [Size.Sm]: "p-1.5",
  [Size.Md]: "p-2",
};

const iconStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("w-3 h-3", "leading-none"),
  [Size.Sm]: clsx("w-4 h-4", "leading-none"),
  [Size.Md]: clsx("w-5 h-5", "leading-none"),
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
  const isIconOnly = variant === Variant.Icon || borderless;

  const classes = cn(
    "inline-flex items-center justify-center",
    borderless && "aspect-square min-w-0 shrink-0", // circular
    borderless ? radiusStyles(Radius.Full) : radiusStyles(Radius.Sm),
    "font-medium",
    "transition-colors",
    "hover:cursor-pointer",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
    variantStyles[variant],
    borderless && "border-0",
    className
  );

  const content = (
    <div
      className={clsx(
        "flex flex-nowrap items-center justify-center gap-x-sm",
        variantTextStyles[variant]
      )}
    >
      <IconWrapper
        content={leadingIcon}
        size={size}
        className={clsx(iconStyles[size], "flex justify-center items-center")}
      />

      {children}

      <IconWrapper
        content={trailingIcon}
        size={size}
        className={clsx(iconStyles[size], "flex justify-center items-center")}
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
