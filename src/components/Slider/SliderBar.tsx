import clsx from "clsx";
import { FC, HTMLAttributes, MouseEvent, useCallback, useRef } from "react";

import { SliderKnob } from "@/components/Slider/SliderKnob";
import radiusStyles from "@/styles/radius";
import { BackgroundColor, bgColorClass, BrandColor, Radius } from "@/types";
import { cleanFloat } from "@/util/math";
import { isNullish } from "@/util/type-check";

interface SliderBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  min: number;
  max: number;
  multi?: boolean;
  onChange?: (value: number | number[]) => void;
  onChangeCommitted?: (value: number | number[]) => void;
  step: number;
  value?: number | number[];
}

/**
 * Component which renders the bar and knobs to form the basis of a slider.
 *
 * This component operates as both a controlled and uncontrolled component.
 * See `value` and `onChange` for controlled behavior.
 *
 * @param max Maximum allowed value.
 * @param min Minimum allowed value.
 * @param multi If `true`, provides knob controls for both a "low" and a "high value.
 * @param onChange Callback triggered when slider values change.
 *  If `multi` is `true`, emits a value of the form [low, high]; otherwise, emits a single value.
 * @param step Step size of the slider; moving a knob will modify the current value by a minimum of this size.
 * @param value Value of the slider.
 *  If `multi` is true, this must be a value of the form [low, high]; otherwise, this is a single numeric value.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by {@link Slider}.
 */
export const SliderBar: FC<SliderBarProps> = ({
  max,
  min,
  multi,
  onChange,
  onChangeCommitted,
  step,
  value,
  ...props
}) => {
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  // tracks the latest value emitted during a drag so the drag-end handler can
  // commit it (the document `mouseup` that ends the drag carries no position)
  const lastValueRef = useRef<number | number[] | undefined>(value);

  const values = Array.isArray(value) ? value : [min, value ?? max];
  const minValue = values[0];
  const maxValue = values[1];
  const isUnset = isNullish(value);

  /**
   * Get the knob position in the range [0, 1] from the given value.
   */
  const getKnobPosition = useCallback(
    (v: number) => (v - min) / (max - min),
    [max, min]
  );

  /**
   * Get the knob value in the range [min, max] from the given position.
   */
  const getKnobValue = useCallback(
    (xPos: number) => {
      const rawValue = min + xPos * (max - min);
      const stepValue = Math.round(rawValue / step) * step;
      return Math.min(Math.max(stepValue, min), max);
    },
    [max, min, step]
  );

  /**
   * Get the x-position in the range [0, 1] for the given x-coordinate relative to the bounds of the slider track.
   */
  const getRelativeX = useCallback((mouseX: number): number => {
    const trackElement = sliderTrackRef.current;
    if (!trackElement) {
      return 0;
    }

    const boundingRect = trackElement.getBoundingClientRect();
    const relativeX = Math.min(
      Math.max(mouseX - boundingRect.left, 0),
      boundingRect.width
    );
    return relativeX / boundingRect.width;
  }, []);

  /**
   * Drag handler which updates current value as a function of knob x-position.
   */
  const handleDrag = useCallback(
    (mouseX: number, knob: "min" | "max") => {
      if (!sliderTrackRef.current) {
        return;
      }

      const relativePosition = getRelativeX(mouseX);
      const newValue = cleanFloat(getKnobValue(relativePosition));

      let next: number | number[] | undefined;
      if (multi) {
        if (knob === "min") {
          if (newValue <= maxValue) {
            next = [newValue, maxValue];
          }
        } else {
          if (newValue >= minValue) {
            next = [minValue, newValue];
          }
        }
      } else {
        next = newValue;
      }

      if (next !== undefined) {
        lastValueRef.current = next;
        onChange?.(next);
      }
    },
    [getKnobValue, getRelativeX, maxValue, minValue, multi, onChange]
  );

  /**
   * Register drag handlers for knob interaction.
   */
  const registerKnobDragHandlers = useCallback(
    (e: MouseEvent, knob: "min" | "max") => {
      e.preventDefault();

      const handleMouseMove = (e: globalThis.MouseEvent): void =>
        handleDrag(e.clientX, knob);

      const handleMouseUp = (): void => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        // drag ended — commit the final value once
        if (lastValueRef.current !== undefined) {
          onChangeCommitted?.(lastValueRef.current);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDrag, onChangeCommitted]
  );

  /**
   * Click handler which updates knob position to the position clicked on the track.
   *
   * In the case of multiple knobs, the knob closest to the click is chosen for update.
   */
  const handleTrackClick = useCallback(
    (e: MouseEvent) => {
      if (!sliderTrackRef.current) {
        return;
      }

      const clickPos = getRelativeX(e.clientX);
      const clickValue = getKnobValue(clickPos);

      let next: number | number[];
      if (multi) {
        const minKnobPos = getKnobPosition(minValue);
        const maxKnobPos = getKnobPosition(maxValue);

        const minKnobDist = Math.abs(clickPos - minKnobPos);
        const maxKnobDist = Math.abs(clickPos - maxKnobPos);

        if (clickPos < minKnobPos || minKnobDist < maxKnobDist) {
          next = [clickValue, maxValue];
        } else {
          next = [minValue, clickValue];
        }
      } else {
        next = clickValue;
      }

      lastValueRef.current = next;
      onChange?.(next);
      // a track click is a complete interaction — commit immediately
      onChangeCommitted?.(next);
    },
    [
      getRelativeX,
      getKnobValue,
      multi,
      getKnobPosition,
      minValue,
      maxValue,
      onChange,
      onChangeCommitted,
    ]
  );

  return (
    <div
      ref={sliderTrackRef}
      className={clsx(
        "relative",
        "flex items-center",
        "w-full h-2",
        "cursor-pointer",
        bgColorClass(BackgroundColor.CardElevated),
        radiusStyles(Radius.Full)
      )}
      onClick={handleTrackClick}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
      {...props}
    >
      {!isUnset && (
        <>
          <div
            className={clsx(
              "absolute",
              "h-2",
              bgColorClass(BrandColor.Primary),
              radiusStyles(Radius.Full)
            )}
            style={{
              left: `${getKnobPosition(minValue) * 100}%`,
              right: `${(1 - getKnobPosition(maxValue)) * 100}%`,
            }}
          />

          {multi && (
            <SliderKnob
              position={getKnobPosition(minValue)}
              onDragStart={(e) => registerKnobDragHandlers(e, "min")}
              value={minValue}
            />
          )}
          <SliderKnob
            position={getKnobPosition(maxValue)}
            onDragStart={(e) => registerKnobDragHandlers(e, "max")}
            value={maxValue}
          />
        </>
      )}
    </div>
  );
};

SliderBar.displayName = "SliderBar";
