import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

import { Card, CardBackground } from "@/components/Card";
import { IconAction } from "@/components/IconAction";
import { ChevronBottomIcon, ChevronTopIcon } from "@/components/Icons";
import { type IconInput } from "@/components/Icons/Icon";
import { IconWrapper } from "@/components/Icons/IconWrapper";
import { Text } from "@/components/Text";
import {
  BorderColor,
  borderColorClass,
  IconColor,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";
import { useDisclosure, type UseDisclosureOptions } from "@/util/useDisclosure";

export interface CollapsibleCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">, UseDisclosureOptions {
  /** The section's name, in the header. */
  title: ReactNode;
  /** One line after the title, such as the current choice; cut with an ellipsis. */
  summary?: string;
  /** An 18px icon before the title; it brightens while the card is open. */
  icon?: IconInput;
  /** Small borderless controls shown in the header while open, left of the chevron. */
  actions?: ReactNode;
  /** The card's fill. Defaults to the nested card surface. */
  background?: CardBackground;
  /** Whether the card has an outline. Defaults to `true`. */
  border?: boolean;
  /** A rule between the header and the content, with roomier content. */
  divided?: boolean;
  /** The section's content, shown while open. */
  children?: ReactNode;
}

/**
 * A card whose header folds its content away: an icon, a title, a one-line
 * summary of the current choice and a chevron. For long forms split into
 * sections, such as a run's target, agent and settings.
 *
 * @example
 * ```tsx
 * <CollapsibleCard icon={TargetIcon} title="Target" summary="All samples (200)">
 *   <RadioGroup ... />
 * </CollapsibleCard>
 * ```
 *
 * @param title The section's name, in the header.
 * @param summary One line after the title, such as the current choice; a cut summary shows in full in a tooltip.
 * @param icon An 18px icon before the title, emphasised while open.
 * @param background The card's {@link CardBackground}. Defaults to `"secondary"`.
 * @param border Whether the card has an outline. Defaults to `true`.
 * @param divided Draws a rule under the header and opens the content up; for a card on a plain surface.
 * @param actions Small borderless controls shown in the header while open; a click on one never folds the card.
 * @param defaultOpen Initial open state when uncontrolled. Defaults to `true`.
 * @param open Controlled open state, with `onOpenChange`.
 * @param onOpenChange Called with the next open state.
 * @param className `class` overrides for the card.
 * @param props Additional HTML properties for the card.
 */
export const CollapsibleCard = ({
  title,
  summary,
  icon,
  actions,
  background = CardBackground.Secondary,
  border = true,
  divided = false,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  className,
  children,
  ...props
}: CollapsibleCardProps): ReactNode => {
  const { open, toggle } = useDisclosure({
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
  });

  return (
    <Card
      background={background}
      border={border}
      className={cn("p-0", className)}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={toggle}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        >
          {icon && (
            <span className="flex size-6 shrink-0 items-center justify-center">
              <IconWrapper
                content={icon}
                size={Size.Xl}
                className={textColorClass(
                  open ? IconColor.Emphasis : IconColor.Default
                )}
              />
            </span>
          )}
          <Text variant={TextVariant.HeadingSm} className="shrink-0">
            {title}
          </Text>
          {summary && (
            <>
              <Text
                variant={TextVariant.BodySecondary}
                color={TextColor.Tertiary}
                aria-hidden
              >
                ·
              </Text>
              <Text
                variant={TextVariant.BodySecondary}
                color={TextColor.Secondary}
                truncate
              >
                {summary}
              </Text>
            </>
          )}
        </button>
        {open && actions}
        <IconAction
          size={Size.Sm}
          icon={open ? ChevronTopIcon : ChevronBottomIcon}
          aria-label={open ? "Collapse" : "Expand"}
          aria-hidden
          tabIndex={-1}
          onClick={toggle}
        />
      </div>
      {open && (
        <div
          className={cn(
            "flex flex-col px-4 pb-4",
            divided
              ? clsx(
                  "gap-6 pt-5 border-t",
                  borderColorClass(BorderColor.Subtle)
                )
              : "gap-4 pt-1"
          )}
        >
          {children}
        </div>
      )}
    </Card>
  );
};

CollapsibleCard.displayName = "CollapsibleCard";
