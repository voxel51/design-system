import type { FC, ReactNode } from "react";

import { TEXT_STYLES } from "@/styles/text";
import { TextColor, TextVariant, textColorClass } from "@/types";
import { cn } from "@/util/classes";

export interface TooltipLabelProps {
  /** What the control is, e.g. its label once only its icon shows. */
  label: ReactNode;
  /** What else to know about it: why it is disabled, its value, a shortcut. */
  detail?: ReactNode;
}

/**
 * Tooltip content naming a control, with an optional detail under it, so a
 * control that drops its label (icon-only on a narrow screen) still says what
 * it is and why it is disabled, or what it is set to.
 *
 * @example
 * ```tsx
 * <Tooltip
 *   content={
 *     <TooltipLabel label="Show only selected" detail="No members in this scope" />
 *   }
 * >
 *   <IconAction icon={FilterAltIcon} aria-label="Show only selected" disabled />
 * </Tooltip>
 * ```
 *
 * @param label What the control is.
 * @param detail What else to know about it: why it is disabled, its value, a shortcut.
 */
export const TooltipLabel: FC<TooltipLabelProps> = ({ label, detail }) => (
  <span className="flex flex-col">
    <span>{label}</span>
    {detail !== undefined && detail !== null && detail !== "" && (
      <span
        className={cn(
          TEXT_STYLES[TextVariant.BodyTertiary],
          textColorClass(TextColor.Secondary)
        )}
      >
        {detail}
      </span>
    )}
  </span>
);

TooltipLabel.displayName = "TooltipLabel";
