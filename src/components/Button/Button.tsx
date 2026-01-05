import {
  ActionColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";
import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";
import radiusStyles from "@/styles/radius";

type ButtonSize = Exclude<Size, Size.Lg>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: ButtonSize;
  leadingIcon?: FC;
  trailingIcon?: FC;
  borderless?: boolean;
}

const variantStyles: Record<Variant, string> = {
  [Variant.Primary]: clsx(
    bgColorClass(ActionColor.PrimaryDefault),
    bgColorClass(ActionColor.PrimaryHover, ElementState.Hover),
    bgColorClass(ActionColor.PrimaryFocus, ElementState.Active),
    textColorClass(ActionColor.PrimaryText)
  ),
  [Variant.Secondary]: clsx(
    "border-1",
    bgColorClass(ActionColor.SecondaryDefault),
    borderColorClass(BorderColor.Default),
    bgColorClass(ActionColor.SecondaryHover, ElementState.Hover),
    borderColorClass(BorderColor.Hover, ElementState.Hover),
    bgColorClass(ActionColor.SecondaryFocus, ElementState.Active),
    borderColorClass(BorderColor.Focus, ElementState.Active),
    textColorClass(ActionColor.SecondaryText),
    borderColorClass(BorderColor.Disabled, ElementState.Disabled)
  ),
  [Variant.Success]: clsx(
    bgColorClass(ActionColor.SuccessDefault),
    bgColorClass(ActionColor.SuccessHover, ElementState.Hover),
    bgColorClass(ActionColor.SuccessFocus, ElementState.Active),
    textColorClass(ActionColor.SuccessText)
  ),
  [Variant.Danger]: clsx(
    bgColorClass(ActionColor.DangerDefault),
    bgColorClass(ActionColor.DangerHover, ElementState.Hover),
    bgColorClass(ActionColor.DangerFocus, ElementState.Active),
    textColorClass(ActionColor.DangerText)
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

const iconStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("w-4 h-4", "leading-none"),
  [Size.Sm]: clsx("w-4 h-4", "leading-none"),
  [Size.Md]: clsx("w-5 h-5", "leading-none"),
};

export const Button: FC<ButtonProps> = ({
  variant = Variant.Primary,
  size = Size.Md,
  borderless = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className,
  children,
  ...props
}) => {
  return (
    <HeadlessButton
      className={cn(
        "inline-flex items-center justify-center",
        borderless ? radiusStyles(Radius.Full) : radiusStyles(Radius.Sm),
        "font-medium",
        "transition-colors",
        "hover:cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        borderless && "border-0",
        className
      )}
      {...props}
    >
      <div className="flex flex-nowrap items-center justify-center gap-x-sm">
        {LeadingIcon && (
          <span className={clsx(iconStyles[size])}>
            <LeadingIcon />
          </span>
        )}

        {children}

        {TrailingIcon && (
          <span className={clsx(iconStyles[size])}>
            <TrailingIcon />
          </span>
        )}
      </div>
    </HeadlessButton>
  );
};

Button.displayName = "Button";
