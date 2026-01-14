import { Field } from "@headlessui/react";
import { type FC } from "react";
import type { DatePickerProps as ReactDatePickerProps } from "react-datepicker";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Datepicker.css";

import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";

import { DatepickerInput } from "./DatepickerInput";

export interface DatePickerProps extends Omit<
  ReactDatePickerProps,
  "size" | "className" | "customInput" | "dateFormat" | "selected"
> {
  size?: Size;
  radius?: Radius;
  className?: string;
  error?: boolean;
  dateFormat?: string;
  selected?: Date | null;
}

export const DatePicker: FC<DatePickerProps> = ({
  size = Size.Md,
  radius = Radius.Sm,
  className,
  disabled,
  selected,
  error,
  dateFormat,
  onChange,
  minDate,
  maxDate,
  placeholderText,
  showTimeSelect,
  showTimeSelectOnly,
  timeIntervals,
  ...props
}) => {
  const hasValue = Boolean(selected);

  // Automatically add dot separator between date and time when showTimeSelect is true
  const finalDateFormat =
    dateFormat ??
    (showTimeSelect || showTimeSelectOnly
      ? "yyyy-MM-dd · HH:mm"
      : "yyyy-MM-dd");

  return (
    <Field className={cn("flex flex-col gap-1", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        dateFormat={finalDateFormat}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        showTimeSelect={showTimeSelect}
        showTimeSelectOnly={showTimeSelectOnly}
        timeIntervals={timeIntervals}
        popperClassName="!z-[9999]"
        customInput={
          <DatepickerInput
            disabled={disabled}
            error={error}
            size={size}
            radius={radius}
            hasValue={hasValue}
          />
        }
        {...(props as any)}
      />
    </Field>
  );
};

DatePicker.displayName = "DatePicker";
