import type { FC } from "react";
import React from "react";

import { Card, CardProps } from "@/components/Card";
import { type IconProps } from "@/components/Icons";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import {
  Align,
  BrandColor,
  Justify,
  Orientation,
  Size,
  Spacing,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface RichCardProps extends CardProps {
  badge?: string;
  compact?: boolean;
  description?: string | string[];
  icon?: FC<IconProps>;
  title?: string;
  action?: React.ReactNode;
}

/**
 * A card component that displays an icon, title, description, and badge.
 * Designed for richer content such as dashboards or item lists.
 *
 * @example
 * ```tsx
 * <RichCard
 *   icon={StarIcon}
 *   title="Getting Started"
 *   description="Follow these steps to set up your workspace."
 *   badge="New"
 * />
 * ```
 *
 * @param badge A small badge for supplementary info such as status or count.
 * @param compact When true, uses a horizontal layout with tighter spacing.
 * @param description Body text. Pass an array of strings to render a bulleted list.
 * @param icon The icon component to display beside the title.
 * @param title The card heading.
 * @param action A React node (e.g. a button) rendered in the action slot.
 * @param children Content displayed inside the card, below the description.
 * @param props Additional HTML properties to apply to the card.
 */
export const RichCard: FC<RichCardProps> = ({
  children,
  action,
  badge,
  description,
  icon: IconContent,
  title,
  compact,
  ...props
}) => {
  return (
    <Card {...props}>
      <Stack
        orientation={compact ? Orientation.Row : Orientation.Column}
        spacing={compact ? Spacing.Lg : Spacing.Md}
        align={Align.Start}
        justify={Justify.Between}
        className={cn("w-full h-full")}
      >
        <Stack
          orientation={Orientation.Column}
          spacing={compact ? Spacing.Xs : Spacing.Md}
        >
          <Stack
            spacing={compact ? Spacing.Sm : Spacing.Md}
            align={badge ? Align.Start : Align.Center}
          >
            {IconContent && (
              <IconContent size={Size.Lg} color={BrandColor.Accent} />
            )}
            <Stack
              orientation={Orientation.Column}
              spacing={compact ? Spacing.Xs : Spacing.Sm}
            >
              {badge && (
                <Text
                  variant={TextVariant.Md}
                  color={BrandColor.Accent}
                  className={cn("leading-normal")}
                >
                  {badge}
                </Text>
              )}
              {title && (
                <Text variant={TextVariant.Lg} className={cn("leading-normal")}>
                  {title}
                </Text>
              )}
            </Stack>
          </Stack>
          {description && <Description text={description} />}
          {children}
        </Stack>
        {action && <div className={cn(!compact && "w-full")}>{action}</div>}
      </Stack>
    </Card>
  );
};

/**
 * Renders card body text. A plain string is displayed as a single paragraph;
 * an array of strings is rendered as a bulleted list.
 *
 * @param text The description content.
 */
export const Description: FC<{ text: string | string[] }> = ({ text }) => {
  if (typeof text === "string") {
    return <Text color={TextColor.Secondary}>{text}</Text>;
  }

  return (
    <ul className="list-disc list-inside mx-2 marker:text-xs">
      {text.map((line) => (
        <li key={line} className={textColorClass(TextColor.Secondary)}>
          <Text color={TextColor.Secondary}>{line}</Text>
        </li>
      ))}
    </ul>
  );
};

RichCard.displayName = "RichCard";
