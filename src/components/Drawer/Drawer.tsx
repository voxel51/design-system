import clsx from "clsx";
import React, { useCallback, useSyncExternalStore } from "react";

import type { UseDisclosureOptions } from "@/util/useDisclosure";
import { useResizableDrawer } from "@/util/useResizableDrawer";

import styles from "./Drawer.module.css";

export type DrawerSide = `${"left" | "right" | "top" | "bottom"}`;

/** A length in pixels, or a percentage of the viewport along the drawer's axis. */
export type DrawerLength = number | `${number}%`;

export interface DrawerHeaderState {
  open: boolean;
  toggle: () => void;
}

function sideConfig(side: DrawerSide): {
  axis: "horizontal" | "vertical";
  invert: boolean;
} {
  return {
    axis: side === "left" || side === "right" ? "horizontal" : "vertical",
    invert: side === "right" || side === "bottom",
  };
}

function useViewportLength(
  axis: "horizontal" | "vertical",
  length: DrawerLength
): number;
function useViewportLength(
  axis: "horizontal" | "vertical",
  length: DrawerLength | undefined
): number | undefined;
function useViewportLength(
  axis: "horizontal" | "vertical",
  length: DrawerLength | undefined
): number | undefined {
  const relative = typeof length === "string";
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!relative) return () => {};
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    [relative]
  );
  const viewport = useSyncExternalStore(
    subscribe,
    () =>
      relative
        ? axis === "horizontal"
          ? window.innerWidth
          : window.innerHeight
        : 0,
    () => 0
  );
  if (typeof length !== "string") return length;
  return Math.round((viewport * parseFloat(length)) / 100);
}

export interface DrawerProps extends UseDisclosureOptions {
  side?: DrawerSide;
  /**
   * Maximum content-area size in pixels. The header and resize handle are
   * excluded — `maxSize` caps only the scrollable body region.
   */
  maxSize: DrawerLength;
  mode?: "push" | "float";
  /** Shade the container behind an open floating drawer; a click on it closes the drawer. */
  scrim?: boolean;
  /** Offer the drag handle. Defaults to `true`. */
  resizable?: boolean;
  header?: (state: DrawerHeaderState) => React.ReactNode;
  onSizeChange?: (size: number) => void;
  /** Controlled content-area size, up to `maxSize`. */
  size?: DrawerLength;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A resizable panel docked to one edge of its container.
 *
 * Drag the handle to resize it. The `header` render prop receives the open
 * state and a toggle, so the header can open and close the drawer. Open state
 * is uncontrolled by default; pass `open` and `onOpenChange` to control it.
 *
 * @example
 * ```tsx
 * <Drawer
 *   side="bottom"
 *   maxSize={400}
 *   header={({ open, toggle }) => (
 *     <Button variant="secondary" size="sm" onClick={toggle}>
 *       {open ? "Hide logs" : "Show logs"}
 *     </Button>
 *   )}
 * >
 *   <LogList />
 * </Drawer>
 *
 * <Drawer side="bottom" mode="float" scrim resizable={false} size="62%" maxSize="90%" open={open} onOpenChange={setOpen}>
 *   <Inspector />
 * </Drawer>
 * ```
 *
 * @param side The edge the drawer docks to. Defaults to `"bottom"`.
 * @param maxSize Maximum size of the content area, in pixels or as a
 *  percentage of the viewport (`"62%"`). The header and resize handle are not
 *  counted.
 * @param mode `"push"` keeps the drawer in the layout flow, so it pushes
 *  neighbouring content aside; `"float"` positions it over the content along
 *  its edge. Content stays mounted while closed in both modes. Defaults to
 *  `"push"`.
 * @param resizable Whether the drag handle shows. Defaults to `true`.
 * @param scrim With `mode="float"`, shades the container behind the open
 *  drawer; clicking the shade closes the drawer. Defaults to `false`.
 * @param header Renders the header. Receives `{ open, toggle }`.
 * @param defaultOpen Initial open state when uncontrolled. Defaults to `true`.
 * @param open Controlled open state.
 * @param onOpenChange Called when the open state changes.
 * @param onSizeChange Called with the new content size in pixels.
 * @param size Controlled content size, in pixels or as a percentage of the
 *  viewport; the content then fills that size. Drags report the new size
 *  through `onSizeChange` instead of resizing the drawer themselves; dragging
 *  it shut closes it through `onOpenChange` and reports no size.
 * @param children The drawer content.
 * @param className Additional CSS class names to apply to the drawer.
 * @param style Inline styles to apply to the drawer.
 */
const Drawer: React.FC<DrawerProps> = ({
  side = "bottom",
  maxSize,
  mode = "push",
  scrim = false,
  resizable = true,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  onSizeChange,
  size: controlledSize,
  header,
  children,
  className,
  style,
}) => {
  const { axis, invert } = sideConfig(side);
  const isVertical = axis === "vertical";
  const maxSizePx = useViewportLength(axis, maxSize);
  const sizePx = useViewportLength(axis, controlledSize);

  const {
    open,
    toggle,
    setOpen,
    size,
    isDragging,
    animating,
    onTransitionEnd,
    dragHandleProps,
    contentRef,
  } = useResizableDrawer({
    axis,
    invert,
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
    maxSize: maxSizePx,
    onSizeChange,
    size: sizePx,
  });

  const contentWrapperSizeStyle = isVertical
    ? { height: size }
    : { width: size };

  return (
    <>
      {scrim && mode === "float" && open && (
        <div
          className={styles.scrim}
          style={{ zIndex: style?.zIndex }}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <div
        className={clsx(
          styles.root,
          styles[mode],
          styles[side],
          { [styles.sized]: sizePx != null },
          className
        )}
        style={style}
      >
        {resizable && (
          <div
            className={clsx(styles.handle, { [styles.handleDisabled]: !open })}
            {...dragHandleProps}
          />
        )}
        {header && (
          <div className={styles.header}>{header({ open, toggle })}</div>
        )}
        <div
          className={styles.contentWrapper}
          onTransitionEnd={(event) => {
            // a child's own transition, such as a hover color, bubbles here too
            if (event.target === event.currentTarget) onTransitionEnd();
          }}
          style={{
            ...contentWrapperSizeStyle,
            // Animate the open/close toggle only. Drags track the pointer 1:1 and
            // content-driven resizes snap, both via `animating === false`.
            transition: animating && !isDragging ? undefined : "none",
          }}
        >
          <div ref={contentRef} className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
