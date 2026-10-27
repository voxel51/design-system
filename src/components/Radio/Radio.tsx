import {
  Description,
  Field,
  Radio as HeadlessRadio,
  Label,
} from "@headlessui/react";
import { type FC, type HTMLAttributes, InputHTMLAttributes } from "react";

import { textStyles } from "@/styles/text.ts";
import { Size, TextColor, textColorClass, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { RadioDotIcon } from "../Icons/RadioDot";

type DataAttributes = { [key: `data-${string}`]: string | undefined };

type ModifiedRadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className" | "type"
>;

export interface RadioProps extends ModifiedRadioProps {
  value?: string;
  label?: string;
  /** A secondary line under the label: what picking this option means. */
  description?: string;
  disabled?: boolean;
  /**
   * @deprecated Figma draws one radio size, so this no longer changes the
   * control or its label. Accepted so existing callers keep compiling.
   */
  size?: Size;
  className?: string;
  labelClassName?: string;
  /** Additional HTML properties for the row holding the radio and its label */
  fieldProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
}

// Figma RadioButton is a single control: 14px circle, 5px dot, 15/20 label.
// There is no size axis, so `size` is accepted for compatibility and ignored
// rather than scaling the circle while the label stays put.
const controlStyles = "size-3.5";
const dotStyles = "before:size-[5px]";
const labelTextStyles = textStyles(TextVariant.BodyPrimary);
const descriptionTextStyles = textStyles(TextVariant.BodySecondary);

/**
 * A single radio option. Render radios through {@link RadioGroup} and its
 * `options`, not on their own: a `Radio` needs a parent radio group to work.
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   options={[
 *     { value: "car", label: "Car" },
 *     { value: "truck", label: "Truck" },
 *   ]}
 *   value={vehicle}
 *   onChange={setVehicle}
 * />
 * ```
 *
 * @param value The value of the radio element.
 * @param size Deprecated; Figma draws a single radio size, so this is ignored.
 * @param className `class` overrides to apply to the radio.
 * @param labelClassName `class` overrides to apply to the radio's label.
 * @param label Label to display for the radio element.
 * @param description A secondary line under the label (14px, secondary
 *  color) saying what picking the option means; the radio aligns with the
 *  label's first line.
 * @param disabled If `true`, disables the radio element.
 * @param fieldProps Additional HTML properties to apply to the row holding the radio and its label.
 * @param props Additional HTML properties to apply to the radio.
 */
export const Radio: FC<RadioProps> = ({
  value,
  className,
  labelClassName,
  label,
  description,
  disabled,
  fieldProps,
  // Deprecated and intentionally unused; kept out of `...props` so it never
  // reaches the DOM.
  size: _size,
  ...props
}) => {
  return (
    <Field
      {...fieldProps}
      className={cn(
        "group flex gap-3",
        // With a description the control sits on the label's first line
        description ? "items-start" : "items-center",
        fieldProps?.className
      )}
    >
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
          controlStyles,
          // 20px label line, 14px control: 3px keeps them centered
          description && "mt-[3px]",
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
          dotStyles,
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
      {label && !description && (
        <Label
          className={cn(
            // Figma: label is white when enabled, tertiary when disabled
            textColorClass(disabled ? TextColor.Tertiary : TextColor.Primary),
            labelTextStyles,
            !disabled && "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      {label && description && (
        <div className="flex min-w-0 flex-col">
          <Label
            className={cn(
              textColorClass(disabled ? TextColor.Tertiary : TextColor.Primary),
              labelTextStyles,
              !disabled && "cursor-pointer",
              labelClassName
            )}
          >
            {label}
          </Label>
          <Description
            className={cn(
              textColorClass(
                disabled ? TextColor.Tertiary : TextColor.Secondary
              ),
              descriptionTextStyles
            )}
          >
            {description}
          </Description>
        </div>
      )}
    </Field>
  );
};

Radio.displayName = "Radio";
