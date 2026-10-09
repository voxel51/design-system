import { Menu } from "@base-ui/react/menu";
import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { menuRowStyles } from "./styles";

/**
 * Props for {@link MenuTextItem}.
 */
export interface MenuTextItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** If `true`, the item cannot be interacted with and is rendered in a muted style. */
  disabled?: boolean;
  /** If `true`, renders the label in the failure color, and fills the row with the danger color (white text) on hover and focus. */
  destructive?: boolean;
}

/**
 * A simple text-only item within a menu (e.g. {@link Dropdown}).
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Open</DropdownTrigger>}>
 *   <MenuTextItem destructive onClick={() => console.log("clicked")}>
 *     Delete item
 *   </MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param children The label text.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param destructive If `true`, renders the label in the failure color, and fills the row with the danger color (white text) on hover and focus.
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
    <Menu.Item
      disabled={disabled}
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
      className={(state) => cn(menuRowStyles(state, destructive), className)}
    >
      <Text
        variant={TextVariant.BodyPrimary}
        color={destructive ? TextColor.Failure : TextColor.Primary}
        className="block min-w-0 truncate"
      >
        {children}
      </Text>
    </Menu.Item>
  );
};

MenuTextItem.displayName = "MenuTextItem";
