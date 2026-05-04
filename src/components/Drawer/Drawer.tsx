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
const DEFAULT_HEADER_SIZE = 24;

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
  header?: (state: DrawerHeaderState) => React.ReactNode;
  /**
   * Height of the header element in px — used to compute the closed size.
   * Default: 24.
   */
  headerSize?: number;
  pinnedContent?: React.ReactNode;
  overlay?: React.ReactNode;
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
  headerSize = DEFAULT_HEADER_SIZE,
  pinnedContent,
  overlay,
  bodyRef,
  children,
  className,
  style,
}) => {
  const { axis, invert } = sideConfig(side);
  const isVertical = axis === "vertical";

  const { ref: pinnedRef, height: pinnedHeight } = useElementSize();
  const closedPadding = HANDLE_SIZE + (header ? headerSize : 0);
  const closedSize = pinnedHeight + closedPadding;

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
      {header?.({ open, toggle })}
      <div ref={bodyRef} className={styles.body}>
        {pinnedContent !== undefined && (
          <div ref={pinnedRef} className={styles.pinnedContent}>
            {pinnedContent}
          </div>
        )}
        <div className={styles.content}>{children}</div>
        {overlay && (
          <div className={styles.overlay} aria-hidden>
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
