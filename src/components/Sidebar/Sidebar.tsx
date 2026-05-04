import clsx from "clsx";
import React from "react";
import { useResizableDrawer } from "@/util/useResizableDrawer";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  side: "left" | "right";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  side,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  defaultWidth = 240,
  minWidth = 140,
  maxWidth = 480,
  onWidthChange,
  header,
  children,
  className,
}) => {
  const { open, size: width, isDragging, dragHandleProps } = useResizableDrawer({
    axis: "horizontal",
    invert: side === "right",
    defaultOpen,
    open: controlledOpen,
    onOpenChange,
    defaultSize: defaultWidth,
    minSize: minWidth,
    maxSize: maxWidth,
    closeThreshold: 0,
    onSizeChange: onWidthChange,
  });

  return (
    <div
      className={clsx(styles.root, { [styles.rootDragging]: isDragging }, className)}
      style={{ width: open ? width : 0 }}
    >
      <div className={styles.inner} style={{ width }}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.content}>{children}</div>
      </div>
      <div
        className={clsx(
          styles.handle,
          side === "left" ? styles.handleRight : styles.handleLeft
        )}
        {...dragHandleProps}
      />
    </div>
  );
};

export default Sidebar;
