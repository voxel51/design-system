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

  // Mirror mutable callbacks into refs so handlers stay stable across re-renders.
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      startPosRef.current = axis === "horizontal" ? e.clientX : e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
      onDragStartRef.current?.();
    },
    [axis]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current) return;
      const current = axis === "horizontal" ? e.clientX : e.clientY;
      onDeltaRef.current(current - startPosRef.current);
    },
    [axis]
  );

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    onDragEndRef.current?.();
  }, []);

  return { isDragging, handleProps: { onPointerDown, onPointerMove, onPointerUp } };
}
