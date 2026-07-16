import { MenuItem } from "@headlessui/react";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconColor,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Props for {@link MenuIconTextItem}.
 */
export interface MenuIconTextItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** Icon to display to the left of the text content. */
  icon: ReactNode;
  /** Primary label text. */
  text: string;
  /** Optional secondary description shown below the primary text. */
  subtext?: string;
  /** If `true`, the item cannot be interacted with and is rendered in a muted style. */
  disabled?: boolean;
  /** If `true`, renders text and icon in the destructive color palette. */
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
 *     icon={<ImageSearchIcon size={Size.Lg} />}
 *     text="Sort by similarity"
 *     subtext="Find visually similar"
 *     onClick={() => {}}
 *   />
 * </Dropdown>
 * ```
 *
 * @param icon A ReactNode (typically an icon component) rendered in the leading slot.
 * @param text The primary label for the item.
 * @param subtext An optional secondary line rendered below the primary text in muted color.
 * @param disabled If `true`, the item cannot be interacted with.
 * @param destructive If `true`, renders text colors in the destructive palette.
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
  const textColor = destructive ? TextColor.Destructive : TextColor.Primary;
  const subtextColor = destructive
    ? TextColor.Destructive
    : TextColor.Secondary;
  const iconColor = destructive ? IconColor.Destructive : IconColor.Default;

  return (
    <MenuItem disabled={disabled}>
      {({ focus }) => (
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2.5",
            "px-3 py-1.5",
            radiusStyles(Radius.Sm),
            "cursor-pointer text-left",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            focus && bgColorClass(BackgroundColor.CardElevated),
            bgColorClass(BackgroundColor.CardElevated, ElementState.Hover),
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center",
              textColorClass(iconColor)
            )}
          >
            {icon}
          </span>

          <span className="flex flex-col gap-0.5 min-w-0">
            <Text
              variant={TextVariant.Sm}
              color={textColor}
              className="block truncate"
            >
              {text}
            </Text>
            {subtext && (
              <Text
                variant={TextVariant.Xs}
                color={subtextColor}
                className="block truncate"
              >
                {subtext}
              </Text>
            )}
          </span>
        </button>
      )}
    </MenuItem>
  );
};

MenuIconTextItem.displayName = "MenuIconTextItem";
