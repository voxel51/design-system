import type { JSX, ReactNode } from "react";

import { ChipSelect, type ChipSelectOption } from "@/components/ChipSelect";
import { Dropdown, DropdownAnchor } from "@/components/Dropdown";
import { IconAction } from "@/components/IconAction";
import { type IconInput, SlidersHorizontalIcon } from "@/components/Icons";
import { SearchInput } from "@/components/Input";
import { MenuCheckItem, MenuSectionTitle } from "@/components/Menu";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import {
  Align,
  Orientation,
  Size,
  Spacing,
  TextColor,
  TextVariant,
} from "@/types";
import { useElementSize } from "@/util/useElementSize";

export interface ListToolbarFilter {
  id: string;
  /** Names the filter; also its section title in the narrow menu. */
  label: string;
  icon?: IconInput;
  options: ChipSelectOption[];
  /** The `id` of the checked option. */
  value: string;
  onChange: (value: string) => void;
  /** The `id` that means "no filter"; the narrow menu's dot counts the others. Defaults to the first option. */
  defaultValue?: string;
}

export interface ListToolbarProps {
  /** Count, e.g. "12 agents" or "3/12 agents" while filtered: shown inside the search field, or alone when there is none. */
  count?: ReactNode;
  /** Omit for a list that is not searchable. */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  };
  filters?: ListToolbarFilter[];
  /** Buttons at the end of the count line. */
  actions?: ReactNode;
  /** Anything else for the filter row (a sort menu, a view toggle): after the filters when wide, beside the filter menu when narrow. */
  extra?: ReactNode;
  /** Size of the search field. Default `"md"`. */
  size?: `${Size.Sm | Size.Md}`;
  /** Cap the search field at this width in pixels; by default it fills what the other parts leave. */
  searchMaxWidth?: number;
  /** Where the count sits: `"inside"` the search field (default; alone when there is no search), `"start"` before it, or `"end"` after the filters. */
  countPlacement?: "inside" | "start" | "end";
  className?: string;
  /** Container width, in pixels, below which the filters fold into one menu; `0` never folds. Default `420`. */
  narrowBelow?: number;
}

const isActive = (f: ListToolbarFilter): boolean =>
  f.value !== (f.defaultValue ?? f.options[0]?.id);

/**
 * The top of a list: count, search, filters and actions that fit their
 * container. Wide, the count, search and one {@link ChipSelect} per filter share a
 * row; narrow, the search takes the row under the count and the filters fold
 * into a single menu whose button is lit while any is set. Every part is optional,
 * so it serves panels, list pages and tables alike.
 *
 * @example
 * ```tsx
 * <ListToolbar
 *   count="12 runs"
 *   search={{ value, onChange: setValue, placeholder: "Search" }}
 *   filters={[{ id: "owner", label: "Owner", icon: UserRoundIcon, options, value: owner, onChange: setOwner }]}
 * />
 * ```
 *
 * @param count Count line at the start.
 * @param search The search field; omit to hide it.
 * @param filters Declarative single-choice filters. See {@link ListToolbarFilter}.
 * @param size Size of the search field.
 * @param searchMaxWidth Cap on the search field's width.
 * @param actions Buttons at the end of the count line.
 * @param extra Anything else for the filter row.
 * @param countPlacement Where the count sits.
 * @param className Class for the wrapper.
 * @param narrowBelow Container width below which the filters fold into one menu.
 */
export function ListToolbar({
  count,
  search,
  filters = [],
  actions,
  extra,
  size = Size.Md,
  searchMaxWidth,
  countPlacement = "inside",
  className,
  narrowBelow = 420,
}: ListToolbarProps): JSX.Element {
  const fold = narrowBelow;
  const countInside = countPlacement === "inside" && !!search;
  const { ref, width } = useElementSize();
  const narrow = fold > 0 && width > 0 && width < fold;
  const active = filters.filter(isActive).length;

  const countText = count && (
    <Text
      variant={TextVariant.Caption}
      color={TextColor.Placeholder}
      style={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        marginRight: 8,
      }}
    >
      {count}
    </Text>
  );

  const searchField = search && (
    <div
      style={{
        flex: searchMaxWidth ? `0 1 ${searchMaxWidth}px` : "1 1 160px",
        minWidth: 96,
        marginRight: !narrow && (filters.length > 0 || extra) ? 8 : undefined,
      }}
    >
      <SearchInput
        size={size}
        trailing={countInside ? countText : undefined}
        placeholder={search.placeholder}
        value={search.value}
        onChange={(value) => search.onChange(value ?? "")}
      />
    </div>
  );

  const filterMenu = (
    <Dropdown
      anchor={DropdownAnchor.BottomEnd}
      trigger={
        <IconAction
          icon={SlidersHorizontalIcon}
          size={Size.Sm}
          active={active > 0}
          aria-label="Filters"
        />
      }
    >
      {filters.map((f) => (
        <div key={f.id}>
          <MenuSectionTitle>{f.label}</MenuSectionTitle>
          {f.options.map((o) => (
            <MenuCheckItem
              key={o.id}
              select
              checked={o.id === f.value}
              onClick={() => f.onChange(o.id)}
            >
              {o.label}
            </MenuCheckItem>
          ))}
        </div>
      ))}
    </Dropdown>
  );

  return (
    <div ref={ref} className={className}>
      <Stack
        orientation={narrow ? Orientation.Column : Orientation.Row}
        align={narrow ? undefined : Align.Center}
        spacing={narrow ? Spacing.Sm : Spacing.None}
        wrap={fold === 0}
      >
        {narrow ? (
          <>
            {((count && !countInside) || actions) && (
              <Stack
                orientation={Orientation.Row}
                align={Align.Center}
                spacing={Spacing.Md}
              >
                {!countInside && countText}
                <div style={{ marginLeft: "auto" }}>{actions}</div>
              </Stack>
            )}
            {(search || filters.length > 0 || extra) && (
              <Stack
                orientation={Orientation.Row}
                align={Align.Center}
                spacing={Spacing.Sm}
              >
                {searchField}
                {filters.length > 0 && filterMenu}
                {extra}
              </Stack>
            )}
          </>
        ) : (
          <>
            {countPlacement !== "end" && !countInside && countText}
            {searchField}
            {(filters.length > 0 || extra) && (
              <Stack
                orientation={Orientation.Row}
                align={Align.Center}
                spacing={Spacing.None}
              >
                {filters.map((f) => (
                  <ChipSelect
                    key={f.id}
                    aria-label={f.label}
                    active={isActive(f)}
                    className="px-2"
                    icon={f.icon}
                    options={f.options}
                    value={f.value}
                    onChange={f.onChange}
                  />
                ))}
                {extra}
              </Stack>
            )}
            {(actions || (countPlacement === "end" && countText)) && (
              <Stack
                orientation={Orientation.Row}
                align={Align.Center}
                spacing={Spacing.Md}
                style={{ marginLeft: "auto" }}
              >
                {countPlacement === "end" && countText}
                {actions}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </div>
  );
}

ListToolbar.displayName = "ListToolbar";
