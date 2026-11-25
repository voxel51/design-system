import { type FC, type HTMLAttributes, type ReactNode, useState } from "react";

import { Checkbox } from "@/components/Checkbox";
import { Text } from "@/components/Text";
import { TextAction } from "@/components/TextAction";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface FilterGroupOption {
  /** What `selected` and `onToggle` use to name the option. */
  value: string;
  label: string;
  /** How many items the option would show; drawn at the row's end. */
  count?: number;
}

export interface FilterGroupProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "onToggle"
> {
  /** The group's heading. */
  title: string;
  options: FilterGroupOption[];
  /** The `value`s that are on. */
  selected: readonly string[];
  onToggle: (value: string) => void;
  /** Shows this many options, then "Show N more"; options that are on stay shown. */
  collapseAfter?: number;
  /** Draws a dash for each count, for a list that could not be counted. */
  hideCounts?: boolean;
  /** A small visual before an option's count, such as a logo. */
  renderLeading?: (value: string) => ReactNode;
}

/**
 * A titled list of checkbox options, each with its count, for a page's filter
 * column beside a list or grid of cards. Long lists fold behind "Show N more".
 *
 * @example
 * ```tsx
 * <FilterGroup
 *   title="Modality"
 *   options={[
 *     { value: "image", label: "Images", count: 12 },
 *     { value: "video", label: "Video", count: 3 },
 *   ]}
 *   selected={picked}
 *   onToggle={toggle}
 *   collapseAfter={6}
 * />
 * ```
 *
 * @param title The group's heading.
 * @param options The choices: a `value`, a `label` and an optional `count`.
 * @param selected The `value`s that are on.
 * @param onToggle Called with an option's `value` when its row is pressed.
 * @param collapseAfter Shows this many options, then "Show N more"; options that are on stay shown.
 * @param hideCounts Draws a dash for each count, for a list that could not be counted.
 * @param renderLeading A small visual before an option's count, such as a logo.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const FilterGroup: FC<FilterGroupProps> = ({
  title,
  options,
  selected,
  onToggle,
  collapseAfter,
  hideCounts = false,
  renderLeading,
  className,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const limit = collapseAfter ?? options.length;
  const visible = expanded
    ? options
    : options.filter((o, i) => i < limit || selected.includes(o.value));
  const hidden = options.length - visible.length;

  return (
    <section className={cn("flex flex-col gap-2", className)} {...props}>
      <Text
        variant={TextVariant.Label}
        color={TextColor.Tertiary}
        className="px-2"
      >
        {title}
      </Text>
      <div className="flex flex-col gap-0.5">
        {visible.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex h-8 min-w-0 items-center gap-2.5 px-2",
              radiusStyles(Radius.Sm),
              bgColorClass(BackgroundColor.CardNested, ElementState.Hover)
            )}
          >
            <div className="min-w-0 flex-1">
              <Checkbox
                checked={selected.includes(option.value)}
                label={option.label}
                onChange={() => onToggle(option.value)}
                className="min-w-0 max-w-full"
                labelClassName={cn(
                  "min-w-0 truncate",
                  textColorClass(TextColor.Secondary),
                  textColorClass(TextColor.Primary, ElementState.Hover)
                )}
              />
            </div>
            {renderLeading && (
              <span className="flex size-3.5 shrink-0 items-center justify-center">
                {renderLeading(option.value)}
              </span>
            )}
            {option.count !== undefined && (
              <Text
                variant={TextVariant.BodySecondary}
                color={TextColor.Tertiary}
                className="ml-auto shrink-0 tabular-nums"
              >
                {hideCounts ? "–" : option.count}
              </Text>
            )}
          </div>
        ))}
        {(hidden > 0 || expanded) && options.length > limit && (
          <TextAction
            className="self-start"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `Show ${hidden} more`}
          </TextAction>
        )}
      </div>
    </section>
  );
};

FilterGroup.displayName = "FilterGroup";
