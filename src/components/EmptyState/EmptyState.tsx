import type { FC, ReactNode } from "react";

import { RichCard } from "@/components/Card";
import { type IconInput, resolveIconInput } from "@/components/Icons";
import { Stack, StackProps } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  Align,
  BrandColor,
  Justify,
  Orientation,
  Radius,
  Size,
  Spacing,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

import { DocsButton } from "./DocsButton";

/** One card in an {@link EmptyState}'s "how to get started" row. */
export interface EmptyStateStep {
  icon?: IconInput;
  /** Numbered by the caller, such as `"1. Connect a source"`. */
  title: string;
  description: string;
  /** The step's own call to action; a step without one only informs. */
  action?: ReactNode;
}

export interface EmptyStateProps extends StackProps {
  icon?: IconInput;
  art?: ReactNode;
  title: string;
  description?: string;
  size?: EmptyStateSize;
  /** Calls to action in a centred row, the primary first. */
  actions?: ReactNode;
  /** Adds a {@link DocsButton} to this page after the actions. */
  docsHref?: string;
  /** The docs button's text. Defaults to `"View Docs"`. */
  docsLabel?: string;
  /** Context under the actions: why they are disabled, what to expect. */
  note?: ReactNode;
  /** A "how to get started" row of cards, wrapping when narrow. */
  steps?: EmptyStateStep[];
  /** Heading above the steps, such as `"How it works"`. */
  stepsTitle?: string;
  /** Small print under everything, such as a permission note. */
  footer?: ReactNode;
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
 * With actions, a docs link and steps:
 *
 * ```tsx
 * <EmptyState
 *   art={<DataLensEmptyArt />}
 *   title="Connect to your data source"
 *   actions={<Button variant="primary" size="sm">Add data source</Button>}
 *   docsHref="https://docs.voxel51.com/teams/data_lens.html"
 *   steps={[
 *     { icon: CodeIcon, title: "1. Define your pipeline", description: "Tell FiftyOne how to query it." },
 *     { icon: HubOutlinedIcon, title: "2. Connect it", description: "Register your operator." },
 *   ]}
 * />
 * ```
 *
 * @param actions Calls to action in a centred, wrapping row, the primary first.
 * @param docsHref Adds a {@link DocsButton} to this page after the actions.
 * @param docsLabel The docs button's text. Defaults to `"View Docs"`.
 * @param note Context under the actions: why they are disabled, what to expect.
 * @param steps A "how to get started" row of bordered {@link RichCard}s, as
 *  many columns as fit (each at least 220px).
 * @param stepsTitle Heading above the steps.
 * @param footer Small print under everything.
 * @param children Free-form content under the actions and note (a form, say).
 * @param props Additional {@link Stack} properties to apply to the component.
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  art,
  title,
  description,
  size = Size.Md,
  actions,
  docsHref,
  docsLabel,
  note,
  steps,
  stepsTitle,
  footer,
  className,
  children,
  ...props
}) => {
  const sm = size === Size.Sm;
  const hasActions = Boolean(actions || docsHref);
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
      {(hasActions || note || children || steps || footer) && (
        <Stack
          orientation={Orientation.Column}
          align={Align.Center}
          spacing={Spacing.Lg}
          className={cn(sm && art ? "mt-5" : "mt-7", "w-full")}
        >
          {hasActions && (
            <Stack justify={Justify.Center} spacing={Spacing.Sm} wrap>
              {actions}
              {docsHref && <DocsButton href={docsHref} label={docsLabel} />}
            </Stack>
          )}
          {note}
          {children && (
            <div className="flex w-full flex-col items-center">{children}</div>
          )}
          {steps && (
            <div className="flex w-full flex-col gap-2 text-left">
              {stepsTitle && (
                <Text
                  variant={TextVariant.BodySecondary}
                  color={TextColor.Secondary}
                >
                  {stepsTitle}
                </Text>
              )}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-md">
                {steps.map((step) => (
                  <RichCard key={step.title} border {...step} />
                ))}
              </div>
            </div>
          )}
          {footer}
        </Stack>
      )}
    </Stack>
  );
};
EmptyState.displayName = "EmptyState";
