import { DragEventHandler, FC, HTMLAttributes } from "react";
import clsx from "clsx";
import { bgColorClass, BrandColor, Radius } from "@/types";
import radiusStyles from "@/styles/radius";

interface SliderKnobProps extends HTMLAttributes<HTMLDivElement> {
  position: number;
  onDragStart: DragEventHandler<HTMLDivElement>;
}

export const SliderKnob: FC<SliderKnobProps> = ({
  position,
  onDragStart,
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
      {...props}
    />
  );
};

SliderKnob.displayName = "SliderKnob";
