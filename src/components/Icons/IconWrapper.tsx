import { type FC } from "react";

import { Size } from "@/types/size";
import { cn } from "@/util/classes";

import { type IconInput, resolveIconInput } from "./Icon";

export interface IconWrapperProps {
  // IconInput (rather than FC<IconProps>) while the legacy icon API is
  // bridged, so pre-0.0.40 consumers can keep passing IconName values
  content?: IconInput;
  size?: Size | number;
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
 *
 * @internal For VOODO components that take an icon prop.
 */
export const IconWrapper: FC<IconWrapperProps> = ({
  content,
  size,
  className,
}) => {
  const Content = resolveIconInput(content);
  if (!Content) return null;

  // A numeric size also boxes the wrapper and fills the svg into it, so a
  // third-party icon component that ignores `size` (heroicons, for one)
  // still renders at the requested glyph size instead of its own default.
  const px = typeof size === "number" ? size : undefined;

  return (
    <span
      className={cn(
        px !== undefined && "inline-flex shrink-0 [&>svg]:size-full",
        className
      )}
      style={px !== undefined ? { width: px, height: px } : undefined}
    >
      <Content size={size} />
    </span>
  );
};

IconWrapper.displayName = "IconWrapper";
