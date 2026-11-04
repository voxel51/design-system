import { Children, Fragment, type FC, type HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

export type MetaListProps = HTMLAttributes<HTMLDivElement>;

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
 * @param className `class` overrides to apply to the component.
 * @param children The facts; empty children (`false`, `null`) are skipped.
 * @param props Additional HTML properties to apply to the component.
 */
export const MetaList: FC<MetaListProps> = ({
  className,
  children,
  ...props
}) => {
  const items = Children.toArray(children);
  return (
    <Text
      variant={TextVariant.BodySecondary}
      color={TextColor.Secondary}
      className={cn("flex flex-wrap items-center gap-x-2", className)}
      {...props}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span aria-hidden className="text-content-text-muted">
              ·
            </span>
          )}
          <span className="inline-flex items-center">{item}</span>
        </Fragment>
      ))}
    </Text>
  );
};

MetaList.displayName = "MetaList";
