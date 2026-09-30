import { Field, Radio as HeadlessRadio, Label } from "@headlessui/react";
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
  // Figma RadioButton is one 14px control with a 15/20 label.
  [Size.Sm]: textStyles(TextVariant.BodyPrimary),
  [Size.Md]: textStyles(TextVariant.BodyPrimary),
  [Size.Lg]: textStyles(TextVariant.BodyPrimary),
};

const sizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
};

const dotSizeStyles: Partial<Record<Size, string>> = {
  [Size.Sm]: "before:size-[5px]",
  [Size.Md]: "before:size-1.5",
  [Size.Lg]: "before:size-[7px]",
};

/**
 * A basic radio component.
 *
 * @example
 * ```tsx
 * <Radio value="car" label="Car" />
 * ```
 *
 * @param value The value of the radio element.
 * @param size The size of the radio element. See {@link Size}.
 * @param className `class` overrides to apply to the radio.
 * @param labelClassName `class` overrides to apply to the radio's label.
 * @param label Label to display for the radio element.
 * @param disabled If `true`, disables the radio element.
 * @param props Additional HTML properties to apply to the radio.
 */
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
    <Field className="group flex items-center gap-3">
      <HeadlessRadio
        value={value}
        disabled={disabled}
        className={cn(
          "peer",
          !disabled && "cursor-pointer",
          "appearance-none",
          "border",
          "border-content-text-tertiary",
          "bg-content-icon-emphasis",
          disabled && "opacity-50",
          "rounded-full",
          sizeStyles[size],
          // on focus - unchecked
          !disabled && "focus:outline-none",
          !disabled && "focus:ring-2",
          !disabled && "focus:ring-content-interactive-primary-default",
          // on hover - unchecked (only when not disabled)
          !disabled && "hover:border-content-interactive-primary-hover",
          !disabled && "hover:border-1",
          // when hovering label, also hover radio (only when not disabled)
          !disabled && "group-hover:border-content-interactive-primary-hover",
          !disabled && "group-hover:border-1",
          // checked styles (override base styles)
          "data-[checked]:border-2",
          "data-[checked]:border-content-interactive-primary-default",
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
          "before:bg-content-interactive-primary-default",
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
            // Figma: label is white when enabled, tertiary when disabled
            textColorClass(disabled ? TextColor.Tertiary : TextColor.Primary),
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
