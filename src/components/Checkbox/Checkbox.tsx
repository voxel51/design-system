import radiusStyles from "@/styles/radius";
import { Radius, Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";
import { Checkbox as HeadlessCheckbox, Field, Label } from "@headlessui/react";
import clsx from "clsx";
import { type FC, InputHTMLAttributes } from "react";
import { CheckmarkIcon } from "../Icons/Checkmark";
import { TEXT_STYLES } from "@/styles/text.ts";

type ModifiedCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className"
>;

export interface CheckboxProps extends ModifiedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: Size;
  radius?: Radius;
  className?: string;
  labelClassName?: string;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("w-3 h-3"),
  [Size.Sm]: clsx("w-4 h-4"),
  [Size.Md]: clsx("w-5 h-5"),
  [Size.Lg]: clsx("w-6 h-6"),
};

const checkmarkSizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("checked:after:text-xs"),
  [Size.Sm]: clsx("checked:after:text-sm"),
  [Size.Md]: clsx("checked:after:text-base"),
  [Size.Lg]: clsx("checked:after:text-lg"),
};

export const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  onChange = undefined,
  size = Size.Md,
  radius = Radius.Xs,
  className,
  labelClassName,
  label,
  ...props
}) => {
  return (
    <Field className="group flex items-center gap-2">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className={cn(
          "group",
          "cursor-pointer",
          "appearance-none",
          "border",
          "border-content-border-secondary-primary",
          "group-hover:border-action-primary-primary",
          radiusStyles(radius),
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
        <CheckmarkIcon />
      </HeadlessCheckbox>
      {label && (
        <Label
          className={cn(
            textColorClass(TextColor.Primary),
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
