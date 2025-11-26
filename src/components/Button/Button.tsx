import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { FC, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "xs" | "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// todo - light/dark
const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
      "bg-action-primary-primary",
      "hover:bg-action-primary-hover",
      "active:bg-action-primary-active",
      "text-action-primary-text",
  ),
  secondary: clsx(
      "border-1",
      "bg-action-secondary-primary border-content-border-secondary-primary",
      "hover:bg-action-secondary-hover hover:border-content-border-secondary-hover",
      "active:bg-action-secondary-active active:border-content-border-secondary-active",
      "text-action-secondary-text",
      "disabled:border-content-border-secondary-disabled",
  ),
  success: clsx(
      "bg-action-success-primary",
      "hover:bg-action-success-hover",
      "active:bg-action-success-active",
      "text-action-success-text",
  ),
  danger: clsx(
      "bg-action-danger-primary",
      "hover:bg-action-danger-hover",
      "active:bg-action-danger-active",
      "text-action-danger-text",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-0.75 text-xs/5",
  sm: "px-3.5 py-1.5 text-sm/5",
  md: "px-4 py-2 text-base/5",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <HeadlessButton
      className={clsx(
        "inline-flex items-center justify-center rounded-sm",
        "font-medium transition-colors",
        "hover:cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </HeadlessButton>
  );
};
