import {
  Children,
  Fragment,
  isValidElement,
  type FC,
  type HTMLAttributes,
} from "react";

import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

export interface MetaListProps extends HTMLAttributes<HTMLDivElement> {
  /** Keeps the facts on one line, cut with an ellipsis; when cut, they show in full in a tooltip. */
  truncate?: boolean;
}

/**
 * A wrapping line of short facts separated by dim dots, such as
 * `Dev User · Started 7 days ago · Ran for 7s`.
 *
 * @example
 * ```tsx
 * <MetaList>
 *   <span>Dev User</span>
 *   <span>Started 7 days ago</span>
 *   <span>Ran for 7s</span>
 * </MetaList>
 * ```
 *
 * @param truncate Keeps the facts on one line, cut with an ellipsis; when cut,
 *  they show in full in a tooltip. Size it from the parent, as with {@link Text}.
 * @param className `class` overrides to apply to the component.
 * @param children The facts; empty children (`false`, `null`) are skipped.
 * @param props Additional HTML properties to apply to the component.
 */
export const MetaList: FC<MetaListProps> = ({
  className,
  children,
  truncate,
  ...props
}) => {
  const items = Children.toArray(children);
  return (
    <Text
      variant={TextVariant.BodySecondary}
      color={TextColor.Secondary}
      truncate={truncate}
      className={cn(
        !truncate && "flex flex-wrap items-center gap-x-2",
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <Fragment
          key={isValidElement(item) && item.key !== null ? item.key : i}
        >
          {i > 0 && (
            <span
              aria-hidden
              className={cn("text-content-text-muted", truncate && "mx-2")}
            >
              ·
            </span>
          )}
          <span className={cn(!truncate && "inline-flex items-center")}>
            {item}
          </span>
        </Fragment>
      ))}
    </Text>
  );
};

MetaList.displayName = "MetaList";
