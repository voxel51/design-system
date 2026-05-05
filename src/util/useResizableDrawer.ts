import React, { useCallback, useRef, useState } from "react";

import {
  UseDisclosureOptions,
  UseDisclosureReturn,
  useDisclosure,
} from "./useDisclosure";
import { DragAxis, useDragDelta } from "./useDragDelta";
import { useLatest } from "./useLatest";

export type { DragAxis };

/**
 * Options for {@link useResizableDrawer}.
 *
 * Extends {@link UseDisclosureOptions} so the drawer's open state can be
 * controlled or uncontrolled in the same way as {@link useDisclosure}.
 */
export interface UseResizableDrawerOptions extends UseDisclosureOptions {
  /** Axis the drawer resizes along. `"horizontal"` for left/right drawers, `"vertical"` for top/bottom. */
  axis: DragAxis;
  /** Initial drawer size in pixels, also used as the restore target after closing. */
  defaultSize: number;
  /** Minimum drawer size in pixels while open. */
  minSize: number;
  /** Maximum drawer size in pixels. */
  maxSize: number;
  /** Size at which a drag triggers close. Defaults to 0. */
  closeThreshold?: number;
  /** Flip the delta sign — use for right-side and bottom-side handles. */
  invert?: boolean;
  /** Invoked with the new size on every drag-induced resize (not on open/close-only changes). */
  onSizeChange?: (size: number) => void;
}

/**
 * Return value of {@link useResizableDrawer}. Extends {@link UseDisclosureReturn}
 * with size and drag state.
 */
export interface UseResizableDrawerReturn extends UseDisclosureReturn {
  /** Current drawer size in pixels. Reflects the last committed size even while closed. */
  size: number;
  /** `true` while the user is actively dragging the resize handle. */
  isDragging: boolean;
  /** Props to spread onto the drag handle element. */
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
  };
}

/**
 * Hook which models a drawer that can be opened, closed, and resized by
 * dragging a handle.
 *
 * Behavior:
 * - Dragging below `closeThreshold` (default `0`) closes the drawer.
 * - Dragging above `closeThreshold` while closed reopens the drawer.
 * - Sizes are clamped to `[minSize, maxSize]` while open.
 * - `toggle()` restores the last dragged size when reopening.
 *
 * @example
 * ```tsx
 * const { open, size, toggle, dragHandleProps } = useResizableDrawer({
 *   axis: "horizontal",
 *   defaultSize: 320,
 *   minSize: 200,
 *   maxSize: 600,
 * });
 * return (
 *   <aside style={{ width: open ? size : 0 }}>
 *     <div {...dragHandleProps} />
 *   </aside>
 * );
 * ```
 */
export function useResizableDrawer({
  axis,
  defaultSize,
  minSize,
  maxSize,
  closeThreshold = 0,
  invert = false,
  onSizeChange,
  ...disclosureOptions
}: UseResizableDrawerOptions): UseResizableDrawerReturn {
  const { open, setOpen } = useDisclosure(disclosureOptions);
  const [size, setSize] = useState(defaultSize);

  // Latest-value refs so drag callbacks are stable and always read current values.
  const openRef = useLatest(open);
  const sizeRef = useLatest(size);
  const closeThresholdRef = useLatest(closeThreshold);
  const invertRef = useLatest(invert);
  const minSizeRef = useLatest(minSize);
  const maxSizeRef = useLatest(maxSize);
  const onSizeChangeRef = useLatest(onSizeChange);

  // Cross-event mutable state, not mirrors.
  const savedSizeRef = useRef(defaultSize);
  const dragStartSizeRef = useRef(defaultSize);

  const onDragStart = useCallback(() => {
    dragStartSizeRef.current = openRef.current
      ? sizeRef.current
      : closeThresholdRef.current;
  }, [closeThresholdRef, openRef, sizeRef]);

  const onDelta = useCallback(
    (delta: number) => {
      const adjusted = invertRef.current ? -delta : delta;
      const raw = dragStartSizeRef.current + adjusted;
      if (raw <= closeThresholdRef.current) {
        if (openRef.current) setOpen(false);
      } else {
        const clamped = Math.min(
          maxSizeRef.current,
          Math.max(minSizeRef.current, raw)
        );
        setSize(clamped);
        if (!openRef.current) setOpen(true);
        savedSizeRef.current = clamped;
        onSizeChangeRef.current?.(clamped);
      }
    },
    [
      closeThresholdRef,
      invertRef,
      maxSizeRef,
      minSizeRef,
      onSizeChangeRef,
      openRef,
      setOpen,
    ]
  );

  const { isDragging, handleProps } = useDragDelta({
    axis,
    onDragStart,
    onDelta,
  });

  const toggle = useCallback(() => {
    if (!openRef.current) {
      setSize(savedSizeRef.current);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [openRef, setOpen]);

  return {
    open,
    toggle,
    setOpen,
    size,
    isDragging,
    dragHandleProps: handleProps,
  };
}
