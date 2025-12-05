import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { FC, ButtonHTMLAttributes } from "react";
import { cn } from "@/util/classes";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "xs" | "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: FC;
  trailingIcon?: FC;
  borderless?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    "bg-action-primary-primary",
    "hover:bg-action-primary-secondary",
    "active:bg-action-primary-tertiary",
    "text-action-primary-text"
  ),
  secondary: clsx(
    "border-1",
    "bg-action-secondary-primary border-content-border-secondary-primary",
    "hover:bg-action-secondary-secondary hover:border-content-border-secondary-secondary",
    "active:bg-action-secondary-tertiary active:border-content-border-secondary-tertiary",
    "text-action-secondary-text",
    "disabled:border-content-border-secondary-disabled"
  ),
  success: clsx(
    "bg-action-success-primary",
    "hover:bg-action-success-secondary",
    "active:bg-action-success-tertiary",
    "text-action-success-text"
  ),
  danger: clsx(
    "bg-action-danger-primary",
    "hover:bg-action-danger-secondary",
    "active:bg-action-danger-tertiary",
    "text-action-danger-text"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: clsx("px-2.5 py-0.75", "text-xs/5"),
  sm: clsx("px-3.5 py-1.5", "text-sm/5"),
  md: clsx("px-4 py-2", "text-md/5"),
};

const iconStyles: Record<ButtonSize, string> = {
  xs: clsx("w-4 h-4", "leading-none"),
  sm: clsx("w-4 h-4", "leading-none"),
  md: clsx("w-5 h-5", "leading-none"),
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
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
        borderless ? "border-0" : "",
        className
      )}
      {...props}
    >
      <div className="flex flex-nowrap align-items justify-center gap-x-sm">
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
