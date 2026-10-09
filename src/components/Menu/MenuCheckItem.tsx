import { Menu } from "@base-ui/react/menu";
import type { FC, HTMLAttributes } from "react";

import { CheckIcon } from "@/components/Icons";
import { Text } from "@/components/Text";
import { Size, TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { menuRowStyles } from "./styles";

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
 * Clicking it runs `onClick` and keeps the menu open.
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
    <Menu.CheckboxItem
      checked={!!checked}
      disabled={disabled}
      // Toggling keeps the menu open so several options can be set in a row
      closeOnClick={false}
      nativeButton
      // Consumer handlers ride the rendered button, outside Base UI's own
      // disabled gate, so a disabled item drops its click handler here
      render={
        <button
          type="button"
          {...props}
          onClick={disabled ? undefined : props.onClick}
        />
      }
      className={(state) => cn(menuRowStyles(state), "gap-2", className)}
    >
      {/* Reserved slot so text aligns whether checked or not */}
      <span className="flex size-4 shrink-0 items-center justify-center">
        {checked && <CheckIcon size={Size.Sm} color={TextColor.Primary} />}
      </span>
      <Text
        variant={TextVariant.BodyPrimary}
        color={TextColor.Primary}
        className="block min-w-0 truncate"
      >
        {children}
      </Text>
    </Menu.CheckboxItem>
  );
};

MenuCheckItem.displayName = "MenuCheckItem";
