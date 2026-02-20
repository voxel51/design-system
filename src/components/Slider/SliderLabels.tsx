import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { TextVariant } from "@/types";
import { cn } from "@/util/classes";
import { truncate } from "@/util/math";

interface SliderLabelProps extends HTMLAttributes<HTMLDivElement> {
  knobLabel?: boolean;
  min: number;
  minLabel?: boolean;
  max: number;
  maxLabel?: boolean;
  precision: number;
  value?: number | number[];
}

/**
 * Get the relative value [0, 1] for a given value in a range.
 *
 * @param value Raw value
 * @param min Range minimum
 * @param max Range maximum
 */
const getRelativeValue = (value: number, min: number, max: number): number =>
  (value - min) / (max - min);

/**
 * Component which renders a label above a {@link SliderKnob}.
 *
 * @param max Maximum value of the slider.
 * @param min Minimum value of the slider.
 * @param precision Numeric precision to use when rendering labels; label values will be truncated to this precision.
 *  See {@link truncate}.
 * @param value Current value of the knob.
 * @param threshold Threshold in the range `[0, 1]` to prevent label overlap.
 *  If the `value` is within this relative threshold as determined by
 *  `value / (max - min)` or `1 - (value / (max - min))`,
 *  then the label is hidden.
 *  For example, a threshold of `0.1` indicates that if `relativeValue < 0.1 || relativeValue > 0.9`,
 *  the label will not be rendered.
 *  This is intended to prevent labels from overlapping with minimum and maximum labels.
 *
 * @internal For use by {@link SliderLabels}.
 */
const KnobLabel: FC<{
  max: number;
  min: number;
  precision: number;
  value: number;
  threshold?: number;
}> = ({ max, min, precision, value, threshold = 0.1 }) => {
  const relativeValue = getRelativeValue(value, min, max);

  // don't display the knob label if we're too close to the start/end
  if (relativeValue < threshold || 1 - relativeValue < threshold) {
    return null;
  }

  const displayValue = truncate(value, precision);
  if (!Number.isFinite(displayValue)) {
    return null;
  }

  return (
    <Text
      className={clsx("absolute", "-translate-x-1/2")}
      style={{ left: `${relativeValue * 100}%` }}
      variant={TextVariant.Sm}
    >
      {displayValue}
    </Text>
  );
};

/**
 * Component which renders relevant labels above a {@link SliderBar}.
 *
 * @param className `class` overrides to apply to the labels' container.
 * @param knobLabel If `true`, displays a label above the current knob position(s).
 * @param max Maximum value of the slider.
 * @param maxLabel If `true`, displays a label above the maximal endpoint of the slider.
 * @param min Minimum value of the slider.
 * @param minLabel if `true`, displays a label above the minimal endpoint of the slider.
 * @param precision Numeric precision to use when rendering labels; label values will be truncated to this precision.
 *  See {@link truncate}.
 * @param value Current value of the slider.
 *  If the slider supports multiple values, this should be of the form [low, high];
 *  otherwise, this is a single numeric value.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by {@link Slider}.
 */
export const SliderLabels: FC<SliderLabelProps> = ({
  className,
  knobLabel,
  max,
  maxLabel,
  min,
  minLabel,
  precision,
  value,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative",
        "flex items-center justify-between",
        "w-full",
        className
      )}
      {...props}
    >
      {minLabel && (
        <Text variant={TextVariant.Sm}>{truncate(min, precision)}</Text>
      )}
      {maxLabel && (
        <Text variant={TextVariant.Sm}>{truncate(max, precision)}</Text>
      )}

      {value !== undefined &&
        knobLabel &&
        (Array.isArray(value) ? (
          <>
            <KnobLabel
              max={max}
              min={min}
              precision={precision}
              value={value[0]}
            />
            <KnobLabel
              max={max}
              min={min}
              precision={precision}
              value={value[1]}
            />
          </>
        ) : (
          <KnobLabel max={max} min={min} precision={precision} value={value} />
        ))}
    </div>
  );
};

SliderLabels.displayName = "SliderLabels";
