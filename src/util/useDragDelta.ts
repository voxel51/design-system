import React, { useCallback, useRef, useState } from "react";

export type DragAxis = "horizontal" | "vertical";

export interface UseDragDeltaOptions {
  axis: DragAxis;
  onDragStart?: () => void;
  onDelta: (delta: number) => void;
  onDragEnd?: () => void;
}

export interface UseDragDeltaReturn {
  isDragging: boolean;
  handleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
  };
}

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
