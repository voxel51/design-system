import { type FC } from "react";

import { Icon } from "@/components/Icons";
import { IconProps } from "@/components/Icons/types";
import { IconName, Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

import { iconPaddingStyles, iconSizeStyles } from "./styles";

export interface InputIconProps {
  Icon: FC<IconProps> | IconName;
  size: Size;
  hasText?: boolean;
}

/**
 * A wrapper component for properly formatting an icon to display within the {@link Input} component.
 *
 * @param icon Icon reference ({@link FC}) or an {@link IconName} specifying the icon to use.
 * @param size The size of the icon. See {@link Size}.
 * @param hasText If `true`, de-emphasizes the icon in favor of the input text.
 *
 * @internal For use by {@link Input}.
 */
export const InputIcon: FC<InputIconProps> = ({
  Icon: icon,
  size,
  hasText,
}) => {
  const ResolvedIcon: FC<IconProps> =
    typeof icon === "string"
      ? (props) => <Icon name={icon} {...props} />
      : icon;

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
      <ResolvedIcon className={cn(iconSizeStyles[size])} />
    </span>
  );
};

InputIcon.displayName = "InputIcon";
