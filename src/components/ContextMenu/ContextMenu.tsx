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

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    onContextMenu?.(e);
    if (e.defaultPrevented || disabled) return;
    e.preventDefault();
    closeRef.current?.();
    flushSync(() => {
      setPosition({ x: e.clientX, y: e.clientY });
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
                anchor={{ to: "bottom start", gap: 0 }}
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
