import clsx from "clsx";
import React, { useRef, useState } from "react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import styles from "./ResizablePanel.module.css";

const TOGGLE_HEIGHT = 24;
const DRAG_HANDLE_HEIGHT = 4;
const CLOSED_HEIGHT = DRAG_HANDLE_HEIGHT + TOGGLE_HEIGHT;

export interface ResizablePanelProps {
  minHeight: number;
  maxHeight: number;
  mode?: "push" | "float";
  defaultOpen?: boolean;
  label?: string;
  align?: "left" | "right";
  headerContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  minHeight,
  maxHeight,
  mode = "push",
  defaultOpen = true,
  label,
  align = "left",
  headerContent,
  children,
  className,
  style,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(maxHeight);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(maxHeight);
  const savedHeight = useRef(maxHeight);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!open) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = dragStartY.current - e.clientY;
    const newHeight = Math.min(
      maxHeight,
      Math.max(minHeight, dragStartHeight.current + delta)
    );
    setHeight(newHeight);
    savedHeight.current = newHeight;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleToggle = () => {
    if (!open) setHeight(savedHeight.current);
    setOpen((prev) => !prev);
  };

  return (
    <div
      className={clsx(styles.root, styles[mode], className)}
      style={{
        height: open ? height : CLOSED_HEIGHT,
        transition: isDragging ? "none" : "height 0.2s ease",
        ...style,
      }}
    >
      <div
        className={clsx(styles.dragHandle, { [styles.dragHandleDisabled]: !open })}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <div
        className={clsx(styles.toggle, { [styles.toggleRight]: align === "right" })}
        onClick={handleToggle}
        role="button"
        aria-expanded={open}
      >
        <ChevronBottomIcon
          className={clsx(styles.chevron, { [styles.chevronOpen]: open })}
          width={16}
          height={16}
        />
        {label && <span className={styles.label}>{label}</span>}
        {headerContent && (
          <div
            className={styles.headerContent}
            onClick={(e) => e.stopPropagation()}
          >
            {headerContent}
          </div>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ResizablePanel;
