import { type FC, useCallback, useRef } from "react";

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
import radiusStyles from "@/styles/radius";
import { DatepickerIconButton } from "./DatepickerIconButton";

export const datePickerInputStyle = ({
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
        position="left"
        iconName={IconName.DateRange}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        disabled={disabled}
        className={inputClasses}
      />
      {/* Caret down icon on the right */}
      <DatepickerIconButton
        onClick={handleIconClick}
        disabled={disabled}
        hasValue={hasValue}
        size={size}
        position="right"
        iconName={IconName.CaretDown}
      />
    </div>
  );
};

DatepickerInput.displayName = "DatepickerInput";

