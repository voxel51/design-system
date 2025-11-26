import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import type { FC, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outlined";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// todo - light/dark
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary",
  outlined:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
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
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "hover:cursor-pointer",
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
