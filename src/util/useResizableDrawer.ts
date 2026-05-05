import React, { useCallback, useRef, useState } from "react";
import { DragAxis, useDragDelta } from "./useDragDelta";
import {
  UseDisclosureOptions,
  UseDisclosureReturn,
  useDisclosure,
} from "./useDisclosure";
import { useLatest } from "./useLatest";

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
