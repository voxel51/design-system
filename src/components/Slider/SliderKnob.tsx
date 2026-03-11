import clsx from "clsx";
import { DragEventHandler, FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { bgColorClass, BrandColor, Radius } from "@/types";

interface SliderKnobProps extends HTMLAttributes<HTMLDivElement> {
  position: number;
  onDragStart: DragEventHandler<HTMLDivElement>;
  value: number;
}

/**
 * A knob element to overlay on a {@link SliderBar}.
 *
 * The knob allows for user interaction via dragging along the slider's primary axis.
 *
 * @param position The relative position of the knob; this must be a value in the range `[0, 1]`.
 * @param onDragStart Callback triggered on the start of a drag event.
 * @param value Value of the knob; this is expected to be `position * (max - min)` and is only used for accessibility.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by {@link SliderBar}.
 */
export const SliderKnob: FC<SliderKnobProps> = ({
  position,
  onDragStart,
  value,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "absolute",
        "size-4 -ml-2",
        "cursor-pointer",
        bgColorClass(BrandColor.Primary),
        radiusStyles(Radius.Full),
        "hover:scale-110 transition-transform"
      )}
      style={{ left: `${position * 100}%` }}
      onMouseDown={onDragStart}
      role="slider"
      aria-valuenow={value}
      tabIndex={0}
      {...props}
    />
  );
};

SliderKnob.displayName = "SliderKnob";
