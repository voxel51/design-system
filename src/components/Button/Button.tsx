import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { FC, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "success" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

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
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
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
        "inline-flex items-center justify-center rounded",
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
