import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import {
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { menuPanelStyles } from "@/components/Menu";
import { ZIndex, zIndexStyles } from "@/types";
import { cn } from "@/util/classes";

/**
 * Anchor placements used when the cursor is far from any viewport edge
 * vs. flipped placements when the menu would overflow.
 */
type MenuAnchor =
  | "bottom start"
  | "bottom end"
  | "top start"
  | "top end";

/**
 * Conservative estimate of the menu panel size (px). Used at right-click
 * time to decide whether to flip the anchor away from the viewport edge.
 * The actual menu is capped at `max-w-xs` (320px); the height bound is a
 * generous worst-case for typical menus (8–10 items + sections).
 */
const ESTIMATED_MENU_SIZE = { width: 320, height: 320 };

/**
 * Pick the menu anchor based on whether the menu would overflow the
 * viewport when opened in the default `bottom start` direction.
 *
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
 * {@link MenuIconTextItem}, {@link MenuCheckItem}, {@link MenuSectionTitle},
 * {@link MenuSeparator}). Built on HeadlessUI's `Menu`, so keyboard
 * navigation and ARIA `role="menu"` semantics work out of the box.
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<(() => void) | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [anchor, setAnchor] = useState<MenuAnchor>("bottom start");

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>): void => {
    onContextMenu?.(e);
    if (e.defaultPrevented || disabled) return;
    e.preventDefault();
    closeRef.current?.();
    const nextAnchor = pickAnchor(
      { x: e.clientX, y: e.clientY },
      { width: window.innerWidth, height: window.innerHeight }
    );
    flushSync(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      setAnchor(nextAnchor);
    });
    buttonRef.current?.click();
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className={className}
        {...props}
      >
        {children}
      </div>
      <Menu>
        {({ close }) => {
          closeRef.current = close;
          return (
            <>
              <MenuButton
                ref={buttonRef}
                as="div"
                aria-hidden
                tabIndex={-1}
                style={{
                  position: "fixed",
                  left: position.x,
                  top: position.y,
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <MenuItems
                anchor={{ to: anchor, gap: 0 }}
                portal
                className={cn(menuPanelStyles(), zIndexStyles(ZIndex.AboveModal))}
              >
                {menu}
              </MenuItems>
            </>
          );
        }}
      </Menu>
    </>
  );
};

ContextMenu.displayName = "ContextMenu";
