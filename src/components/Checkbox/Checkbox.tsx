import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { TEXT_STYLES } from "@/styles/text";
import { Radius, Shadow, Size, TextColor } from "@/types";
import { cn } from "@/util/classes";
import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import clsx from "clsx";
import { type FC } from "react";

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  size?: Size;
  radius?: Radius;
  shadow?: Shadow;
  className?: string;
  labelClassName?: string;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("w-4 h-4"),
  [Size.Sm]: clsx("w-5 h-5"),
  [Size.Md]: clsx("w-6 h-6"),
};

const checkmarkSizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("checked:after:text-sm"),
  [Size.Sm]: clsx("checked:after:text-base"),
  [Size.Md]: clsx("checked:after:text-lg"),
};

export const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  onChange = undefined,
  size = Size.Sm,
  radius = Radius.Xs,
  shadow = undefined,
  className,
  labelClassName,
  label,
  ...props
}) => {
  return (
    <Field className="flex items-center gap-2">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className={cn(
          "group",
          "cursor-pointer",
          "appearance-none",
          "border",
          "border-content-border-secondary-primary",
          radiusStyles(radius),
          shadowStyles(shadow),
          sizeStyles[size],
          checkmarkSizeStyles[size],
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-action-primary-primary",
          "focus:ring-offset-2",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          "data-checked:bg-action-primary-primary",
          "data-checked:border-action-primary-primary",
          className
        )}
        {...props}
      >
        <svg
          className="stroke-white opacity-0 group-data-checked:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HeadlessCheckbox>
      {label && (
        <Label
          className={cn(
            TextColor.Primary,
            TEXT_STYLES[size],
            "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
    </Field>
  );
};

Checkbox.displayName = "Checkbox";
