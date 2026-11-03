import type { FC, ReactNode } from "react";

import { type IconInput, resolveIconInput } from "@/components/Icons";
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
  Size,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface EmptyStateProps extends StackProps {
  icon?: IconInput;
  art?: ReactNode;
  title: string;
  description?: string;
  size?: EmptyStateSize;
}

/** `sm` for narrow sidebars and inline list slots, `md` for panels and pages. */
export type EmptyStateSize = `${Extract<Size, "sm" | "md">}`;

/**
 * A basic empty state to display to the user.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={SearchIcon}
 *   title="No results"
 *   description="Try a different search term."
 * />
 * ```
 *
 * With `art` (such as {@link PanelEmptyArt}), the illustration replaces the
 * icon and the text follows the illustrated layout; `children` render below
 * the text as an action area.
 *
 * ```tsx
 * <EmptyState art={<PanelEmptyArt />} title="No runs yet">
 *   <Button variant="primary">Run a workflow</Button>
 * </EmptyState>
 * ```
 *
 * @param icon The icon to display in the empty state: a per-icon component.
 * @param art An illustration shown instead of the icon, 150px wide.
 * @param title The title to display in the empty state.
 * @param description An optional description to display in the empty state.
 * @param size `"sm"` for narrow sidebars and list slots (104px art, tighter
 *  padding and smaller text), `"md"` for panels and pages. Applies to the
 *  illustrated layout. Defaults to `"md"`.
 * @param children An optional action area below the text.
 * @param props Additional {@link Stack} properties to apply to the component.
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  art,
  title,
  description,
  size = Size.Md,
  className,
  children,
  ...props
}) => {
  const sm = size === Size.Sm;
  const IconContent = resolveIconInput(icon);

  return (
    <Stack
      orientation={Orientation.Column}
      align={Align.Center}
      className={cn(
        "text-center",
        sm && art ? "px-4 py-6" : "p-10",
        radiusStyles(Radius.Md),
        bgColorClass(BackgroundColor.Card),
        className
      )}
      {...props}
    >
      {art && <div className={sm ? "w-[104px]" : "w-[150px]"}>{art}</div>}
      {!art && IconContent && (
        <span
          className={cn(
            "p-3",
            radiusStyles(Radius.Full),
            bgColorClass(BackgroundColor.CardElevated)
          )}
        >
          <IconContent size={Size.Lg} color={BrandColor.Accent} />
        </span>
      )}
      {art ? (
        <>
          <Text
            variant={sm ? TextVariant.HeadingSm : TextVariant.BodyPrimary}
            className={sm ? "mt-3" : "mt-5 font-medium"}
          >
            {title}
          </Text>
          {description && (
            <Text
              variant={
                sm ? TextVariant.BodyTertiary : TextVariant.BodySecondary
              }
              color={TextColor.Tertiary}
              className={sm ? "mt-1 max-w-[240px]" : "mt-1.5"}
            >
              {description}
            </Text>
          )}
        </>
      ) : (
        <>
          <Text variant={TextVariant.HeadingLg}>{title}</Text>
          {description && (
            <Text variant={TextVariant.BodySecondary} color={TextColor.Muted}>
              {description}
            </Text>
          )}
        </>
      )}
      {children && (
        <div className={cn(sm && art ? "mt-5" : "mt-7", "w-full")}>
          {children}
        </div>
      )}
    </Stack>
  );
};
EmptyState.displayName = "EmptyState";
