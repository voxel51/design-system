import type { FC } from "react";

import { Icon } from "@/components/Icons";
import { Stack, StackProps } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
  IconName,
  Orientation,
  Radius,
  Size,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface EmptyStateProps extends StackProps {
  icon: IconName;
  title: string;
  description?: string;
}

/**
 * A basic empty state to display to the user.
 *
 * @param icon The icon to display in the empty state.
 * @param title The title to display in the empty state.
 * @param description An optional description to display in the empty state.
 * @param props Additional HTML properties to apply to the component.
 *
 *
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className,
  ...props
}) => {
  return (
    <Stack
      orientation={Orientation.Column}
      className={cn(
        "items-center text-center p-10",
        radiusStyles(Radius.Md),
        bgColorClass(BackgroundColor.Card1),
        className
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "p-3",
            radiusStyles(Radius.Full),
            bgColorClass(BackgroundColor.CardElevated)
          )}
        >
          <Icon name={icon} size={Size.Lg} color={BrandColor.Accent} />
        </span>
      )}
      <Text variant={TextVariant.Xl}>{title}</Text>
      {description && <Text color={TextColor.Muted}>{description}</Text>}
    </Stack>
  );
};
EmptyState.displayName = "EmptyState";
