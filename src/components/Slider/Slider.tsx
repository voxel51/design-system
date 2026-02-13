import {
  ChangeEvent,
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FormField } from "@/components/FormField";
import { Input } from "@/components/Input";
import { SliderBar } from "@/components/Slider/SliderBar";
import { SliderLabels } from "@/components/Slider/SliderLabels";
import { Stack } from "@/components/Stack";
import { UnsetHint } from "@/components/UnsetHint";
import { Orientation, Spacing } from "@/types";
import { useDebouncedCallback } from "@/util/useDebouncedCallback.ts";
import { makeRangeValidator } from "@/util/validators";

type ChangeHandler = (value: number | number[]) => void;

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  bare?: boolean;
  debounceDelay?: number;
  labeled?: boolean;
  knobLabel?: boolean;
  min: number;
  minLabel?: ReactNode;
  max: number;
  maxLabel?: ReactNode;
  multi?: boolean;
  onChange?: ChangeHandler;
  showUnsetHint?: boolean;
  step?: number;
  value?: number | number[];
}

export interface SingleValueSliderProps extends Omit<
  SliderProps,
  "multi" | "onChange" | "value"
> {
  onChange?: (value: number) => void;
  value?: number;
}

export interface MultiValueSliderProps extends Omit<
  SliderProps,
  "multi" | "onChange" | "value"
> {
  onChange?: (value: number[]) => void;
  value?: number[];
}

/**
 * Clamp a value to a given range.
 *
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 */
const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * A basic slider component.
 *
 * This component renders a slider with one or more draggable knobs, optional numeric inputs, and optional labels.
 *
 * This component operates as both a controlled and uncontrolled component.
 * See `value` and `onChange` for controlled behavior.
 *
 * @param bare If `true`, prevents rendering of value inputs; instead only renders the slider itself.
 * @param className `class` overrides to apply to the component.
 * @param debounceDelay Time in milliseconds to debounce `onChange` events.
 *  Set this to `0` for a fully-responsive slider.
 *  Note that internal state updates are *not* debounced, so this value does not affect slider responsiveness.
 * @param labeled If `true`, displays labels for `min` and `max` slider endpoints.
 * @param knobLabel If `true`, displays labels above all slider knobs.
 * @param max Maximum slider value
 * @param maxLabel Optional label to display for maximum numeric input.
 * @param min Minimum slider value.
 * @param minLabel Optional label to display for minimum numeric input.
 * @param multi Controls whether the slider supports setting multiple values.
 *  If `true`:
 *    - The slider will render two draggable knobs; one for a "low" value and one for a "high" value.
 *    - `value` must be of the form `[low, high]`.
 *    - `onChange` will emit values of the form `[low, high]`.
 *    - See {@link MultiValueSlider} as a type-safe alias for this configuration.
 *  If `false`:
 *    - The slider will render a single draggable knob.
 *    - `value` must be a single numeric value.
 *    - `onChange` will emit a single numeric value.
 *    - See {@link SingleValueSlider} as a type-safe alias for this configuration.
 * @param onChange Callback triggered when values change.
 *  This change can be triggered in three ways:
 *    - The user modifies the value in the minimum or maximum input field.
 *    - The user drags a slider knob.
 *    - The user clicks on the slider track.
 *  If `multi` is `true`, this callback emits a value of the form `[low, high]`;
 *  otherwise, this callback emits a single numeric value.
 * @param step Numeric step size for slider increments.
 * @param value The controlled value of the slider.
 *  If `multi` is `true`, this must be of the form `[low, high]`;
 *  otherwise, this must be a single numeric value.
 *  In all cases, `min <= value <= max`.
 * @param showUnsetHint If `true`, shows a hint to the user to initialize the slider's value.
 * @param props Additional HTML properties to apply to the component.
 */
