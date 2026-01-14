import { type FC } from "react";

import { Icon } from "@/components/Icons";
import { IconColor, Size, textColorClass } from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";

import { iconPaddingStyles, iconSizeStyles } from "../Input/styles";

export interface DatepickerIconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  hasValue?: boolean;
  size?: Size;
  ariaLabel?: string;
  iconName: IconName;
  position?: "left" | "right";
}

export const DatepickerIconButton: FC<DatepickerIconButtonProps> = ({
  onClick,
  disabled,
  size = Size.Md,
  ariaLabel = "Open date picker",
  iconName,
  position = "left",
}) => {
  const positionClasses =
    position === "left" ? "absolute left-0" : "absolute right-0 pr-3";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        positionClasses,
        "flex items-center justify-center",
        "cursor-pointer",
        "disabled:cursor-not-allowed",
        position === "left" && iconPaddingStyles[size],
        "z-10"
      )}
      aria-label={ariaLabel}
    >
      <Icon
        name={iconName}
        className={cn(iconSizeStyles[size], textColorClass(IconColor.Disabled))}
      />
    </button>
  );
};

DatepickerIconButton.displayName = "DatepickerIconButton";
