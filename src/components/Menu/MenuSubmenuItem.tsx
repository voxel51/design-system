import { Menu } from "@base-ui/react/menu";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { ChevronRightIcon, Icon } from "@/components/Icons";
import { Text } from "@/components/Text";
import {
  BackgroundColor,
  bgColorClass,
  IconColor,
  IconName,
  TextColor,
  textColorClass,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

import { actionMenuPanelStyles, menuRowStyles } from "./styles";

const iconNames = new Set<string>(Object.values(IconName));

/** Gap between the row's edge and the flyout panel, in px. */
const PANEL_GAP_PX = 4;
/**
 * Lines the flyout's first item up with the row: the panel's own top
 * padding plus its border.
 */
const PANEL_ALIGN_OFFSET_PX = -7;

/**
 * Props for {@link MenuSubmenuItem}.
 */
export interface MenuSubmenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display to the left of the text content. A legacy
   * {@link IconName} string renders through the deprecated map-based
   * {@link Icon}.
   */
  icon: IconName | Exclude<ReactNode, string>;
  /** Primary label text. */
  text: string;
  /** Optional secondary description shown below the primary text. */
  subtext?: string;
  /** If `true`, the submenu cannot be opened and the row is rendered in a muted style. */
  disabled?: boolean;
  /** Items of the nested menu. Use the Menu* primitive components. */
  children: ReactNode;
}

/**
 * A menu row that opens a flyout of items beside it instead of running an
 * action. Use it inside a {@link Dropdown} or {@link ContextMenu}.
 *
 * Built on Base UI's nested menu: it opens on hover, click, Enter or
 * ArrowRight, closes on ArrowLeft or Escape, flips to the other side when it
 * would leave the viewport, and selecting an item in the flyout closes the
 * whole menu.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Layout</DropdownTrigger>}>
 *   <MenuIconTextItem icon={<ImageSearchIcon />} text="Image" />
 *   <MenuSubmenuItem icon={<PuzzleIcon />} text="Plugins">
 *     <MenuTextItem onClick={() => {}}>Histograms</MenuTextItem>
 *     <MenuTextItem onClick={() => {}}>Embeddings</MenuTextItem>
 *   </MenuSubmenuItem>
 * </Dropdown>
 * ```
 *
 * @param icon An icon element (e.g. `<PuzzleIcon />`) rendered in the leading slot; a legacy {@link IconName} is still accepted.
 * @param text The primary label for the row.
 * @param subtext An optional secondary line rendered below the primary text in muted color.
 * @param disabled If `true`, the submenu cannot be opened.
 * @param children The flyout's items — use the Menu* primitive components.
 * @param className `class` overrides to apply to the row.
 * @param props Additional HTML properties to apply to the row.
 */
export const MenuSubmenuItem: FC<MenuSubmenuItemProps> = ({
  icon,
  text,
  subtext,
  disabled,
  children,
  className,
  ...props
}) => {
  // Legacy IconName strings ride the deprecated map-based Icon; anything
  // else (elements, arbitrary nodes) renders as-is.
  const iconContent =
    typeof icon === "string" && iconNames.has(icon) ? (
      <Icon name={icon as IconName} />
    ) : (
      icon
    );

  return (
    <Menu.SubmenuRoot disabled={disabled}>
      <Menu.SubmenuTrigger
        disabled={disabled}
        className={(state) =>
          cn(
            // Same row metrics as MenuIconTextItem: 8px gap, 16px icon
            menuRowStyles(state),
            "gap-2",
            // Keep the row filled while its flyout is open, even once the
            // pointer has moved on into the flyout
            state.open &&
              !state.disabled &&
              bgColorClass(BackgroundColor.CardNested),
            className
          )
        }
        {...props}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center",
            textColorClass(IconColor.Default)
          )}
        >
          {iconContent}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Text
            variant={TextVariant.BodyPrimary}
            color={TextColor.Primary}
            className="block truncate"
          >
            {text}
          </Text>
          {subtext && (
            <Text
              variant={TextVariant.BodyTertiary}
              color={TextColor.Secondary}
              className="block truncate"
            >
              {subtext}
            </Text>
          )}
        </span>

        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center",
            textColorClass(IconColor.Default)
          )}
        >
          <ChevronRightIcon />
        </span>
      </Menu.SubmenuTrigger>

      <Menu.Portal>
        <Menu.Positioner
          sideOffset={PANEL_GAP_PX}
          alignOffset={PANEL_ALIGN_OFFSET_PX}
          className={zIndexStyles(ZIndex.AboveModal)}
        >
          <Menu.Popup className={actionMenuPanelStyles()}>
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.SubmenuRoot>
  );
};

MenuSubmenuItem.displayName = "MenuSubmenuItem";
