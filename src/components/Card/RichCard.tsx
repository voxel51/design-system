import type { FC } from "react";
import React from "react";

import { Card, CardBackground, CardProps } from "@/components/Card";
import { Icon } from "@/components/Icons";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import {
  BrandColor,
  IconName,
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
  icon?: IconName;
  title?: string;
  action?: React.ReactNode;
}

/**
 * RichCard is a card component that can display an icon, title, description,
 * and badge. It is designed to be used in situations where you want to provide
 * more information than a standard card, such as in a dashboard or a list of
 * items.
 *
 * @argument badge A small badge that can be used to display additional
 * information, such as a status or a count.
 * @argument description A description of the card. It can be a string or an
 * array of strings. If it is an array of strings, each string will be
 * displayed as a separate line.
 * @argument icon The name of the icon to display in the card. See {@link IconName}.
 * @argument title The title of the card.
 * @argument children The content to display inside the card, below the description.
 * @argument props Additional HTML properties to apply to the card.
 * @returns A RichCard component.
 */
export const RichCard: FC<RichCardProps> = ({
  children,
  action,
  badge,
  description,
  icon,
  title,
  compact,
  ...props
}) => {
  return (
    <Card {...props}>
      <Stack
        orientation={compact ? Orientation.Row : Orientation.Column}
        spacing={compact ? Spacing.Lg : Spacing.Md}
        className={cn("items-start w-full justify-between")}
      >
        <Stack
          orientation={Orientation.Column}
          spacing={compact ? Spacing.Xs : Spacing.Md}
        >
          <Stack
            spacing={compact ? Spacing.Sm : Spacing.Md}
            className={cn("items-center")}
          >
            {icon && !compact && (
              <Card
                compact
                background={CardBackground.Elevated}
                className={cn("shadow-none")}
              >
                <Icon name={icon} size={Size.Xl} color={BrandColor.Accent} />
              </Card>
            )}
            {icon && compact && (
              <Icon name={icon} size={Size.Xl} color={BrandColor.Accent} />
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
