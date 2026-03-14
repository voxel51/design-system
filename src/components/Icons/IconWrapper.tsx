import { type FC } from "react";

import { IconName } from "@/types/icons";
import { Size } from "@/types/size";
import { cn } from "@/util/classes";

import { Icon } from "./Icon";

export interface IconWrapperProps {
  content?: FC | IconName;
  size?: Size;
  className?: string;
}

/**
 * Helper component which resolves {@link FC} | {@link IconName} | ``undefined`` to a rendered icon.
 *
 * Wraps content in a span; use `className` to constrain icon bounds or apply color styling.
 *
 * @param content Icon {@link FC}, icon name, or undefined
 * @param size Size forwarded to {@link Icon} when resolving by name
 * @param className Classes applied to the wrapping span
 */
export const IconWrapper: FC<IconWrapperProps> = ({
  content,
  size,
  className,
}) => {
  if (!content) return null;

  const Content =
    typeof content === "string"
      ? () => <Icon name={content} size={size} />
      : content;

  return (
    <span className={cn(className)}>
      <Content />
    </span>
  );
};

IconWrapper.displayName = "IconWrapper";
