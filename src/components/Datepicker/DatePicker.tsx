import { Field } from "@headlessui/react";
import { useMemo, type FC } from "react";
import type { DatePickerProps as ReactDatePickerProps } from "react-datepicker";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Datepicker.css";

import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";

import DatepickerInput from "./DatepickerInput";

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

  const finalDateFormat = useMemo(() => {
    if (dateFormat) return dateFormat; // user provided date format
    if (showTimeSelect && showTimeSelectOnly) return "HH:mm";
    if (showTimeSelect) return "yyyy-MM-dd · HH:mm";
    return "yyyy-MM-dd";
  }, [dateFormat, showTimeSelect, showTimeSelectOnly]);

  return (
    <Field className={cn("flex flex-col gap-1", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={!disabled ? onChange : undefined}
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
        {...(props as any)} // eslint-disable-line
      />
    </Field>
  );
};

DatePicker.displayName = "DatePicker";
