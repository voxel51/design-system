// Copyright 2017-2026, Voxel51, Inc.

import clsx from "clsx";
import type { FC, ReactNode } from "react";

import { Button } from "@/components/Button";
import { FilterListIcon } from "@/components/Icons";
import { Popover, PopoverAnchor } from "@/components/Popover";
import { Text } from "@/components/Text";
import { TEXT_STYLES } from "@/styles/text";
import {
  bgColorClass,
  InteractiveColor,
  Size,
  TextVariant,
  Variant,
} from "@/types";

export interface FilterMenuProps {
  /** The controls that narrow the results: selects, toggles, radio groups. */
  children: ReactNode;
  /** How many filters are on. Zero shows a plain button; above it a count. */
  activeCount?: number;
  /** Label of the button. Default `"Filters"`. */
  label?: string;
  /** Resets every filter. Offered in the panel, enabled while any is on. */
  onClear?: () => void;
  /** Hides the label, leaving the icon and the count. */
  iconOnly?: boolean;
  /** Where the panel opens. Default `BottomEnd`. */
  anchor?: PopoverAnchor;
  className?: string;
}

/**
 * A filter button that opens a panel of filter controls, for the narrow side
 * of a search row: one large search field, and this beside it. The button says
 * when filters are on: it carries a count, and the panel offers to clear them.
 *
 * @example
 * ```tsx
 * <div className="flex gap-2">
 *   <Input className="flex-1" placeholder="Search" />
 *   <FilterMenu activeCount={2} onClear={reset}>
 *     <MediaTypeSelect />
 *     <OwnerRadios />
 *   </FilterMenu>
 * </div>
 * ```
 *
 * @param children The filter controls.
 * @param activeCount How many filters are on.
 * @param label Button label. Default `"Filters"`.
 * @param onClear Resets the filters; offered in the panel, enabled while any is on.
 * @param iconOnly Hides the label.
 * @param anchor Where the panel opens.
 */
export const FilterMenu: FC<FilterMenuProps> = ({
  children,
  activeCount = 0,
  label = "Filters",
  onClear,
  iconOnly,
  anchor = PopoverAnchor.BottomEnd,
  className,
}) => {
  const active = activeCount > 0;
  return (
    <Popover
      anchor={anchor}
      className={className}
      panelClassName="w-72 max-w-[calc(100vw-2rem)] p-4"
      trigger={
        <Button
          variant={Variant.Secondary}
          size={Size.Md}
          leadingIcon={FilterListIcon}
          aria-label={active ? `${label}, ${activeCount} active` : label}
          data-active={active || undefined}
        >
          {!iconOnly && label}
          {active && (
            <span
              className={clsx(
                "ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-white",
                bgColorClass(InteractiveColor.PrimaryDefault),
                TEXT_STYLES[TextVariant.Label]
              )}
            >
              {activeCount}
            </span>
          )}
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Text variant={TextVariant.BodySecondary}>{label}</Text>
          {onClear && (
            <Button
              variant={Variant.Secondary}
              size={Size.Sm}
              borderless
              disabled={!active}
              onClick={onClear}
            >
              Clear all
            </Button>
          )}
        </div>
        {children}
      </div>
    </Popover>
  );
};

FilterMenu.displayName = "FilterMenu";
