import { Button } from "@headlessui/react";
import { type FC } from "react";

import { Icon } from "@/components/Icons";
import { IconColor, Size, textColorClass } from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";

import { iconPaddingStyles, iconSizeStyles } from "../Input/styles";

export enum IconPosition {
  Leading = "leading",
  Trailing = "trailing",
}

export interface DatepickerIconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  hasValue?: boolean;
  size?: Size;
  ariaLabel?: string;
  iconName: IconName;
  position?: IconPosition;
}

/**
 * An interactable icon to display within the datepicker input.
 *
 * @param onClick Callback triggered when the icon is clicked.
 * @param disabled If `true`, disables interaction with the icon.
 * @param size Size of the icon. See {@link Size}.
 * @param ariaLabel Optional aria label for the icon; only used for accessibility.
 * @param iconName Name of the icon. See {@link IconName}.
 * @param position The position of the icon. See {@link IconPosition}.
 *
 * @internal For use by {@link DatepickerInput}.
 */
export const DatepickerIconButton: FC<DatepickerIconButtonProps> = ({
  onClick,
  disabled,
  size = Size.Md,
  ariaLabel = "Open date picker",
  iconName,
  position = IconPosition.Leading,
}) => {
  const positionClasses =
    position === IconPosition.Leading
      ? "absolute left-0"
      : "absolute right-0 pr-3";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        positionClasses,
        "flex items-center justify-center",
        "cursor-pointer",
        "disabled:cursor-not-allowed",
        position === IconPosition.Leading && iconPaddingStyles[size],
        "z-10"
      )}
      aria-label={ariaLabel}
    >
      <Icon
        name={iconName}
        className={cn(iconSizeStyles[size], textColorClass(IconColor.Disabled))}
      />
    </Button>
  );
};

export default DatepickerIconButton;
