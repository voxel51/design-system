import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";

import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface ListRowProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "title"
> {
  /** The row's name, on one line; cut with an ellipsis and shown in full in a tooltip. */
  title: ReactNode;
  /** A second line under the title, such as `Dataset · 2 minutes ago`. */
  subtitle?: ReactNode;
  /** A marker before the text, aligned with the title, such as a `StatusDot`. */
  leading?: ReactNode;
  /** Controls at the row's end, outside the link (an unpin `IconAction`, say). */
  actions?: ReactNode;
}

/**
 * A compact clickable row for side lists such as recent runs or pinned items:
 * an optional leading marker, a one-line title and subtitle, and optional
 * trailing actions. It renders a link when given `href`, a button otherwise.
 *
 * @example
 * ```tsx
 * <ListRow
 *   href="/runs/1"
 *   leading={<StatusDot color="status-progress-text" />}
 *   title="Similarity index refresh"
 *   subtitle="Pest Detection 1K · 2 minutes ago"
 * />
 * ```
 *
 * @param title The row's name, on one line; a cut title shows in full in a tooltip.
 * @param subtitle A second line under the title, in secondary text.
 * @param leading A marker before the text, aligned with the title (a `StatusDot`, say).
 * @param actions Controls at the row's end, kept outside the link or button.
 * @param href Makes the row a link; without it the row is a button (use `onClick`).
 * @param className `class` overrides for the row.
 * @param props Additional link (or button) properties, applied to the clickable part.
 */
export const ListRow = forwardRef<HTMLAnchorElement, ListRowProps>(
  ({ title, subtitle, leading, actions, className, href, ...props }, ref) => {
    const body = (
      <>
        {leading && <span className="mt-1.5 flex shrink-0">{leading}</span>}
        <span className="min-w-0 flex-1">
          <Text
            variant={TextVariant.BodySecondary}
            color={TextColor.Primary}
            truncate
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              variant={TextVariant.BodySecondary}
              color={TextColor.Secondary}
              truncate
            >
              {subtitle}
            </Text>
          )}
        </span>
      </>
    );
    const clickable =
      "flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 px-2 py-1.5 text-left";

    return (
      <div
        className={cn(
          "flex items-center transition-colors",
          radiusStyles(Radius.Sm),
          bgColorClass(BackgroundColor.Card, ElementState.Hover),
          className
        )}
      >
        {href !== undefined ? (
          <a ref={ref} href={href} className={clickable} {...props}>
            {body}
          </a>
        ) : (
          <button
            type="button"
            className={clickable}
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {body}
          </button>
        )}
        {actions && <span className="flex shrink-0 pr-1">{actions}</span>}
      </div>
    );
  }
);

ListRow.displayName = "ListRow";
