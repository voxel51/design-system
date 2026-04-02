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

import {
  useCallback,
  useState,
  CSSProperties,
  RefObject,
  ReactNode,
  ReactElement,
} from "react";

import { DragHandleIcon } from "@/components/Icons";
import { Stack } from "@/components/Stack";
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
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";

import { OrientationContext } from "./context";

export interface ToolbarProps {
  children: ReactNode;
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
  /** Stacking layer for the toolbar. Default `ZIndex.High`. */
  zIndex?: ZIndex;
  /** Accessible label for the toolbar landmark. */
  "aria-label"?: string;
  /** Additional class name. */
  className?: string;
  /** Additional inline styles on the outer container. */
  style?: CSSProperties;
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
  zIndex = ZIndex.AboveModal,
  "aria-label": ariaLabel,
  className,
  style,
  visible = true,
}: ToolbarProps): ReactElement | null => {
  const canDrag = !(lockX && lockY);

  const { position, isDragging, containerRef, handleDragStart } = useDraggable({
    initialX: xOffset,
    initialY: yOffset,
    lockX,
    lockY,
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
    textColorClass(IconColor.Emphasis),
    "cursor-grab group-data-dragging:cursor-grabbing",
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
        aria-label={ariaLabel}
        aria-orientation={
          orientation === Orientation.Column ? "vertical" : "horizontal"
        }
        data-dragging={isDragging || undefined}
        className={containerClass}
        style={containerStyle}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
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
