import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";
import { Label } from "@headlessui/react";
import { type FC } from "react";
import { labelTextStyles, secondaryLabelTextStyles } from "./styles";

export interface InputLabelProps {
  label?: string;
  secondaryLabel?: string;
  size: Size;
  className?: string;
  secondaryClassName?: string;
}

export const InputLabel: FC<InputLabelProps> = ({
  label,
  secondaryLabel,
  size,
  className,
  secondaryClassName,
}) => {
  if (!label && !secondaryLabel) {
    return null;
  }

  return (
    <div
      className="flex items-baseline gap-2"
      data-testid="input-label-container"
    >
      {label && (
        <Label
          className={cn(
            textColorClass(TextColor.Primary),
            "font-medium",
            labelTextStyles[size],
            className
          )}
        >
          {label}
        </Label>
      )}
      {secondaryLabel && (
        <span
          className={cn(
            "pl-1",
            textColorClass(TextColor.Secondary),
            secondaryLabelTextStyles[size],
            secondaryClassName
          )}
        >
          {secondaryLabel}
        </span>
      )}
    </div>
  );
};

InputLabel.displayName = "InputLabel";
