import clsx from "clsx";
import React from "react";

import type { UseDisclosureOptions } from "@/util/useDisclosure";
import { useElementSize } from "@/util/useElementSize";
import { useResizableDrawer } from "@/util/useResizableDrawer";

import styles from "./Drawer.module.css";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerHeaderState {
  open: boolean;
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

export interface DrawerProps extends UseDisclosureOptions {
  side?: DrawerSide;
  defaultSize: number;
  minSize: number;
  maxSize: number;
  mode?: "push" | "float";
  /**
   * Render prop for the always-visible header area. Receives open state and
   * toggle. Everything the caller renders here stays visible when collapsed —
   * toggle button, ruler, pinned rows, etc. Its height is measured and used
   * as the drawer's closed size automatically.
   */
  header?: (state: DrawerHeaderState) => React.ReactNode;
  onSizeChange?: (size: number) => void;
  bodyRef?: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

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
