import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";
import { type FC } from "react";
import { IconProps } from "@/components/Icons/types";
import { iconPaddingStyles, iconSizeStyles } from "./styles";

export interface InputIconProps {
  Icon: FC<IconProps>;
  size: Size;
  hasText?: boolean;
}

export const InputIcon: FC<InputIconProps> = ({ Icon, size, hasText }) => {
  return (
    <span
      className={cn(
        "absolute left-0 flex items-center justify-center",
        hasText
          ? textColorClass(TextColor.Primary)
          : textColorClass(TextColor.Secondary),
        iconPaddingStyles[size]
      )}
    >
      <Icon className={cn(iconSizeStyles[size])} />
    </span>
  );
};

InputIcon.displayName = "InputIcon";
