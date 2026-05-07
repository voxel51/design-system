import { MenuItem } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { Icon } from "@/components/Icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconName,
  Radius,
  Size,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuCheckItem}.
 */
export interface MenuCheckItemProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Whether this item is currently checked/selected. */
  checked?: boolean;
  /** If `true`, the item cannot be interacted with and is rendered in a muted style. */
  disabled?: boolean;
}

/**
 * A selectable menu item with a leading checkmark indicator.
 * The checkmark is shown when `checked` is `true`; otherwise the slot is empty
 * but reserved so that text alignment stays consistent across items.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Sort</DropdownTrigger>}>
 *   <MenuCheckItem checked={sort === "asc"} onClick={() => setSort("asc")}>
 *     Ascending
 *   </MenuCheckItem>
 *   <MenuCheckItem checked={sort === "desc"} onClick={() => setSort("desc")}>
 *     Descending
 *   </MenuCheckItem>
 * </Dropdown>
 * ```
 *
 * @param checked If `true`, a checkmark is shown in the leading slot.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param children The label text.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuCheckItem: FC<MenuCheckItemProps> = ({
  checked,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <MenuItem disabled={disabled}>
      {({ focus }) => (
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={checked}
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2",
            "px-3 py-1.5",
            radiusStyles(Radius.Sm),
            "cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            focus && bgColorClass(BackgroundColor.CardElevated),
            bgColorClass(BackgroundColor.CardElevated, ElementState.Hover),
            className
          )}
          {...props}
        >
          {/* Reserved slot so text aligns whether checked or not */}
          <span className="flex size-4 shrink-0 items-center justify-center">
            {checked && (
              <Icon
                name={IconName.Check}
                size={Size.Sm}
                color={TextColor.Primary}
              />
            )}
          </span>
          <Text
            variant={TextVariant.Sm}
            color={TextColor.Primary}
            className="block min-w-0 truncate"
          >
            {children}
          </Text>
        </button>
      )}
    </MenuItem>
  );
};

MenuCheckItem.displayName = "MenuCheckItem";
