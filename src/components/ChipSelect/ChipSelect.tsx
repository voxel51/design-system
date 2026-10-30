import type { JSX } from "react";

import type { ButtonProps } from "@/components/Button";
import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { MenuCheckItem } from "@/components/Menu";
import { Size } from "@/types";

export interface ChipSelectOption<T extends string = string> {
  id: T;
  label: string;
}

export interface ChipSelectProps<T extends string = string> {
  /** The choices, one checked at a time. */
  options: ChipSelectOption<T>[];
  /** The `id` of the checked option. */
  value: T;
  /** Called with the `id` of the option picked. */
  onChange: (value: T) => void;
  /** Names the control; also the accessible name of the trigger. */
  "aria-label": string;
  /** Leading icon of the trigger. */
  icon?: ButtonProps["leadingIcon"];
  /** What the value is (`Sort by`), shown before it; on a phone only in the tooltip. */
  prefix?: string;
  /** The trigger text, when it should differ from the checked option's label (a count, say). */
  label?: string;
  "data-cy"?: string;
}

/**
 * A borderless single-choice menu for filter and sort rows: an icon, an optional
 * `prefix: value` and a caret, opening a checklist of options.
 *
 * @example
 * ```tsx
 * <ChipSelect
 *   aria-label="Sort by"
 *   prefix="Sort by"
 *   icon={ArrowDownWideNarrowIcon}
 *   value={sort}
 *   onChange={setSort}
 *   options={[
 *     { id: "newest", label: "Newest" },
 *     { id: "oldest", label: "Oldest" },
 *   ]}
 * />
 * ```
 *
 * @param options The choices, one checked at a time. See {@link ChipSelectOption}.
 * @param value The `id` of the checked option.
 * @param onChange Called with the `id` of the option picked.
 * @param icon Leading icon of the trigger.
 * @param prefix What the value is, shown before it. Below 640px only the value shows and a tooltip names both.
 * @param label The trigger text, when it should differ from the checked option's label. Defaults to that label.
 */
export function ChipSelect<T extends string = string>({
  options,
  value,
  onChange,
  icon,
  prefix,
  label,
  "aria-label": ariaLabel,
  "data-cy": dataCy,
}: ChipSelectProps<T>): JSX.Element {
  return (
    <Dropdown
      anchor="bottom start"
      trigger={
        <DropdownTrigger
          borderless
          size={Size.Md}
          leadingIcon={icon}
          prefix={prefix}
          aria-label={ariaLabel}
          data-cy={dataCy}
        >
          {label ?? options.find((o) => o.id === value)?.label}
        </DropdownTrigger>
      }
    >
      {options.map((o) => (
        <MenuCheckItem
          key={o.id}
          checked={o.id === value}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </MenuCheckItem>
      ))}
    </Dropdown>
  );
}
