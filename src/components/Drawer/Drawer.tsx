import clsx from "clsx";
import React from "react";

import type { UseDisclosureOptions } from "@/util/useDisclosure";
import { useElementSize } from "@/util/useElementSize";
import { useResizableDrawer } from "@/util/useResizableDrawer";

import styles from "./Drawer.module.css";

/**
 * Edge of the viewport the drawer is anchored to. Determines both the
 * drag axis (`left`/`right` resize horizontally; `top`/`bottom` resize
 * vertically) and the direction the drawer expands when opened.
 */
export type DrawerSide = "left" | "right" | "top" | "bottom";

/**
 * State passed to the {@link DrawerProps.header} render prop so callers
 * can react to and control the drawer's open/closed state from within
 * their header content (e.g. a toggle button).
 */
export interface DrawerHeaderState {
  /** Whether the drawer is currently expanded. */
  open: boolean;
  /** Flip the drawer between open and closed. */
  toggle: () => void;
}

const HANDLE_SIZE = 4;

function sideConfig(side: DrawerSide): {
  axis: "horizontal" | "vertical";
  invert: boolean;
} {
  return {
    axis: side === "left" || side === "right" ? "horizontal" : "vertical",
    invert: side === "right" || side === "bottom",
  };
}

/**
 * Props for the {@link Drawer} component. Extends `UseDisclosureOptions`
 * so callers can drive the open state in either controlled
 * (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`) mode.
 */
export interface DrawerProps extends UseDisclosureOptions {
  /** Edge the drawer is anchored to. Defaults to `"bottom"`. */
  side?: DrawerSide;
  /** Size (in px) the drawer opens to when first rendered or re-opened. */
  defaultSize: number;
  /** Minimum size (in px) the user can drag the drawer down to while open. */
  minSize: number;
  /** Maximum size (in px) the user can drag the drawer up to. */
  maxSize: number;
  /**
   * How the drawer relates to surrounding layout.
   * - `"push"` (default): the drawer occupies space and pushes siblings.
   * - `"float"`: the drawer overlays content without affecting layout.
   */
  mode?: "push" | "float";
  /**
   * Render prop for the always-visible header area. Receives open state and
   * toggle. Everything the caller renders here stays visible when collapsed —
   * toggle button, ruler, pinned rows, etc. Its height is measured and used
   * as the drawer's closed size automatically.
   */
  header?: (state: DrawerHeaderState) => React.ReactNode;
  /** Called whenever the user finishes resizing the drawer. */
  onSizeChange?: (size: number) => void;
  /** Ref forwarded to the scrollable body element wrapping `children`. */
  bodyRef?: React.RefObject<HTMLDivElement | null>;
  /** Drawer body content, rendered inside the scrollable area. */
  children?: React.ReactNode;
  /** Additional class name applied to the drawer root. */
  className?: string;
  /** Inline styles merged into the drawer root (after the sizing style). */
  style?: React.CSSProperties;
}

/**
 * Resizable, collapsible drawer anchored to one edge of its container.
 *
 * The drawer is draggable along its perpendicular axis between `minSize`
 * and `maxSize`, and collapses to the measured height of its `header`
 * render prop (plus the drag handle) when closed. Open state can be
 * controlled or uncontrolled via the inherited disclosure props.
 */
const Drawer: React.FC<DrawerProps> = ({
  side = "bottom",
  defaultSize,
  minSize,
  maxSize,
  mode = "push",
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  onSizeChange,
  header,
  bodyRef,
  children,
  className,
  style,
}) => {
  const { axis, invert } = sideConfig(side);
  const isVertical = axis === "vertical";

  const { ref: headerRef, height: headerHeight } = useElementSize();
  const closedSize = headerHeight + HANDLE_SIZE;

  const { open, toggle, size, isDragging, dragHandleProps } =
    useResizableDrawer({
      axis,
      invert,
      defaultOpen,
      open: controlledOpen,
      onOpenChange,
      defaultSize,
      minSize,
      maxSize,
      closeThreshold: closedSize,
      onSizeChange,
    });

  const dimensionStyle = isVertical
    ? { height: open ? size : closedSize }
    : { width: open ? size : closedSize };

  return (
    <div
      className={clsx(
        styles.root,
        styles[mode],
        styles[side],
        { [styles.dragging]: isDragging },
        className
      )}
      style={{
        ...dimensionStyle,
        transition: isDragging ? "none" : undefined,
        ...style,
      }}
    >
      <div
        className={clsx(styles.handle, { [styles.handleDisabled]: !open })}
        {...dragHandleProps}
      />
      {header && (
        <div ref={headerRef} className={styles.header}>
          {header({ open, toggle })}
        </div>
      )}
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
