import clsx from "clsx";
import {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
} from "react";

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
  keyboardStep?: number | false;
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
  keyboardStep,
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
      // a press on a knob is a grab, not a track jump — don't let the track
      // handler also snap the knob to the cursor
      e.stopPropagation();

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
   * Keyboard handler for a focused knob: arrows step the value, Home/End jump
   * to the range edges. Each keystroke is a complete interaction, so it emits
   * both `onChange` and `onChangeCommitted`.
   */
  const handleKnobKeyDown = useCallback(
    (e: KeyboardEvent, knob: "min" | "max") => {
      if (keyboardStep === false) {
        return;
      }
      const stepSize = keyboardStep ?? step;
      const current = knob === "min" ? minValue : maxValue;

      let target: number;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          target = current + stepSize;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          target = current - stepSize;
          break;
        case "Home":
          target = min;
          break;
        case "End":
          target = max;
          break;
        default:
          return;
      }
      // preventDefault but bubble — ancestors arbitrate via e.defaultPrevented
      e.preventDefault();

      const clamped = cleanFloat(Math.min(Math.max(target, min), max));

      let next: number | number[];
      if (multi) {
        // knobs may meet but never cross
        if (knob === "min") {
          next = [Math.min(clamped, maxValue), maxValue];
        } else {
          next = [minValue, Math.max(clamped, minValue)];
        }
      } else {
        next = clamped;
      }

      lastValueRef.current = next;
      onChange?.(next);
      onChangeCommitted?.(next);
    },
    [
      keyboardStep,
      max,
      maxValue,
      min,
      minValue,
      multi,
      onChange,
      onChangeCommitted,
      step,
    ]
  );

  /**
   * Press handler for the track: the nearest knob jumps to the press position
   * immediately, then follows the cursor as if it had been grabbed, until the
   * mouse is released. Releasing outside the track still ends the drag, and the
   * value stays where the cursor last put it (clamped to the track bounds).
   *
   * In the case of multiple knobs, the knob closest to the press is chosen.
   */
  const handleTrackMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!sliderTrackRef.current) {
        return;
      }

      const pressPos = getRelativeX(e.clientX);

      let knob: "min" | "max" = "max";
      if (multi) {
        const minKnobPos = getKnobPosition(minValue);
        const maxKnobPos = getKnobPosition(maxValue);

        const minKnobDist = Math.abs(pressPos - minKnobPos);
        const maxKnobDist = Math.abs(pressPos - maxKnobPos);

        if (pressPos < minKnobPos || minKnobDist < maxKnobDist) {
          knob = "min";
        }
      }

      // jump first, then hand off to the drag handlers; the drag's `mouseup`
      // commits the final value, so a press with no movement still commits once
      handleDrag(e.clientX, knob);
      registerKnobDragHandlers(e, knob);
    },
    [
      getRelativeX,
      getKnobPosition,
      handleDrag,
      maxValue,
      minValue,
      multi,
      registerKnobDragHandlers,
    ]
  );

  return (
    // roleless on purpose: the knobs carry the ARIA slider contract; the
    // track press is a pointer-only shortcut this rule can't model
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
      onMouseDown={handleTrackMouseDown}
      onKeyDown={(e) => e.stopPropagation()}
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
              onKeyDown={(e) => handleKnobKeyDown(e, "min")}
              value={minValue}
              min={min}
              max={max}
            />
          )}
          <SliderKnob
            position={getKnobPosition(maxValue)}
            onDragStart={(e) => registerKnobDragHandlers(e, "max")}
            onKeyDown={(e) => handleKnobKeyDown(e, "max")}
            value={maxValue}
            min={min}
            max={max}
          />
        </>
      )}
    </div>
  );
};

SliderBar.displayName = "SliderBar";
