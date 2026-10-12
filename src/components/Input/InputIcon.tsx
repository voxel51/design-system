import { type FC } from "react";

import { type IconInput, IconWrapper } from "@/components/Icons";
import { Size, TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

import { iconPaddingStyles, iconSizes, toInputSize } from "./styles";

export interface InputIconProps {
  icon: IconInput;
  size: Size;
  hasText?: boolean;
}

/**
 * A wrapper component for properly formatting an icon to display within the {@link Input} component.
 *
 * @param icon Icon component specifying the icon to use.
 * @param size The size of the icon. See {@link Size}.
 * @param hasText If `true`, shows the icon in the primary text color; otherwise it is muted.
 *
 * @internal For use by {@link Input}.
 */
export const InputIcon: FC<InputIconProps> = ({
  icon,
  size: requestedSize,
  hasText,
}) => {
  const size = toInputSize(requestedSize);
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
      <IconWrapper size={iconSizes[size]} content={icon} />
    </span>
  );
};

InputIcon.displayName = "InputIcon";
