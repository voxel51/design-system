import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { FC, HTMLAttributes, MouseEvent, ReactNode } from "react";

import { menuPanelStyles } from "@/components/Menu";
import { ZIndex, zIndexStyles } from "@/types";

/**
 * Menu placements used when the cursor is far from any viewport edge
 * vs. flipped placements when the menu would overflow.
 */
type MenuAnchor = "bottom start" | "bottom end" | "top start" | "top end";

/**
 * Conservative estimate of the menu panel size (px). Used at right-click
 * time to decide whether to flip the anchor away from the viewport edge.
 * The actual menu is capped at 320px wide by `menuPanelStyles`; the height bound is a
 * generous worst-case for typical menus (8–10 items + sections).
 */
const ESTIMATED_MENU_SIZE = { width: 320, height: 320 };

/**
 * Pick the menu anchor based on whether the menu would overflow the
 * viewport when opened in the default `bottom start` direction.
 *
 * @deprecated {@link ContextMenu} no longer uses this: Base UI flips the
 * menu away from viewport edges itself. Kept only so the export does not
 * break; it will be removed in the next major version.
 * @internal
 */
export const pickAnchor = (
  cursor: { x: number; y: number },
  viewport: { width: number; height: number },
  menu: { width: number; height: number } = ESTIMATED_MENU_SIZE
): MenuAnchor => {
  const edge = cursor.y + menu.height > viewport.height ? "top" : "bottom";
  const alignment = cursor.x + menu.width > viewport.width ? "end" : "start";
  return `${edge} ${alignment}` as MenuAnchor;
};

/**
 * Props for {@link ContextMenu}.
 */
export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** The right-clickable area. Right-click anywhere inside opens the menu. */
  children: ReactNode;
  /** Menu content. Use the Menu* primitive components. */
  menu: ReactNode;
  /** If `true`, right-click is ignored and the menu does not open. */
  disabled?: boolean;
}

/**
 * A right-click triggered menu. Opens at the cursor position, dismisses on
 * click outside, item selection, or Escape.
 *
 * Composes with the Menu primitives ({@link MenuTextItem},
 * {@link MenuIconTextItem}, {@link MenuCheckItem}, {@link MenuSubmenuItem},
 * {@link MenuSectionTitle}, {@link MenuSeparator}). Built on Base UI's
 * `ContextMenu`, so keyboard navigation, long-press on touch, and ARIA
 * `role="menu"` semantics work out of the box. An `onContextMenu` handler
 * that calls `preventDefault()` keeps the menu closed.
 *
 * @example
 * ```tsx
 * <ContextMenu
 *   menu={
 *     <>
 *       <MenuTextItem onClick={handleEdit}>Edit</MenuTextItem>
 *       <MenuTextItem onClick={handleDuplicate}>Duplicate</MenuTextItem>
 *       <MenuSeparator />
 *       <MenuTextItem destructive onClick={handleDelete}>
 *         Delete
 *       </MenuTextItem>
 *     </>
 *   }
 * >
 *   <div className="size-full">Right-click me</div>
 * </ContextMenu>
 * ```
 *
 * @param children The right-clickable area.
 * @param menu Menu content — use the Menu* primitive components.
 * @param disabled If `true`, right-click is ignored.
 * @param className `class` overrides for the wrapper element.
 * @param props Additional HTML properties for the wrapper element.
 */
export const ContextMenu: FC<ContextMenuProps> = ({
  children,
  menu,
  disabled,
  className,
  onContextMenu,
  ...props
}) => {
  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement> & { preventBaseUIHandler: () => void }
  ): void => {
    onContextMenu?.(event);
    // A consumer that handled the right-click itself keeps the menu closed
    if (event.defaultPrevented) event.preventBaseUIHandler();
  };

  return (
    <BaseContextMenu.Root disabled={disabled}>
      <BaseContextMenu.Trigger
        onContextMenu={handleContextMenu}
        className={className}
        {...props}
      >
        {children}
      </BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner className={zIndexStyles(ZIndex.AboveModal)}>
          <BaseContextMenu.Popup className={menuPanelStyles()}>
            {menu}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
};

ContextMenu.displayName = "ContextMenu";
