import { Menu } from "@base-ui/react/menu";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { CheckIcon } from "@/components/Icons";
import { Text } from "@/components/Text";
import { BrandColor, Size, TextColor, TextVariant } from "@/types";
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
  /** A single-select option: the check trails the label and choosing closes the menu. */
  select?: boolean;
  /** A second line under the label, wrapping if it is long. */
  description?: ReactNode;
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
 * @example
 * ```tsx
 * // A single-select picker: the check trails, choosing closes the menu.
 * <Dropdown trigger={<DropdownTrigger fullWidth>{schema.name}</DropdownTrigger>}>
 *   {schemas.map((s) => (
 *     <MenuCheckItem key={s.id} select checked={s.id === id} onClick={() => pick(s.id)}>
 *       {s.name}
 *     </MenuCheckItem>
 *   ))}
 * </Dropdown>
 * ```
 *
 * @param checked If `true`, a checkmark is shown in the leading slot.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param select A single-select option: trailing check, closes the menu on click.
 * @param description A second line under the label, such as what a permission allows.
 * @param children The label text.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuCheckItem: FC<MenuCheckItemProps> = ({
  checked,
  disabled,
  select,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <Menu.CheckboxItem
      checked={!!checked}
      disabled={disabled}
      // Toggling keeps the menu open so several options can be set in a row
      closeOnClick={!!select}
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
      className={(state) =>
        cn(
          menuRowStyles(state),
          "gap-2",
          !!description && "my-0.5 items-start py-2",
          select && "flex-row-reverse justify-between",
          checked &&
            (state.highlighted && !disabled
              ? "bg-brand-primary/15"
              : "bg-brand-primary/10"),
          className
        )
      }
    >
      {/* Reserved slot so text aligns whether checked or not */}
      <span className="flex size-4 shrink-0 items-center justify-center">
        {checked && <CheckIcon size={Size.Sm} color={BrandColor.Primary} />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 text-left">
        <Text
          variant={TextVariant.BodyPrimary}
          color={TextColor.Primary}
          className={cn("block min-w-0 truncate", checked && "font-medium")}
        >
          {children}
        </Text>
        {description && (
          <Text
            variant={TextVariant.BodyTertiary}
            color={TextColor.Tertiary}
            className="block"
          >
            {description}
          </Text>
        )}
      </span>
    </Menu.CheckboxItem>
  );
};

MenuCheckItem.displayName = "MenuCheckItem";
