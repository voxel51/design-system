import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Stack } from "@/components/Stack";
import { Orientation, Spacing } from "@/types";
import { Input } from "@/components/Input";
import { SliderLabels } from "@/components/Slider/SliderLabels";
import { SliderBar } from "@/components/Slider/SliderBar";
import { makeRangeValidator } from "@/util/validators";
import { FormField } from "@/components/FormField";

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  bare?: boolean;
  labeled?: boolean;
  min: number;
  minLabel?: ReactNode;
  max: number;
  maxLabel?: ReactNode;
  multi?: boolean;
  onChange?: (value: number | number[]) => void;
  step?: number;
  value?: number | number[];
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

export const Slider: FC<SliderProps> = ({
  bare,
  className,
  labeled,
  max,
  maxLabel,
  min,
  minLabel,
  multi,
  onChange,
  step = 0.001,
  value,
  ...props
}) => {
  // track raw input values
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

  // synchronize inputs with changes in controlled value
  useEffect(() => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        setMinValue(clamp(value[0], min, max).toString());
        setMaxValue(clamp(value[1], min, max).toString());
      } else {
        setMinValue(min.toString());
        setMaxValue(clamp(value, min, max).toString());
      }
    }
  }, [max, min, value]);

  return (
    <Stack
      orientation={Orientation.Column}
      spacing={Spacing.Md}
      className={className}
      {...props}
    >
      {labeled && <SliderLabels min={min} max={max} value={value} />}

      <SliderBar
        min={min}
        max={max}
        multi={multi}
        step={step}
        value={value}
        onChange={onChange}
      />

      {!bare && (
        <div className="flex justify-between items-center">
          {multi && (
            <FormField
              label={minLabel}
              control={
                <Input
                  value={minValue}
                  onChange={(e) => {
                    setMinValue(e.target.value);

                    const v = Number.parseFloat(e.target.value);
                    if (
                      isValidRange(v, maxValue) &&
                      v !== Number.parseFloat(minValue)
                    ) {
                      onChange?.([v, Number.parseFloat(maxValue)]);
                    }
                  }}
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
                onChange={(e) => {
                  setMaxValue(e.target.value);

                  const v = Number.parseFloat(e.target.value);
                  if (
                    isValidRange(minValue, v) &&
                    v !== Number.parseFloat(maxValue)
                  ) {
                    onChange?.(multi ? [Number.parseFloat(minValue), v] : v);
                  }
                }}
                error={!isValidRange(minValue, maxValue)}
              />
            }
          />
        </div>
      )}
    </Stack>
  );
};

Slider.displayName = "Slider";
