import type { FC, ReactNode } from "react";

import { Stack } from "@/components/Stack";
import { useBelowBreakpoint } from "@/util/breakpoints";

export interface FilterBarProps {
  /** A title or heading: at the start of the row, or on its own row when narrow. */
  leading?: ReactNode;
  /** The search input; the bar sizes its slot. */
  search?: ReactNode;
  /** Filter and sort controls, such as {@link ChipSelect}s. */
  children?: ReactNode;
  /** Primary actions (a create button), kept at the end of the row. */
  actions?: ReactNode;
}

/**
 * The search, filter and action controls above a list. One row on a wide screen;
 * below 1024px the title, then the search and actions, then the filters each
 * take a row, the filters scrolling sideways.
 *
 * @example
 * ```tsx
 * <FilterBar
 *   search={<Input type="search" icon={SearchIcon} placeholder="Search" />}
 *   actions={<Button variant="primary" leadingIcon={AddIcon} collapse="sm">New</Button>}
 * >
 *   <ChipSelect aria-label="Group by" prefix="Group by" value="none" onChange={() => {}} options={[{ id: "none", label: "None" }]} />
 * </FilterBar>
 * ```
 *
 * @param leading A title or heading: at the start of the row on a wide screen, on its own row below 1024px.
 * @param search The search input. Its slot grows to fill the row.
 * @param children Filter and sort controls.
 * @param actions Primary actions, kept at the end of the row.
 */
export const FilterBar: FC<FilterBarProps> = ({
  leading,
  search,
  children,
  actions,
}) => {
  const narrow = useBelowBreakpoint("lg");
  const searchSlot = search ? (
    <div className="min-w-30 max-w-88 flex-[1_1_8rem]">{search}</div>
  ) : null;

  if (narrow) {
    return (
      <Stack orientation="col" spacing="sm">
        {leading}
        <Stack orientation="row" spacing="sm" align="center">
          {search ? <div className="min-w-0 flex-1">{search}</div> : null}
          {actions}
        </Stack>
        {children ? (
          <Stack orientation="row" spacing="sm" align="center" scroll>
            {children}
          </Stack>
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack orientation="row" spacing="sm" align="center" justify="end" wrap>
      {leading ? <div className="min-w-0 flex-1">{leading}</div> : null}
      {searchSlot}
      {children}
      {actions}
    </Stack>
  );
};

FilterBar.displayName = "FilterBar";
