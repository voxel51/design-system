import clsx from "clsx";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconColor,
  TextColor,
  textColorClass,
} from "@/types";

export interface FilterChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** The chip text. */
  children: ReactNode;
  /** A count after the text, in a smaller muted figure. */
  count?: number;
  /** Whether the filter is on; shows the chip inverted and sets `aria-pressed`. */
  selected?: boolean;
}

/**
 * A pill button that toggles one filter, such as a tag in a tag cloud, with an
 * optional count.
 *
 * @example
 * ```tsx
 * <FilterChip count={6} selected={on} onClick={() => setOn(!on)}>
 *   automotive
 * </FilterChip>
 * ```
 *
 * @param children The chip text.
 * @param count A count after the text, shown smaller and muted, locale formatted.
 * @param selected Whether the filter is on: the chip inverts and `aria-pressed` is set.
 * @param className `class` overrides to apply to the component.
 * @param props Additional button properties.
 */
export const FilterChip: FC<FilterChipProps> = ({
  children,
  count,
  selected = false,
  className,
  ...props
}) => (
  <button
    type="button"
    aria-pressed={selected}
    className={clsx(
      "inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-body-primary transition-colors",
      selected
        ? [bgColorClass(TextColor.Primary), textColorClass(TextColor.Inverse)]
        : [
            bgColorClass(BackgroundColor.Card),
            textColorClass(TextColor.Secondary),
            bgColorClass(BackgroundColor.CardNested, ElementState.Hover),
            textColorClass(TextColor.Primary, ElementState.Hover),
          ],
      className
    )}
    {...props}
  >
    <span className="truncate">{children}</span>
    {count !== undefined && (
      <span
        className={clsx(
          "text-caption tabular-nums",
          selected
            ? [textColorClass(TextColor.Inverse), "opacity-70"]
            : textColorClass(IconColor.Subtle)
        )}
      >
        {count.toLocaleString()}
      </span>
    )}
  </button>
);
