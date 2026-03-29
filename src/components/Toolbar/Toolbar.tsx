/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A generic floating, draggable toolbar.
 *
 * Completely abstract — knows nothing about segmentation, 3D, or any specific
 * domain. Compose it with `ToolbarGroup` and `ToolbarAction` to build any
 * tool palette.
 *
 * @example
 * ```tsx
 * <Toolbar orientation="vertical" xOffset={20} yOffset={100}>
 *   <ToolbarGroup label="Tool">
 *     <ToolbarAction active>
 *       <BrushIcon />
 *     </ToolbarAction>
 *   </ToolbarGroup>
 * </Toolbar>
 * ```
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { DragHandleIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  BorderColor,
  borderColorClass,
  Radius,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

import { Orientation, OrientationContext } from "./context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolbarProps {
  children: React.ReactNode;
  /** Layout direction for groups and actions. Default `"vertical"`. */
  orientation?: Orientation;
  /** Lock horizontal (x-axis) movement. Default `false`. */
  lockX?: boolean;
  /** Lock vertical (y-axis) movement. Default `false`. */
  lockY?: boolean;
  /**
   * Initial pixel offset from the left edge of the parent container.
   * Default `20`.
   */
  xOffset?: number;
  /**
   * Initial pixel offset from the top edge of the parent container.
   * Default `20`.
   */
  yOffset?: number;
  /**
   * When `true`, renders the toolbar into `document.body` via a React Portal
   * and uses `position: fixed`. Default `false`.
   */
  portal?: boolean;
  /** CSS `z-index`. Default `10005`. */
  zIndex?: number;
  /** Accessible label for the toolbar landmark. */
  "aria-label"?: string;
  /** Additional class name. */
  className?: string;
  /** Additional inline styles on the outer container. */
  style?: React.CSSProperties;
  /** Whether the toolbar is visible. Default `true`. */
  visible?: boolean;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_X_OFFSET = 20;
const DEFAULT_Y_OFFSET = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Toolbar = ({
  children,
  orientation = "vertical",
  lockX = false,
  lockY = false,
  xOffset = DEFAULT_X_OFFSET,
  yOffset = DEFAULT_Y_OFFSET,
  portal = false,
  zIndex = 10005,
  "aria-label": ariaLabel,
  className,
  style,
  visible = true,
}: ToolbarProps) => {
  const canDrag = !(lockX && lockY);
  const canDragX = !lockX;
  const canDragY = !lockY;

  const [position, setPosition] = useState({ x: xOffset, y: yOffset });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    pos: { x: xOffset, y: yOffset },
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // ---- drag handlers ----

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!canDrag) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        pos: position,
      };
    },
    [canDrag, position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = containerRef.current;
      const parent = portal
        ? { clientWidth: window.innerWidth, clientHeight: window.innerHeight }
        : (el?.parentElement ?? {
            clientWidth: window.innerWidth,
            clientHeight: window.innerHeight,
          });

      const toolbarW = el?.offsetWidth ?? 0;
      const toolbarH = el?.offsetHeight ?? 0;
      const { clientX, clientY, pos } = dragStartRef.current;

      const nextX = canDragX
        ? Math.max(
            0,
            Math.min(
              parent.clientWidth - toolbarW,
              pos.x + (e.clientX - clientX)
            )
          )
        : pos.x;

      const nextY = canDragY
        ? Math.max(
            0,
            Math.min(
              parent.clientHeight - toolbarH,
              pos.y + (e.clientY - clientY)
            )
          )
        : pos.y;

      setPosition({ x: nextX, y: nextY });
    },
    [canDragX, canDragY, portal]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragHandleDoubleClick = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ---- render ----

  if (!visible) return null;

  const toolbar = (
    <OrientationContext.Provider value={orientation}>
      <div
        ref={containerRef}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        data-dragging={isDragging || undefined}
        className={cn(
          "group absolute flex select-none",
          !isCollapsed && "min-w-9",
          portal && "!fixed",
          "border",
          borderColorClass(BorderColor.Strong),
          radiusStyles(Radius.Md),
          "backdrop-blur-sm",
          "shadow-md data-dragging:shadow-xl",
          "transition-[opacity,box-shadow] data-dragging:transition-none",
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          zIndex,
          flexDirection: orientation === "vertical" ? "column" : "row",
          backgroundColor: "rgba(28, 29, 30, 0.85)",
          ...style,
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {canDrag && (
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={handleDragHandleDoubleClick}
            title={
              isCollapsed
                ? "Double-click to expand"
                : "Double-click to collapse"
            }
            className={cn(
              "flex items-center justify-center",
              textColorClass(TextColor.Secondary),
              "cursor-grab group-data-dragging:cursor-grabbing",
              orientation === "vertical"
                ? "w-full py-1 px-3 rounded-t-md [&_svg]:rotate-90"
                : isCollapsed
                  ? "self-stretch px-1 py-2 rounded-md"
                  : "self-stretch px-1 py-2 rounded-l-md"
            )}
          >
            <DragHandleIcon />
          </div>
        )}
        {!isCollapsed && (
          <div
            className={cn(
              "flex items-center gap-1 p-1.5",
              orientation === "vertical" ? "flex-col" : "flex-row"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </OrientationContext.Provider>
  );

  return portal ? createPortal(toolbar, document.body) : toolbar;
};

Toolbar.displayName = "Toolbar";
