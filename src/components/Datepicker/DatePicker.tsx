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

/**
 * A datepicker component which allows selecting a date, time, or date-time using a calendar-like interface.
 *
 * @param size Size of the datepicker input. See {@link Size}.
 * @param radius Border radius of the datepicker input. See {@link Radius}.
 * @param className `class` overrides to apply to the component.
 * @param disabled If `true`, disables the datepicker input and interaction.
 * @param selected The controlled value of the datepicker.
 * @param error If `true`, displays an error state in the datepicker input.
 * @param dateFormat The format to use for displaying the value.
 *  If not specified, the following formats are used in order of precedence:
 *    - `HH:mm` if `showTimeSelectOnly` is `true`
 *    - `yyyy-MM-dd · HH:mm` if `showTimeSelect` is `true`
 *    - `yyyy-MM-dd`
 * @param onChange Callback triggered when the user changes the date/time value.
 * @param minDate Optional minimum date; dates before this will be disabled.
 * @param maxDate Optional maximum date; dates after this will be disabled.
 * @param placeholderText Optional placeholder text when no value is present.
 * @param showTimeSelect If `true`, allows the user to select a time value in addition to date.
 * @param showTimeSelectOnly If `true`, allows the user to select *only* a time value (no date).
 *  Note that when setting this value to `true`, `showTimeSelect` should also be set to `true`.
 * @param timeIntervals Optional time interval (in minutes) to apply to time selection.
 *  Time selection will be limited to times with these increments.
 *  If not provided, a default value of `30` is used.
 * @param props Additional HTML properties to apply to the component.
 */
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
