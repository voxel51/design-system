import React, { useCallback, useRef, useState } from "react";

import { useLatest } from "./useLatest";

/**
 * Axis along which a drag delta is measured.
 *
 * - `"horizontal"` reports `clientX` deltas.
 * - `"vertical"` reports `clientY` deltas.
 */
export type DragAxis = "horizontal" | "vertical";

/**
 * Options for {@link useDragDelta}.
 */
export interface UseDragDeltaOptions {
  /** Axis to measure the drag along. */
  axis: DragAxis;
  /** Invoked once when a drag begins (on pointer-down). */
  onDragStart?: () => void;
  /**
   * Invoked on every pointer-move during a drag with the signed pixel delta
   * from the drag start position. Positive values mean right (horizontal) or
   * down (vertical).
   */
  onDelta: (delta: number) => void;
  /** Invoked once when a drag ends (on pointer-up). */
  onDragEnd?: () => void;
}

/**
 * Return value of {@link useDragDelta}.
 */
export interface UseDragDeltaReturn {
  /** `true` while a drag is in progress (between pointer-down and pointer-up). */
  isDragging: boolean;
  /** Props to spread onto the drag handle element. */
  handleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
  };
}

/**
 * Hook that tracks a single-axis pointer drag and reports the running delta
 * from the drag start position.
 *
 * Uses pointer capture, so the drag continues correctly even if the pointer
 * leaves the handle element. The supplied callbacks may be inline; the hook
 * routes them through {@link useLatest} so the returned `handleProps` are
 * stable across renders.
 *
 * @example
 * ```tsx
 * const { isDragging, handleProps } = useDragDelta({
 *   axis: "horizontal",
 *   onDelta: (delta) => setX((x) => x + delta),
 * });
 * return <div {...handleProps} />;
 * ```
 */
export function useDragDelta({
  axis,
  onDragStart,
  onDelta,
  onDragEnd,
}: UseDragDeltaOptions): UseDragDeltaReturn {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef(0);

  // Latest-value refs so handlers stay stable across re-renders.
  const onDragStartRef = useLatest(onDragStart);
  const onDeltaRef = useLatest(onDelta);
  const onDragEndRef = useLatest(onDragEnd);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      startPosRef.current = axis === "horizontal" ? e.clientX : e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
      onDragStartRef.current?.();
    },
    [axis, onDragStartRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current) return;
      const current = axis === "horizontal" ? e.clientX : e.clientY;
      onDeltaRef.current(current - startPosRef.current);
    },
    [axis, onDeltaRef]
  );

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    onDragEndRef.current?.();
  }, [onDragEndRef]);

  return {
    isDragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp },
  };
}
