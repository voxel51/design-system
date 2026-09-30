import { MenuItem } from "@headlessui/react";
import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  InteractiveColor,
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
            // Figma Action Menu Row: 6/10 padding, radius 8 on hover, 15/20
            // label, bg/card-nested hover; danger rows fill danger-default
            "px-2.5 py-1.5",
            radiusStyles(Radius.Lg),
            "cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            focus &&
              bgColorClass(
                destructive
                  ? InteractiveColor.DangerDefault
                  : BackgroundColor.CardNested
              ),
            bgColorClass(
              destructive
                ? InteractiveColor.DangerDefault
                : BackgroundColor.CardNested,
              ElementState.Hover
            ),
            destructive && "hover:[&_*]:text-white",
            className
          )}
          {...props}
        >
          <Text
            variant={TextVariant.BodyPrimary}
            color={destructive ? TextColor.Failure : TextColor.Primary}
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
