import clsx from "clsx";
import React from "react";
import ChevronBottomIcon from "@/img/ChevronBottom.svg?react";
import { usePinnableDrawer } from "@/util/usePinnableDrawer";
import styles from "./ResizablePanel.module.css";

const TOGGLE_HEIGHT = 24;
const DRAG_HANDLE_HEIGHT = 4;

export interface ResizablePanelProps {
  minHeight: number;
  maxHeight: number;
  mode?: "push" | "float";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onHeightChange?: (height: number) => void;
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
  open: controlledOpen,
  onOpenChange,
  onHeightChange,
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
  const { open, toggle, size: height, isDragging, dragHandleProps, pinnedRef, closedSize } =
    usePinnableDrawer({
      axis: "vertical",
      invert: true,
      defaultOpen,
      open: controlledOpen,
      onOpenChange,
      defaultSize: maxHeight,
      minSize: minHeight,
      maxSize: maxHeight,
      closedPadding: DRAG_HANDLE_HEIGHT + TOGGLE_HEIGHT,
      onSizeChange: onHeightChange,
    });

  const resolvedLabel = typeof label === "function" ? label(open) : label;

  return (
    <div
      className={clsx(styles.root, styles[mode], className)}
      style={{
        height: open ? height : closedSize,
        transition: isDragging ? "none" : "height 0.2s ease",
        ...style,
      }}
    >
      <div
        className={clsx(styles.dragHandle, { [styles.dragHandleDisabled]: !open })}
        {...dragHandleProps}
      />
      <div
        className={clsx(styles.toggle, { [styles.toggleRight]: align === "right" })}
        onClick={toggle}
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
          <div className={styles.headerContent}>{headerContent}</div>
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
