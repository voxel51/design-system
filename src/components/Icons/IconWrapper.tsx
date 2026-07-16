import { type FC } from "react";

import { Size } from "@/types/size";
import { cn } from "@/util/classes";

import { type IconProps } from "./IconBase";

export interface IconWrapperProps {
  content?: FC<IconProps>;
  size?: Size;
  className?: string;
}

/**
 * Helper component which resolves an icon {@link FC} | ``undefined`` to a rendered icon.
 *
 * Wraps content in a span; use `className` to constrain icon bounds or apply color styling.
 *
 * @param content Icon {@link FC} or undefined
 * @param size Size forwarded to the icon component
 * @param className Classes applied to the wrapping span
 */
export const IconWrapper: FC<IconWrapperProps> = ({
  content: Content,
  size,
  className,
}) => {
  if (!Content) return null;

  return (
    <span className={cn(className)}>
      <Content size={size} />
    </span>
  );
};

IconWrapper.displayName = "IconWrapper";
