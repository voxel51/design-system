import { type FC } from "react";

import { Size } from "@/types/size";
import { cn } from "@/util/classes";

import { type IconInput, resolveIconInput } from "./Icon";

export interface IconWrapperProps {
  // IconInput (rather than FC<IconProps>) while the legacy icon API is
  // bridged, so pre-0.0.40 consumers can keep passing IconName values
  content?: IconInput;
  size?: Size;
  className?: string;
}

/**
 * Helper component which resolves an icon {@link FC} | ``undefined`` to a rendered icon.
 *
 * Wraps content in a span; use `className` to constrain icon bounds or apply color styling.
 *
 * @param content Icon {@link FC}, legacy {@link IconName}, or undefined
 * @param size Size forwarded to the icon component
 * @param className Classes applied to the wrapping span
 */
export const IconWrapper: FC<IconWrapperProps> = ({
  content,
  size,
  className,
}) => {
  const Content = resolveIconInput(content);
  if (!Content) return null;

  return (
    <span className={cn(className)}>
      <Content size={size} />
    </span>
  );
};

IconWrapper.displayName = "IconWrapper";
