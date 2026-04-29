import clsx from "clsx";
import React, { useRef, useState } from "react";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  side: "left" | "right";
  open?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  side,
  open = true,
  defaultWidth = 240,
  minWidth = 140,
  maxWidth = 480,
  header,
  children,
  className,
}) => {
  const [currentWidth, setCurrentWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(defaultWidth);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!open) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = currentWidth;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragStartX.current;
    const newWidth =
      side === "left"
        ? Math.min(maxWidth, Math.max(minWidth, dragStartWidth.current + delta))
        : Math.min(maxWidth, Math.max(minWidth, dragStartWidth.current - delta));
    setCurrentWidth(newWidth);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className={clsx(styles.root, { [styles.rootDragging]: isDragging }, className)}
      style={{ width: open ? currentWidth : 0 }}
    >
      <div className={styles.inner} style={{ width: currentWidth }}>
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.content}>{children}</div>
      </div>

      {/* Drag handle — on right edge for left sidebar, left edge for right sidebar */}
      <div
        className={clsx(
          styles.handle,
          side === "left" ? styles.handleRight : styles.handleLeft
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
};

export default Sidebar;
