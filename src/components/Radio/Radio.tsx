import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text.ts";
import { Radius, Size, TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";
import { Field, Label } from "@headlessui/react";
import clsx from "clsx";
import { ChangeEvent, type FC, InputHTMLAttributes, useId } from "react";
import { RadioDotIcon } from "../Icons/RadioDot";

type ModifiedRadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className" | "type"
>;

export interface RadioProps extends ModifiedRadioProps {
  value?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: Size;
  radius?: Radius;
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
  checked = false,
  onChange = undefined,
  size = Size.Sm,
  radius = Radius.Full,
  className,
  labelClassName,
  label,
  disabled,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <Field className="group flex items-center gap-2">
      <input
        type="radio"
        id={inputId}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "peer",
          "cursor-pointer",
          "appearance-none",
          "border",
          "border-content-text-tertiary",
          radiusStyles(radius),
          sizeStyles[size],
          // on focus
          "focus:outline-none",
          checked && "focus-0",
          !checked && "focus:ring-2",
          // on hover
          !checked && "focus:ring-action-primary-primary",
          !checked && "hover:border-action-primary-primary",
          !checked && "hover:border-1",
          // disabled styles
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          // checked styles
          "checked:border-2",
          "checked:border-action-primary-primary",
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
          "checked:before:opacity-100",
          className
        )}
        {...props}
      />
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
      {label && (
        <Label
          htmlFor={inputId}
          className={cn(
            textColorClass(TextColor.Primary),
            textSizeStyles[size],
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

Radio.displayName = "Radio";
