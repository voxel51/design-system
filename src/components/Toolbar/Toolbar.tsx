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
 * <Toolbar orientation={Orientation.Column} xOffset={20} yOffset={100}>
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
import { Stack } from "@/components/Stack";
import {
  Align,
  BackgroundColor,
  BorderColor,
  borderColorClass,
  getColorCssVar,
  IconColor,
  Spacing,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

import { Orientation, OrientationContext } from "./context";

export interface ToolbarProps {
  children: React.ReactNode;
  /** Layout direction for groups and actions. Default `Orientation.Column`. */
  orientation?: Orientation;
  /** Lock horizontal (x-axis) movement. Default `false`. */
  lockX?: boolean;
  /** Lock vertical (y-axis) movement. Default `false`. */
  lockY?: boolean;
  /** Initial pixel offset from the left edge of the parent container.*/
  xOffset?: number;
  /** Initial pixel offset from the top edge of the parent container.*/
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

const DEFAULT_X_OFFSET = 20;
const DEFAULT_Y_OFFSET = 20;

export const Toolbar = ({
  children,
  orientation = Orientation.Column,
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

  const [position, setPosition] = useState({ x: xOffset, y: yOffset });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSize, setCollapsedSize] = useState<number | null>(null);
  const dragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    pos: { x: xOffset, y: yOffset },
  });
  const containerRef = useRef<HTMLDivElement>(null);

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
      const fallback = {
        clientWidth: window.innerWidth,
        clientHeight: window.innerHeight,
      };
      const parent = portal ? fallback : (el?.parentElement ?? fallback);

      const toolbarW = el?.offsetWidth ?? 0;
      const toolbarH = el?.offsetHeight ?? 0;
      const { clientX, clientY, pos } = dragStartRef.current;

      const nextX = lockX
        ? pos.x
        : Math.max(
            0,
            Math.min(
              parent.clientWidth - toolbarW,
              pos.x + (e.clientX - clientX)
            )
          );

      const nextY = lockY
        ? pos.y
        : Math.max(
            0,
            Math.min(
              parent.clientHeight - toolbarH,
              pos.y + (e.clientY - clientY)
            )
          );

      setPosition({ x: nextX, y: nextY });
    },
    [lockX, lockY, portal]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragHandleDoubleClick = useCallback(() => {
    setIsCollapsed((prev) => {
      if (!prev) {
        const el = containerRef.current;
        setCollapsedSize(
          orientation === Orientation.Column
            ? (el?.offsetWidth ?? null)
            : (el?.offsetHeight ?? null)
        );
      } else {
        setCollapsedSize(null);
      }
      return !prev;
    });
  }, [orientation]);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!visible) return null;

  const dragHandleClass = cn(
    "flex items-center justify-center",
    textColorClass(IconColor.Emphasis),
    "cursor-grab group-data-dragging:cursor-grabbing",
    "rounded-md",
    orientation === Orientation.Column
      ? "self-stretch py-2 px-1 [&_svg]:rotate-90"
      : "self-stretch px-2 py-1.5"
  );

  const containerClass = cn(
    "group absolute flex select-none",
    orientation === Orientation.Column ? "flex-col" : "flex-row",
    portal && "!fixed",
    "border",
    borderColorClass(BorderColor.Strong),
    "rounded-md",
    "backdrop-blur-sm",
    "shadow-md data-dragging:shadow-xl",
    "transition-[opacity,box-shadow] data-dragging:transition-none",
    className
  );

  const containerStyle: React.CSSProperties = {
    left: position.x,
    top: position.y,
    zIndex,
    backgroundColor: `color-mix(in srgb, var(${getColorCssVar(BackgroundColor.Card2)}) 85%, transparent)`,
    ...(isCollapsed && collapsedSize !== null
      ? orientation === Orientation.Column
        ? { width: collapsedSize }
        : { height: collapsedSize }
      : {}),
    ...style,
  };

  const toolbar = (
    <OrientationContext.Provider value={orientation}>
      <div
        ref={containerRef}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation={
          orientation === Orientation.Column ? "vertical" : "horizontal"
        }
        data-dragging={isDragging || undefined}
        className={containerClass}
        style={containerStyle}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {canDrag && (
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={handleDragHandleDoubleClick}
            className={dragHandleClass}
          >
            <DragHandleIcon />
          </div>
        )}
        {!isCollapsed && (
          <Stack
            orientation={orientation}
            align={Align.Center}
            spacing={Spacing.Xs}
            className="p-1.5"
          >
            {children}
          </Stack>
        )}
      </div>
    </OrientationContext.Provider>
  );

  return portal ? createPortal(toolbar, document.body) : toolbar;
};

Toolbar.displayName = "Toolbar";
