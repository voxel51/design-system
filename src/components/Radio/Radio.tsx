import { Field, Radio as HeadlessRadio, Label } from "@headlessui/react";
import clsx from "clsx";
import { type FC, InputHTMLAttributes } from "react";

import { textStyles } from "@/styles/text.ts";
import { Size, TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { RadioDotIcon } from "../Icons/RadioDot";

type ModifiedRadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className" | "type"
>;

export interface RadioProps extends ModifiedRadioProps {
  value?: string;
  label?: string;
  disabled?: boolean;
  size?: Size;
  className?: string;
  labelClassName?: string;
}

const textSizeStyles: Partial<Record<Size, string | null>> = {
  [Size.Sm]: textStyles(TextVariant.Sm),
  [Size.Md]: textStyles(TextVariant.Md),
  [Size.Lg]: textStyles(TextVariant.Lg),
};

const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: clsx("w-4 h-4"),
  [Size.Md]: clsx("w-5 h-5"),
  [Size.Lg]: clsx("w-6 h-6"),
};

const dotSizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: clsx("before:w-1 before:h-1"),
  [Size.Md]: clsx("before:w-1.5 before:h-1.5"),
  [Size.Lg]: clsx("before:w-2 before:h-2"),
};

export const Radio: FC<RadioProps> = ({
  value,
  size = Size.Sm,
  className,
  labelClassName,
  label,
  disabled,
  ...props
}) => {
  return (
    <Field className="group flex items-center gap-2">
      <HeadlessRadio
        value={value}
        disabled={disabled}
        className={cn(
          "peer",
          !disabled && "cursor-pointer",
          "appearance-none",
          "border",
          "border-content-text-tertiary",
          disabled && "opacity-50",
          "rounded-full",
          sizeStyles[size],
          // on focus - unchecked
          !disabled && "focus:outline-none",
          !disabled && "focus:ring-2",
          !disabled && "focus:ring-action-primary-primary",
          // on hover - unchecked (only when not disabled)
          !disabled && "hover:border-action-primary-primary",
          !disabled && "hover:border-1",
          // when hovering label, also hover radio (only when not disabled)
          !disabled && "group-hover:border-action-primary-primary",
          !disabled && "group-hover:border-1",
          // checked styles (override base styles)
          "data-[checked]:border-2",
          "data-[checked]:border-action-primary-primary",
          "data-[checked]:focus:ring-0",
          "relative",
          // for the dot
          "before:content-['']",
          "before:absolute",
          dotSizeStyles[size],
          "before:top-1/2",
          "before:left-1/2",
          "before:-translate-x-1/2",
          "before:-translate-y-1/2",
          "before:rounded-full",
          "before:bg-action-primary-primary",
          "before:opacity-0",
          "data-[checked]:before:opacity-100",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute",
            "inset-0",
            "flex",
            "items-center",
            "justify-center",
            "pointer-events-none"
          )}
        >
          <RadioDotIcon />
        </div>
      </HeadlessRadio>
      {label && (
        <Label
          className={cn(
            textColorClass(disabled ? TextColor.Secondary : TextColor.Primary),
            textSizeStyles[size],
            !disabled && "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
    </Field>
  );
};

Radio.displayName = "Radio";
