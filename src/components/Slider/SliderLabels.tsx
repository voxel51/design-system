import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/Text";
import { TextVariant } from "@/types";
import { cn } from "@/util/classes";
import { truncate } from "@/util/math";

interface SliderLabelProps extends HTMLAttributes<HTMLDivElement> {
  formatLabel?: (value: number) => ReactNode;
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
 * @param format Renders the label for the knob's value.
 * @param max Maximum value of the slider.
 * @param min Minimum value of the slider.
 * @param value Current value of the knob.
 * @param threshold Threshold in the range `[0, 1]` to prevent label overlap
 *  with endpoint labels, or `null` when there are none.
 *  If the `value` is within this relative threshold as determined by
 *  `value / (max - min)` or `1 - (value / (max - min))`,
 *  then the label is hidden.
 *  For example, a threshold of `0.1` indicates that if `relativeValue < 0.1 || relativeValue > 0.9`,
 *  the label will not be rendered.
 *  Without a threshold the label is always shown, shifted so it stays within the track.
 *
 * @internal For use by {@link SliderLabels}.
 */
const KnobLabel: FC<{
  format: (value: number) => ReactNode;
  max: number;
  min: number;
  value: number;
  threshold: number | null;
}> = ({ format, max, min, value, threshold }) => {
  const relativeValue = getRelativeValue(value, min, max);

  // don't display the knob label if we're too close to the start/end
  if (
    threshold !== null &&
    (relativeValue < threshold || 1 - relativeValue < threshold)
  ) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return (
    <Text
      className={clsx("absolute", threshold !== null && "-translate-x-1/2")}
      style={{
        left: `${relativeValue * 100}%`,
        // without endpoint labels, slide from left- to right-aligned so the
        // label never overflows the track
        ...(threshold === null && {
          transform: `translateX(${-relativeValue * 100}%)`,
        }),
      }}
      variant={TextVariant.HeadingXs}
    >
      {format(value)}
    </Text>
  );
};

/**
 * Component which renders relevant labels above a {@link SliderBar}.
 *
 * @param className `class` overrides to apply to the labels' container.
 * @param formatLabel Renders the label for a value; defaults to the value truncated to `precision`.
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
 * @internal For use by {@link BaseSlider}.
 */
export const SliderLabels: FC<SliderLabelProps> = ({
  className,
  formatLabel,
  knobLabel,
  max,
  maxLabel,
  min,
  minLabel,
  precision,
  value,
  ...props
}) => {
  const format = formatLabel ?? ((v: number) => truncate(v, precision));
  const threshold = minLabel || maxLabel ? 0.1 : null;

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
      {minLabel && <Text variant={TextVariant.HeadingXs}>{format(min)}</Text>}
      {maxLabel && <Text variant={TextVariant.HeadingXs}>{format(max)}</Text>}
      {threshold === null && (
        // knob labels are absolute; this holds the row's height for them
        <Text variant={TextVariant.HeadingXs} className="invisible" aria-hidden>
          {"\u00a0"}
        </Text>
      )}

      {value !== undefined &&
        knobLabel &&
        (Array.isArray(value) ? value : [value]).map((v, i) => (
          <KnobLabel
            key={i}
            format={format}
            max={max}
            min={min}
            threshold={threshold}
            value={v}
          />
        ))}
    </div>
  );
};

SliderLabels.displayName = "SliderLabels";
