import { Menu } from "@base-ui/react/menu";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/Icons";
import { Text } from "@/components/Text";
import {
  IconColor,
  IconName,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

import { menuRowStyles } from "./styles";

const iconNames = new Set<string>(Object.values(IconName));

/**
 * Props for {@link MenuIconTextItem}.
 */
export interface MenuIconTextItemProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * Icon to display to the left of the text content. A legacy
   * {@link IconName} string renders through the deprecated map-based
   * {@link Icon}, so 0.x call sites keep their glyphs.
   */
  icon: IconName | Exclude<ReactNode, string>;
  /** Primary label text. */
  text: string;
  /** Optional secondary description shown below the primary text. */
  subtext?: string;
  /** If `true`, the item cannot be interacted with and is rendered in a muted style. */
  disabled?: boolean;
  /** If `true`, renders the text and icon in the failure color, and fills the row with the danger color (white content) on hover and focus. */
  destructive?: boolean;
}

/**
 * A menu item displaying an icon alongside primary text and an optional subtext description.
 * Matches the layout shown for action menus such as "Sort by similarity / Find visually similar".
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Open</DropdownTrigger>}>
 *   <MenuIconTextItem
 *     icon={<ImageSearchIcon size="lg" />}
 *     text="Sort by similarity"
 *     subtext="Find visually similar"
 *     onClick={() => {}}
 *   />
 * </Dropdown>
 * ```
 *
 * @param icon An icon element (e.g. `<EditIcon />`) rendered in the leading slot; a legacy {@link IconName} is still accepted.
 * @param text The primary label for the item.
 * @param subtext An optional secondary line rendered below the primary text in muted color.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param destructive If `true`, renders the text and icon in the failure color, and fills the row with the danger color (white content) on hover and focus.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const MenuIconTextItem: FC<MenuIconTextItemProps> = ({
  icon,
  text,
  subtext,
  disabled,
  destructive,
  className,
  ...props
}) => {
  const textColor = destructive ? TextColor.Failure : TextColor.Primary;
  const subtextColor = destructive ? TextColor.Failure : TextColor.Secondary;
  const iconColor = destructive ? IconColor.Failure : IconColor.Default;
  // Legacy IconName strings ride the deprecated map-based Icon; anything
  // else (elements, arbitrary nodes) renders as-is.
  const iconContent =
    typeof icon === "string" && iconNames.has(icon) ? (
      <Icon name={icon as IconName} />
    ) : (
      icon
    );

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
      className={(state) =>
        // Figma Action Menu Row: 8px gap, 16px icon
        cn(menuRowStyles(state, destructive), "gap-2", className)
      }
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center",
          textColorClass(iconColor)
        )}
      >
        {iconContent}
      </span>

      <span className="flex flex-col gap-0.5 min-w-0">
        <Text
          variant={TextVariant.BodyPrimary}
          color={textColor}
          className="block truncate"
        >
          {text}
        </Text>
        {subtext && (
          <Text
            variant={TextVariant.BodyTertiary}
            color={subtextColor}
            className="block truncate"
          >
            {subtext}
          </Text>
        )}
      </span>
    </Menu.Item>
  );
};

MenuIconTextItem.displayName = "MenuIconTextItem";
