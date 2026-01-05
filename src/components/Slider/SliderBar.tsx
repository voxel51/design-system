import { FC, HTMLAttributes, MouseEvent, useCallback, useRef } from "react";
import clsx from "clsx";
import { BackgroundColor, bgColorClass, BrandColor, Radius } from "@/types";
import radiusStyles from "@/styles/radius";
import { SliderKnob } from "@/components/Slider/SliderKnob";

interface SliderBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  min: number;
  max: number;
  multi?: boolean;
  onChange?: (value: number | number[]) => void;
  step: number;
  value?: number | number[];
}

export const SliderBar: FC<SliderBarProps> = ({
  max,
  min,
  multi,
  onChange,
  step,
  value,
  ...props
}) => {
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const values = Array.isArray(value) ? value : [min, value ?? max];
  const minValue = values[0];
  const maxValue = values[1];

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
      const newValue = getKnobValue(relativePosition);

      if (multi) {
        if (knob === "min") {
          if (newValue <= maxValue) {
            onChange?.([newValue, maxValue]);
          }
        } else {
          if (newValue >= minValue) {
            onChange?.([minValue, newValue]);
          }
        }
      } else {
        onChange?.(newValue);
      }
    },
    [getKnobValue, onChange]
  );

  /**
   * Register drag handlers for knob interaction.
   */
  const registerKnobDragHandlers = useCallback(
    (e: MouseEvent, knob: "min" | "max") => {
      e.preventDefault();

      const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientX, knob);

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleDrag]
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

      if (multi) {
        const minPos = getKnobPosition(minValue);
        const maxPos = getKnobPosition(maxValue);

        const minDist = Math.abs(clickPos - minPos);
        const maxDist = Math.abs(clickPos - maxPos);

        if (clickPos < minPos || minDist < maxDist) {
          onChange?.([clickValue, maxValue]);
        } else {
          onChange?.([minValue, clickValue]);
        }
      } else {
        onChange?.(clickValue);
      }
    },
    [maxValue, minValue, getKnobPosition, getKnobValue, getRelativeX, onChange]
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
      {...props}
    >
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
        />
      )}
      <SliderKnob
        position={getKnobPosition(maxValue)}
        onDragStart={(e) => registerKnobDragHandlers(e, "max")}
      />
    </div>
  );
};

SliderBar.displayName = "SliderBar";
