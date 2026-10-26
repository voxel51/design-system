import type { FC, ReactElement, ReactNode } from "react";

import { Tooltip } from "./Tooltip";
import { TooltipLabel } from "./TooltipLabel";

/**
 * The tooltip of an action that may drop its label: its name and hint while
 * collapsed, its hint alone otherwise, nothing without either.
 *
 * @internal
 */
export const ActionTooltip: FC<{
  collapsed: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  children: ReactElement;
}> = ({ collapsed, label, hint, children }) => {
  const content =
    collapsed && label ? <TooltipLabel label={label} detail={hint} /> : hint;
  return content ? <Tooltip content={content}>{children}</Tooltip> : children;
};
