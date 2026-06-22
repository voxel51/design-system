import type { FC, ReactNode } from "react";

import { Button } from "@/components/Button";
import { type IconProps } from "@/components/Icons";
import { Stack, StackProps } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  Align,
  BrandColor,
  Orientation,
  Radius,
  Spacing,
  TextColor,
  TextVariant,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

export interface EmptyStateProps extends StackProps {
  icon?: FC<IconProps>;
  title: string;
  description?: string;
  /**
   * When `true`, applies a subtle entrance/attention animation to the icon.
   * Defaults to `false`.
   */
  animated?: boolean;
  /**
   * The label for the primary action button rendered below the description.
   * Provide together with {@link EmptyStateProps.onAction} for the convenience
   * single-action API. Ignored when {@link EmptyStateProps.actions} is provided.
   */
  actionLabel?: string;
  /**
   * Click handler for the primary action button. Used together with
   * {@link EmptyStateProps.actionLabel}.
   */
  onAction?: () => void;
  /**
   * Custom action content (e.g. one or more {@link Button}s) rendered below the
   * description. Takes precedence over {@link EmptyStateProps.actionLabel} /
   * {@link EmptyStateProps.onAction} when both are supplied.
   */
  actions?: ReactNode;
}

/**
 * A basic empty state to display to the user.
 *
 * @example
 * ```tsx
 * // Simple single-action API
 * <EmptyState
 *   icon={AddIcon}
 *   title="No datasets yet"
 *   description="Create your first dataset to get started."
 *   actionLabel="Create dataset"
 *   onAction={handleCreate}
 *   animated
 * />
 *
 * // Custom actions
 * <EmptyState
 *   icon={AddIcon}
 *   title="No datasets yet"
 *   actions={
 *     <>
 *       <Button variant={Variant.Primary}>Create</Button>
 *       <Button variant={Variant.Secondary}>Import</Button>
 *     </>
 *   }
 * />
 * ```
 *
 * @param icon The icon to display in the empty state.
 * @param title The title to display in the empty state.
 * @param description An optional description to display in the empty state.
 * @param animated Whether to animate the icon for attention. Defaults to `false`.
 * @param actionLabel The label for the primary action button.
 * @param onAction Click handler for the primary action button.
 * @param actions Custom action content rendered below the description. Takes
 *   precedence over `actionLabel`/`onAction`.
 * @param props Additional HTML properties to apply to the component.
 *
 *
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon: IconContent,
  title,
  description,
  animated = false,
  actionLabel,
  onAction,
  actions,
  className,
  ...props
}) => {
  const renderedActions =
    actions ??
    (actionLabel ? (
      <Button variant={Variant.Primary} onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null);

  return (
    <Stack
      orientation={Orientation.Column}
      align={Align.Center}
      className={cn(
        "text-center p-10",
        radiusStyles(Radius.Md),
        bgColorClass(BackgroundColor.Card1),
        className
      )}
      {...props}
    >
      {IconContent && (
        <IconContent
          color={BrandColor.Accent}
          // No fixed `size` so the icon fills the explicit box below, letting
          // it render larger than the capped Size.Xl token.
          className={cn("w-12 h-12", animated && "animate-pulse")}
        />
      )}
      <Text variant={TextVariant.Xl}>{title}</Text>
      {description && <Text color={TextColor.Muted}>{description}</Text>}
      {renderedActions && (
        <Stack
          orientation={Orientation.Row}
          align={Align.Center}
          spacing={Spacing.Sm}
          className="mt-2"
        >
          {renderedActions}
        </Stack>
      )}
    </Stack>
  );
};
EmptyState.displayName = "EmptyState";
