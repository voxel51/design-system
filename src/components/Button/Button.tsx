import { Size, Variant } from "@/types";
import { cn } from "@/util/classes";
import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { ButtonHTMLAttributes, FC } from "react";

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
    "bg-action-primary-primary",
    "hover:bg-action-primary-secondary",
    "active:bg-action-primary-tertiary",
    "text-action-primary-text"
  ),
  [Variant.Secondary]: clsx(
    "border-1",
    "bg-action-secondary-primary border-content-border-default",
    "hover:bg-action-secondary-secondary hover:border-content-border-hover",
    "active:bg-action-secondary-tertiary active:border-content-border-focus",
    "text-action-secondary-text",
    "disabled:border-content-border-disabled"
  ),
  [Variant.Success]: clsx(
    "bg-action-success-primary",
    "hover:bg-action-success-secondary",
    "active:bg-action-success-tertiary",
    "text-action-success-text"
  ),
  [Variant.Danger]: clsx(
    "bg-action-danger-primary",
    "hover:bg-action-danger-secondary",
    "active:bg-action-danger-tertiary",
    "text-action-danger-text"
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
        borderless ? "rounded-full" : "rounded-sm",
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
