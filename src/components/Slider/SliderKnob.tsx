import clsx from "clsx";
import { DragEventHandler, FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import { bgColorClass, BrandColor, Radius } from "@/types";

interface SliderKnobProps extends HTMLAttributes<HTMLDivElement> {
  position: number;
  onDragStart: DragEventHandler<HTMLDivElement>;
  value: number;
}

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
