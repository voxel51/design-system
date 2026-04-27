// Copyright 2017-2026, Voxel51, Inc.

import {
  useCallback,
  useState,
  CSSProperties,
  HTMLAttributes,
  JSX,
  RefObject,
  ReactNode,
} from "react";

import { DragHandleIcon } from "@/components/Icons";
import { Stack } from "@/components/Stack";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Align,
  BackgroundColor,
  BorderColor,
  borderColorClass,
  ElementState,
  getColorCssVar,
  IconColor,
  Orientation,
  Radius,
  Spacing,
  Shadow,
  textColorClass,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";
import { useDraggable } from "@/util/useDraggable";

import { OrientationContext } from "./context";

export interface ToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: ReactNode;
  /** Layout direction for groups and actions. Default `Orientation.Column`. */
  orientation?: Orientation;
  /** Lock horizontal (x-axis) movement. Default `false`. */
  lockX?: boolean;
  /** Lock vertical (y-axis) movement. Default `false`. */
  lockY?: boolean;
  /** Initial offset from the left edge of the parent container. Accepts any CSS length (e.g. `20`, `"10%"`, `"2rem"`). Default `20`. */
  xOffset?: string | number;
  /** Initial offset from the top edge of the parent container. Accepts any CSS length (e.g. `20`, `"10%"`, `"2rem"`). Default `20`. */
  yOffset?: string | number;
  /** Stacking layer for the toolbar. Default `ZIndex.AboveModal`. */
  zIndex?: ZIndex;
  /** Whether the toolbar is rendered. Default `true`. */
  visible?: boolean;
  /**
   * Called after every drag move with the new pixel position.
   * Use this to persist the toolbar's position across remounts.
   */
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

const DEFAULT_X_OFFSET = 20;
const DEFAULT_Y_OFFSET = 20;

/**
 * A generic floating, draggable toolbar.
 *
 * Completely abstract — knows nothing about segmentation, 3D, or any specific
 * domain. Compose it with `ToolbarGroup` and `ToolbarAction` to build any
 * tool palette.
 *
 * Double-clicking the drag handle collapses the toolbar to just the handle.
 *
 * @param props.children - Tool groups and actions to render inside the toolbar.
 * @param props.orientation - Layout direction for groups and actions. Default `Orientation.Column`.
 * @param props.lockX - Lock horizontal (x-axis) movement. Default `false`.
 * @param props.lockY - Lock vertical (y-axis) movement. Default `false`.
 * @param props.xOffset - Initial offset from the left edge of the parent container. Accepts any CSS length (e.g. `20`, `"10%"`, `"2rem"`). Default `20`.
 * @param props.yOffset - Initial offset from the top edge of the parent container. Accepts any CSS length (e.g. `20`, `"10%"`, `"2rem"`). Default `20`.
 * @param props.zIndex - Stacking layer for the toolbar. Default `ZIndex.AboveModal`.
 * @param props.visible - Whether the toolbar is rendered. Default `true`.
 * @param props.onPositionChange - Called after every drag move with the new pixel position.
 * @param props - Any additional `HTMLDivElement` attributes (e.g. `data-testid`, `aria-label`) are
 *   forwarded to the root `div`. Internal `onPointerDown`, `onClick`, and `onKeyDown` handlers that
 *   call `stopPropagation` are merged with any consumer-provided handlers.
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
export const Toolbar = ({
  children,
  orientation = Orientation.Column,
  lockX = false,
  lockY = false,
  xOffset = DEFAULT_X_OFFSET,
  yOffset = DEFAULT_Y_OFFSET,
  zIndex = ZIndex.AboveModal,
  className,
  style,
  visible = true,
  onPointerDown,
  onClick,
  onKeyDown,
  onPositionChange,
  ...props
}: ToolbarProps): JSX.Element | null => {
  const canDrag = !(lockX && lockY);

  const { position, isDragging, containerRef, handleDragStart } = useDraggable({
    initialX: xOffset,
    initialY: yOffset,
    lockX,
    lockY,
    onPositionChange,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedSize, setCollapsedSize] = useState<number | null>(null);

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
  }, [containerRef, orientation]);

  if (!visible) return null;

  const dragHandleClass = cn(
    "flex items-center justify-center",
    "cursor-grab group-data-dragging:cursor-grabbing",
    textColorClass(IconColor.Emphasis),
    radiusStyles(Radius.Md),
    orientation === Orientation.Column
      ? "self-stretch py-2 px-1 [&_svg]:rotate-90"
      : "self-stretch px-2 py-1.5",
    !isCollapsed && orientation === Orientation.Column && "pb-0",
    !isCollapsed && orientation === Orientation.Row && "pr-0"
  );

  const containerClass = cn(
    "group absolute flex select-none",
    orientation === Orientation.Column ? "flex-col" : "flex-row",
    zIndexStyles(zIndex),
    "border",
    borderColorClass(BorderColor.Strong),
    radiusStyles(Radius.Md),
    "backdrop-blur-sm",
    shadowStyles(Shadow.Md),
    shadowStyles(Shadow.Xl, ElementState.Dragging),
    "transition-[opacity,box-shadow] data-dragging:transition-none",
    className
  );

  const containerStyle: CSSProperties = {
    left: position.x,
    top: position.y,
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
        ref={containerRef as RefObject<HTMLDivElement>}
        role="toolbar"
        aria-orientation={
          orientation === Orientation.Column ? "vertical" : "horizontal"
        }
        data-dragging={isDragging || undefined}
        className={containerClass}
        style={containerStyle}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown?.(e);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          onKeyDown?.(e);
        }}
        {...props}
      >
        {canDrag && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Drag to reposition toolbar"
            onMouseDown={handleDragStart}
            onDoubleClick={handleDragHandleDoubleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDragHandleDoubleClick();
              }
            }}
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

  return toolbar;
};

Toolbar.displayName = "Toolbar";
