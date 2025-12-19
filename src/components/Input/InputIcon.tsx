import { Size } from "@/types";
import { cn } from "@/util/classes";
import { type FC } from "react";
import { IconProps } from "../Icons/types";
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
        hasText ? "text-content-text-primary" : "text-content-text-secondary",
        iconPaddingStyles[size]
      )}
    >
      <Icon className={cn(iconSizeStyles[size])} />
    </span>
  );
};

InputIcon.displayName = "InputIcon";