export const BaseSlider: FC<SliderProps> = ({
  bare,
  className,
  debounceDelay = 200,
  labeled,
  knobLabel,
  max,
  maxLabel,
  min,
  minLabel,
  multi,
  onChange,
  step = 0.001,
  value,
  showUnsetHint,
  ...props
}) => {
  // transient state
  const [transientValue, setTransientValue] = useState<
    number | number[] | undefined
  >(value);
  const [minValue, setMinValue] = useState<string>(() =>
    Array.isArray(value) ? value[0].toString() : min.toString()
  );
  const [maxValue, setMaxValue] = useState<string>(() =>
    Array.isArray(value) ? value[1].toString() : (value ?? max).toString()
  );

  /**
   * Check whether values are ordered such that min <= newMin <= newMax <= max.
   */
  const isValidRange = useCallback(
    (newMin: string | number, newMax: string | number) =>
      makeRangeValidator(min, Number.parseFloat(newMax.toString()))(newMin) &&
      makeRangeValidator(Number.parseFloat(newMin.toString()), max)(newMax),
    [max, min]
  );

  // synchronize transient state with changes in controlled value
  useEffect(() => {
    setTransientValue(value);
  }, [value]);

  // synchronize inputs with changes in transient state
  useEffect(() => {
    if (transientValue !== null && transientValue !== undefined) {
      if (Array.isArray(transientValue)) {
        setMinValue(clamp(transientValue[0], min, max).toString());
        setMaxValue(clamp(transientValue[1], min, max).toString());
      } else {
        setMinValue(min.toString());
        setMaxValue(clamp(transientValue, min, max).toString());
      }
    }
  }, [max, min, transientValue]);

  // debounce onChange events to prevent excessive updates when e.g. dragging the slider
  const debouncedOnChange = useDebouncedCallback(
    useCallback((value: number | number[]) => onChange?.(value), [onChange]),
    debounceDelay
  );

  const handleChange = useCallback(
    (value: number | number[]) => {
      // update transient value to provide responsive slider while debouncing onChange emission
      setTransientValue(value);
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  const handleMinInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMinValue(e.target.value);

      const v = Number.parseFloat(e.target.value);
      if (isValidRange(v, maxValue) && v !== Number.parseFloat(minValue)) {
        handleChange([v, Number.parseFloat(maxValue)]);
      }
    },
    [handleChange, isValidRange, maxValue, minValue]
  );

  const handleMaxInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMaxValue(e.target.value);

      const v = Number.parseFloat(e.target.value);
      if (isValidRange(minValue, v) && v !== Number.parseFloat(maxValue)) {
        handleChange(multi ? [Number.parseFloat(minValue), v] : v);
      }
    },
    [handleChange, isValidRange, maxValue, minValue, multi]
  );

  const hint = bare
    ? "Click on the slider to set a value"
    : "Click on the slider or enter a number to set a value";

  return (
    <Stack
      orientation={Orientation.Column}
      spacing={Spacing.Md}
      className={className}
      {...props}
    >
      {(labeled || knobLabel) && (
        <SliderLabels
          knobLabel={knobLabel}
          min={min}
          minLabel={labeled} // todo - dedicated prop
          max={max}
          maxLabel={labeled} // todo - dedicated prop
          precision={step}
          value={transientValue}
        />
      )}

      <SliderBar
        min={min}
        max={max}
        multi={multi}
        step={step}
        value={transientValue}
        onChange={handleChange}
      />

      {!bare && (
        <div className="flex justify-between items-center">
          {multi && (
            <FormField
              label={minLabel}
              control={
                <Input
                  value={minValue}
                  onChange={handleMinInputChange}
                  error={!isValidRange(minValue, maxValue)}
                />
              }
            />
          )}
          <FormField
            label={maxLabel}
            control={
              <Input
                value={maxValue}
                onChange={handleMaxInputChange}
                error={!isValidRange(minValue, maxValue)}
              />
            }
          />
        </div>
      )}
      {showUnsetHint && <UnsetHint value={value} hint={hint} />}
    </Stack>
  );
};

/**
 * A slider supporting selection of a single value.
 *
 * See also {@link BaseSlider}.
 * See also {@link MultiValueSlider}.
 *
 * @param onChange Callback triggered when the slider value changes.
 *   This change can be triggered in three ways:
 *    - The user modifies the value in the minimum or maximum input field.
 *    - The user drags a slider knob.
 *    - The user clicks on the slider track.
 * @param max Maximum value of the slider
 * @param min Minimum value of the slider
 * @param props See {@link BaseSlider} for all available properties.
 */
export const SingleValueSlider: FC<SingleValueSliderProps> = ({
  onChange,
  max,
  min,
  ...props
}) => (
  <BaseSlider
    min={min}
    max={max}
    {...props}
    multi={false}
    onChange={onChange as ChangeHandler}
  />
);

/**
 * A slider supporting selection of a "low" value and a "high" value.
 *
 * See also {@link BaseSlider}.
 * See also {@link SingleValueSlider}.
 *
 * @param onChange Callback triggered when the slider value changes.
 *   This change can be triggered in three ways:
 *    - The user modifies the value in the minimum or maximum input field.
 *    - The user drags a slider knob.
 *    - The user clicks on the slider track.
 * @param max Maximum value of the slider
 * @param min Minimum value of the slider
 * @param props See {@link BaseSlider} for all available properties.
 */
export const MultiValueSlider: FC<MultiValueSliderProps> = ({
  onChange,
  max,
  min,
  ...props
}) => (
  <BaseSlider
    min={min}
    max={max}
    {...props}
    multi={true}
    onChange={onChange as ChangeHandler}
  />
);

BaseSlider.displayName = "BaseSlider";
SingleValueSlider.displayName = "SingleValueSlider";
MultiValueSlider.displayName = "MultiValueSlider";
