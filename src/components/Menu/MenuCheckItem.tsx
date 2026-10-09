import { MenuItem } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { CheckIcon } from "@/components/Icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BrandColor,
  ElementState,
  Radius,
  Size,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuCheckItem}.
 */
export interface MenuCheckItemProps extends HTMLAttributes<HTMLButtonElement> {
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
            "px-2.5 py-1.5",
            radiusStyles(Radius.Lg),
            "cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // A disabled button still matches :hover; keep its hover fill off
            "disabled:hover:bg-transparent",
            focus && bgColorClass(BackgroundColor.CardNested),
            bgColorClass(BackgroundColor.CardNested, ElementState.Hover),
            checked && "bg-brand-primary/10 hover:bg-brand-primary/15",
            className
          )}
          {...props}
        >
          {/* Reserved slot so text aligns whether checked or not */}
          <span className="flex size-4 shrink-0 items-center justify-center">
            {checked && (
              <CheckIcon size={Size.Sm} color={BrandColor.Primary} />
            )}
          </span>
          <Text
            variant={TextVariant.BodyPrimary}
            color={TextColor.Primary}
            className={cn("block min-w-0 truncate", checked && "font-medium")}
          >
            {children}
          </Text>
        </button>
      )}
    </MenuItem>
  );
};

MenuCheckItem.displayName = "MenuCheckItem";
