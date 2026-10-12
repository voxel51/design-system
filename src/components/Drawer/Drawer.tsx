import clsx from "clsx";
import React from "react";

import type { UseDisclosureOptions } from "@/util/useDisclosure";
import { useResizableDrawer } from "@/util/useResizableDrawer";

import styles from "./Drawer.module.css";

export type DrawerSide = `${"left" | "right" | "top" | "bottom"}`;

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

export interface DrawerProps extends UseDisclosureOptions {
  side?: DrawerSide;
  /**
   * Maximum content-area size in pixels. The header and resize handle are
   * excluded — `maxSize` caps only the scrollable body region.
   */
  maxSize: number;
  mode?: "push" | "float";
  header?: (state: DrawerHeaderState) => React.ReactNode;
  onSizeChange?: (size: number) => void;
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
 * ```
 *
 * @param side The edge the drawer docks to. Defaults to `"bottom"`.
 * @param maxSize Maximum size of the content area in pixels. The header and
 *  resize handle are not counted.
 * @param mode `"push"` keeps the drawer in the layout flow, so it pushes
 *  neighbouring content aside; `"float"` positions it over the content.
 *  Defaults to `"push"`.
 * @param header Renders the header. Receives `{ open, toggle }`.
 * @param defaultOpen Initial open state when uncontrolled. Defaults to `true`.
 * @param open Controlled open state.
 * @param onOpenChange Called when the open state changes.
 * @param onSizeChange Called with the new content size in pixels.
 * @param children The drawer content.
 * @param className Additional CSS class names to apply to the drawer.
 * @param style Inline styles to apply to the drawer.
 */
const Drawer: React.FC<DrawerProps> = ({
  side = "bottom",
  maxSize,
  mode = "push",
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  onSizeChange,
  header,
  children,
  className,
  style,
}) => {
  const { axis, invert } = sideConfig(side);
  const isVertical = axis === "vertical";

  const {
    open,
    toggle,
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
    maxSize,
    onSizeChange,
  });

  const contentWrapperSizeStyle = isVertical
    ? { height: size }
    : { width: size };

  return (
    <div
      className={clsx(styles.root, styles[mode], styles[side], className)}
      style={style}
    >
      <div
        className={clsx(styles.handle, { [styles.handleDisabled]: !open })}
        {...dragHandleProps}
      />
      {header && (
        <div className={styles.header}>{header({ open, toggle })}</div>
      )}
      <div
        className={styles.contentWrapper}
        onTransitionEnd={onTransitionEnd}
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
  );
};

export default Drawer;
