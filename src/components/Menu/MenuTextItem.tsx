import { MenuItem } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuTextItem}.
 */
export interface MenuTextItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** If `true`, the item cannot be interacted with and is rendered in a muted style. */
  disabled?: boolean;
  /** If `true`, renders the label in the destructive text color (e.g. for "Delete"). */
  destructive?: boolean;
}

/**
 * A simple text-only item within a menu (e.g. {@link Dropdown}).
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Open</DropdownTrigger>}>
 *   <MenuTextItem onClick={() => console.log("clicked")}>
 *     Delete item
 *   </MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param children The label text.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param destructive If `true`, renders the label in the destructive text color.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuTextItem: FC<MenuTextItemProps> = ({
  children,
  disabled,
  destructive,
  className,
  ...props
}) => {
  return (
    <MenuItem disabled={disabled}>
      {({ focus }) => (
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center",
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
          <Text
            variant={TextVariant.Sm}
            color={destructive ? TextColor.Destructive : TextColor.Primary}
            className="block min-w-0 truncate"
          >
            {children}
          </Text>
        </button>
      )}
    </MenuItem>
  );
};

MenuTextItem.displayName = "MenuTextItem";
