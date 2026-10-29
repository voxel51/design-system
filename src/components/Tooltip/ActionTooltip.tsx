import {
  type FC,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
  useState,
} from "react";

import { COLLAPSE_LABEL_ATTR } from "@/util/compact";

import { Tooltip } from "./Tooltip";
import { TooltipLabel } from "./TooltipLabel";

/**
 * The tooltip of an action that may drop or shorten its label: its name and
 * hint while collapsed or while its label is cut short, its hint alone
 * otherwise, nothing without either.
 *
 * @internal
 */
export const ActionTooltip: FC<{
  collapsed: boolean;
  /** The label may be cut short by its row: check on hover or tap. */
  truncatable?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  children: ReactElement;
}> = ({ collapsed, truncatable = false, label, hint, children }) => {
  const [cut, setCut] = useState(false);
  const measure = (event: SyntheticEvent<HTMLElement>): void => {
    const text = event.currentTarget.querySelector(`[${COLLAPSE_LABEL_ATTR}]`);
    setCut(!!text && text.scrollWidth > text.clientWidth);
  };
  const named = (collapsed || cut) && label;
  const content = named ? <TooltipLabel label={label} detail={hint} /> : hint;
  if (!truncatable && !content) return children;
  return (
    <Tooltip
      content={content ?? null}
      onMouseOverCapture={truncatable ? measure : undefined}
      onPointerDownCapture={truncatable ? measure : undefined}
    >
      {children}
    </Tooltip>
  );
};
