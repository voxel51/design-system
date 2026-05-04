import React, { useCallback, useRef, useState } from "react";
import { DragAxis, useDragDelta } from "./useDragDelta";
import {
  UseDisclosureOptions,
  UseDisclosureReturn,
  useDisclosure,
} from "./useDisclosure";

export type { DragAxis };

export interface UseResizableDrawerOptions extends UseDisclosureOptions {
  axis: DragAxis;
  defaultSize: number;
  minSize: number;
  maxSize: number;
  /** Size at which a drag triggers close. Defaults to 0. */
  closeThreshold?: number;
  /** Flip the delta sign — use for right-side and bottom-side handles. */
  invert?: boolean;
  onSizeChange?: (size: number) => void;
}

export interface UseResizableDrawerReturn extends UseDisclosureReturn {
  size: number;
  isDragging: boolean;
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
  };
}

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

  // Live-value refs so drag callbacks are stable and always read current values.
  const openRef = useRef(open);
  openRef.current = open;
  const sizeRef = useRef(defaultSize);
  const savedSizeRef = useRef(defaultSize);
  const dragStartSizeRef = useRef(defaultSize);
  const closeThresholdRef = useRef(closeThreshold);
  closeThresholdRef.current = closeThreshold;
  const invertRef = useRef(invert);
  invertRef.current = invert;
  const minSizeRef = useRef(minSize);
  minSizeRef.current = minSize;
  const maxSizeRef = useRef(maxSize);
  maxSizeRef.current = maxSize;
  const onSizeChangeRef = useRef(onSizeChange);
  onSizeChangeRef.current = onSizeChange;

  const onDragStart = useCallback(() => {
    dragStartSizeRef.current = openRef.current
      ? sizeRef.current
      : closeThresholdRef.current;
  }, []);

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
        sizeRef.current = clamped;
        setSize(clamped);
        if (!openRef.current) setOpen(true);
        savedSizeRef.current = clamped;
        onSizeChangeRef.current?.(clamped);
      }
    },
    [setOpen]
  );

  const { isDragging, handleProps } = useDragDelta({
    axis,
    onDragStart,
    onDelta,
  });

  const toggle = useCallback(() => {
    if (!openRef.current) {
      const restore = savedSizeRef.current;
      sizeRef.current = restore;
      setSize(restore);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [setOpen]);

  return {
    open,
    toggle,
    setOpen,
    size,
    isDragging,
    dragHandleProps: handleProps,
  };
}
