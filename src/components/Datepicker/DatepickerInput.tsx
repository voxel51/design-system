import { type FC, useCallback, useRef } from "react";

import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
} from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";

import { paddingLeftStyles, sizeStyles } from "../Input/styles";

import DatepickerIconButton, { IconPosition } from "./DatepickerIconButton";

const datePickerInputStyle = ({
  disabled,
  error,
  radius = Radius.Sm,
  size = Size.Md,
}: {
  disabled?: boolean;
  error?: boolean;
  radius?: Radius;
  size?: Size;
}): string =>
  cn(
    "w-full",
    bgColorClass(BackgroundColor.Background),
    textColorClass(TextColor.Primary),
    "placeholder:text-content-text-tertiary",
    "transition-colors",
    "border",
    error
      ? borderColorClass(BorderColor.Error)
      : borderColorClass(BorderColor.Default),
    !disabled &&
      !error &&
      borderColorClass(BorderColor.Hover, ElementState.Hover),
    "focus:outline-none",
    error
      ? borderColorClass(BorderColor.Error, ElementState.Focus)
      : borderColorClass(BorderColor.Focus, ElementState.Focus),
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    radiusStyles(radius),
    sizeStyles[size],
    paddingLeftStyles[size],
    "pr-8"
  );

export interface DatepickerInputProps {
  value?: string;
  onClick?: () => void;
  disabled?: boolean;
  error?: boolean;
  size?: Size;
  radius?: Radius;
  hasValue?: boolean;
}

/**
 * An input component supporting dates and date-times.
 *
 * This component operates exclusively as a controlled component. See `value` and `onChange` for controlled behavior.
 *
 * @param value The text representation of the date.
 * @param onClick Callback triggered when the input is clicked.
 * @param disabled If `true`, disables the input.
 * @param error If `true`, renders the input in an error state.
 * @param size The size of the input; this controls the size of the text and the input's padding. See {@link Size}.
 * @param radius The border radius of the input. See {@link Radius}.
 * @param hasValue Unused
 *
 * @internal For use by {@link DatePicker}.
 */
export const DatepickerInput: FC<DatepickerInputProps> = ({
  value,
  onClick,
  disabled,
  error,
  size = Size.Md,
  radius = Radius.Sm,
  hasValue,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = useCallback(() => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  }, [disabled, onClick]);

  const inputClasses = datePickerInputStyle({
    disabled,
    error,
    radius,
    size,
  });

  return (
    <div className="relative flex items-center">
      {/* Calendar icon on the left */}
      <DatepickerIconButton
        onClick={handleIconClick}
        disabled={disabled}
        hasValue={hasValue}
        size={size}
        position={IconPosition.Leading}
        iconName={IconName.DateRange}
      />
      <input
        ref={inputRef}
        value={value}
        onClick={onClick}
        disabled={disabled}
        className={inputClasses}
      />
      {/* Caret down icon on the right */}
      <DatepickerIconButton
        onClick={handleIconClick}
        disabled={disabled}
        hasValue={hasValue}
        size={size}
        position={IconPosition.Trailing}
        iconName={IconName.CaretDown}
      />
    </div>
  );
};

export default DatepickerInput;
