import { ComboboxOption } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Pill } from "@/components/Pill";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  Align,
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconName,
  Justify,
  Orientation,
  Radius,
  Size,
  Spacing,
  TextColor,
  TextVariant,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Indent per depth level uses the `--spacing-md` CSS variable (1rem / 16px)
 * so it stays in sync with the design system's spacing scale.
 */
const DEPTH_INDENT = "var(--spacing-md)";

export interface TreeSelectOptionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "value"> {
  /** The path string used as the Combobox value. */
  value: string;
  /** Whether this option is currently selected. */
  selected?: boolean;
  /** Nesting depth (0 = top-level child of root). */
  depth?: number;
  /** Primary label text. */
  label: string;
  /** Optional secondary description shown below the label. */
  description?: string;
  /** When `true`, renders the row in a muted style with a "deprecated" badge. */
  deprecated?: boolean;
  /**
   * Optional breadcrumb string shown instead of (or alongside) the label.
   * Used in flat-search mode to disambiguate nodes with duplicate names.
   */
  breadcrumb?: string;
}

/**
 * A single selectable row inside the TreeSelect dropdown panel.
 *
 * Wraps HeadlessUI's `ComboboxOption` with the same Card1/Card2/CardElevated
 * background styling used by `Select/Option`, adding depth-based indentation,
 * an optional description line, and a deprecated badge.
 *
 * @internal For use by TreeSelect and TreeSelectNode.
 */
export const TreeSelectOption: FC<TreeSelectOptionProps> = ({
  value,
  selected,
  depth = 0,
  label,
  description,
  deprecated,
  breadcrumb,
  className,
  ...props
}) => {
  const textColor = deprecated ? TextColor.Muted : TextColor.Primary;

  return (
    <ComboboxOption value={value} className={className} {...props}>
      <Stack
        align={Align.Center}
        justify={Justify.Between}
        spacing={Spacing.Md}
        className={cn(
          "flex-nowrap",
          "py-1.5 px-3",
          radiusStyles(Radius.Sm),
          "cursor-pointer",
          bgColorClass(BackgroundColor.Card1),
          selected && bgColorClass(BackgroundColor.CardElevated),
          bgColorClass(BackgroundColor.Card2, ElementState.Hover)
        )}
        style={{
          paddingLeft: `calc(${depth} * ${DEPTH_INDENT} + var(--spacing-sm) + var(--spacing-xs))`,
        }}
      >
        <Stack orientation={Orientation.Column} className="min-w-0">
          <Stack align={Align.Center} spacing={Spacing.Xs}>
            <Text
              variant={TextVariant.Sm}
              color={textColor}
              className="truncate"
            >
              {breadcrumb ?? label}
            </Text>
            {deprecated && (
              <Pill size={Size.Xs} color={TextColor.Muted}>
                deprecated
              </Pill>
            )}
          </Stack>
          {description && (
            <Text
              variant={TextVariant.Xs}
              color={TextColor.Tertiary}
              className="truncate"
            >
              {description}
            </Text>
          )}
        </Stack>

        <span
          className={cn(
            "size-5 shrink-0 flex items-center",
            textColorClass(TextColor.Secondary)
          )}
        >
          {selected && <Icon name={IconName.Check} size={Size.Sm} />}
        </span>
      </Stack>
    </ComboboxOption>
  );
};

TreeSelectOption.displayName = "TreeSelectOption";
