/**
 * Copyright 2017-2026, Voxel51, Inc.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface UseDraggableOptions {
  /** Initial pixel offset from the left edge of the bounding container. Default `0`. */
  initialX?: number;
  /** Initial pixel offset from the top edge of the bounding container. Default `0`. */
  initialY?: number;
  /** Lock horizontal (x-axis) movement. Default `false`. */
  lockX?: boolean;
  /** Lock vertical (y-axis) movement. Default `false`. */
  lockY?: boolean;
  /**
   * When `true`, bounds are computed against the viewport (`window.innerWidth` /
   * `window.innerHeight`) instead of the element's parent. Use together with
   * `position: fixed`. Default `false`.
   */
  portal?: boolean;
  /**
   * Called after every drag move with the new pixel position.
   * Always delivers pixel values regardless of what type `initialX`/`initialY` were.
   */
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

export interface UseDraggableReturn {
  /** Current `{ x, y }` position in pixels. */
  position: { x: number; y: number };
  /** `true` while the user is actively dragging. */
  isDragging: boolean;
  /** Attach to the element that should be repositioned. */
  containerRef: React.RefObject<HTMLElement | null>;
  /**
   * `onMouseDown` handler for the drag-handle element.
   * Only has an effect when both `lockX` and `lockY` are not both `true`.
   */
  handleDragStart: (e: React.MouseEvent) => void;
}

/**
 * Hook that provides drag-to-reposition behaviour for a floating element.
 *
 * The hook tracks mouse interactions and keeps the element within the bounds of
 * either its nearest parent element or the viewport (when `portal` is `true`).
 *
 * @example
 * ```tsx
 * const { position, isDragging, containerRef, handleDragStart } = useDraggable({
 *   initialX: 20,
 *   initialY: 100,
 * });
 *
 * return (
 *   <div
 *     ref={containerRef}
 *     data-dragging={isDragging || undefined}
 *     style={{ position: "absolute", left: position.x, top: position.y }}
 *   >
 *     <button onMouseDown={handleDragStart}>drag me</button>
 *   </div>
 * );
 * ```
 */
export const useDraggable = ({
  initialX = 0,
  initialY = 0,
  lockX = false,
  lockY = false,
  portal = false,
  onPositionChange,
}: UseDraggableOptions = {}): UseDraggableReturn => {
  const canDrag = !(lockX && lockY);

  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLElement | null>(null);
  const dragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    pos: { x: initialX, y: initialY },
  });

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
      onPositionChange?.({ x: nextX, y: nextY });
    },
    [lockX, lockY, portal, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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

  return { position, isDragging, containerRef, handleDragStart };
};
