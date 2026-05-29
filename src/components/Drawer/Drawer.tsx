import clsx from "clsx";
import React from "react";

import type { UseDisclosureOptions } from "@/util/useDisclosure";
import { useResizableDrawer } from "@/util/useResizableDrawer";

import styles from "./Drawer.module.css";

export type DrawerSide = "left" | "right" | "top" | "bottom";

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

  const contentWrapperSizeStyle = isVertical ? { height: size } : { width: size };

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
        <div className={styles.header}>
          {header({ open, toggle })}
        </div>
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
