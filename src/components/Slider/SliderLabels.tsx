import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { TextVariant } from "@/types";
import { cn } from "@/util/classes";
import { truncate } from "@/util/math";

interface SliderLabelProps extends HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
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

export const SliderLabels: FC<SliderLabelProps> = ({
  className,
  max,
  min,
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
      <Text variant={TextVariant.Sm}>{truncate(min, precision)}</Text>
      <Text variant={TextVariant.Sm}>{truncate(max, precision)}</Text>

      {value !== undefined &&
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
