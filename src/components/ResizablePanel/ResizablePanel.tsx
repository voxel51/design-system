import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import styles from "./ResizablePanel.module.css";

const TOGGLE_HEIGHT = 24;
const DRAG_HANDLE_HEIGHT = 4;

export interface ResizablePanelProps {
  minHeight: number;
  maxHeight: number;
  mode?: "push" | "float";
  defaultOpen?: boolean;
  label?: string | ((open: boolean) => React.ReactNode);
  align?: "left" | "right";
  /** Ref forwarded to the trackArea div — use as zoomRef for wheel-to-zoom spanning the full panel. */
  trackAreaRef?: React.RefObject<HTMLDivElement | null>;
  headerContent?: React.ReactNode;
  /** Always-visible content shown below the toggle header, even when collapsed. */
  pinnedContent?: React.ReactNode;
  /** Absolutely-positioned layer over the full track area (pinnedContent + content). */
  overlay?: React.ReactNode;
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
  trackAreaRef,
  headerContent,
  pinnedContent,
  overlay,
  children,
  className,
  style,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const resolvedLabel = typeof label === "function" ? label(open) : label;
  const [height, setHeight] = useState(maxHeight);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(maxHeight);
  const savedHeight = useRef(maxHeight);

  const pinnedRef = useRef<HTMLDivElement>(null);
  const [pinnedHeight, setPinnedHeight] = useState(0);
  useEffect(() => {
    const el = pinnedRef.current;
    if (!el) return;
    const measure = () => setPinnedHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const closedHeight = DRAG_HANDLE_HEIGHT + TOGGLE_HEIGHT + pinnedHeight;
  const effectiveMinHeight = Math.max(minHeight, closedHeight);

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
      Math.max(effectiveMinHeight, dragStartHeight.current + delta)
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
        height: open ? height : closedHeight,
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
        {resolvedLabel && <span className={styles.label}>{resolvedLabel}</span>}
        {headerContent && (
          <div className={styles.headerContent}>
            {headerContent}
          </div>
        )}
      </div>
      <div ref={trackAreaRef} className={styles.trackArea}>
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

export default ResizablePanel;
