import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  InteractiveColor,
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

type ButtonSize = Exclude<Size, Size.Lg | Size.Xl>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
    bgColorClass(InteractiveColor.PrimaryPressed, ElementState.Active)
  ),
  [Variant.Secondary]: clsx(
    "border-1",
    "bg-transparent",
    borderColorClass(BorderColor.Default),
    borderColorClass(BorderColor.Focus, ElementState.Hover), // design calls for focus color on hover
    borderColorClass(BorderColor.Focus, ElementState.Active),
    borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    bgColorClass(InteractiveColor.SecondaryPressed, ElementState.Active)
  ),
  [Variant.Success]: clsx(
    bgColorClass(InteractiveColor.SuccessDefault),
    bgColorClass(InteractiveColor.SuccessHover, ElementState.Hover),
    bgColorClass(InteractiveColor.SuccessPressed, ElementState.Active)
  ),
  [Variant.Danger]: clsx(
    bgColorClass(InteractiveColor.DangerDefault),
    bgColorClass(InteractiveColor.DangerHover, ElementState.Hover),
    bgColorClass(InteractiveColor.DangerPressed, ElementState.Active)
  ),
  [Variant.Icon]: clsx(
    "aspect-square min-w-0 shrink-0", // square icon button, not a rectangle
    "bg-transparent",
    bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
  ),
  [Variant.Borderless]: clsx(
    "bg-transparent",
    "border-0",
    bgColorClass(BackgroundColor.CardElevated, ElementState.Hover),
    radiusStyles(Radius.Full)
  ),
};

const variantTextStyles: Record<Variant, string> = {
  [Variant.Primary]: "text-white",
  [Variant.Secondary]: textColorClass(TextColor.Primary),
  [Variant.Success]: "text-white",
  [Variant.Danger]: "text-white",
  [Variant.Icon]: textColorClass(TextColor.Secondary),
  [Variant.Borderless]: clsx(
    textColorClass(TextColor.Secondary),
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
  ...props
}) => {
  const isIconOnly = variant === Variant.Icon || borderless;

  return (
    <HeadlessButton
      className={cn(
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
      )}
      {...props}
    >
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
    </HeadlessButton>
  );
};

Button.displayName = "Button";
