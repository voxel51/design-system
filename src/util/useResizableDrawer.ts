import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

import {
  UseDisclosureOptions,
  UseDisclosureReturn,
  useDisclosure,
} from "./useDisclosure";
import { DragAxis, useDragDelta } from "./useDragDelta";
import { useElementSize } from "./useElementSize";
import { useLatest } from "./useLatest";

export type { DragAxis };

export interface UseResizableDrawerOptions extends UseDisclosureOptions {
  /** Axis the drawer resizes along. `"horizontal"` for left/right drawers, `"vertical"` for top/bottom. */
  axis: DragAxis;
  /**
   * Maximum content-area size in pixels. The header and handle are excluded —
   * `maxSize` caps only the scrollable body region.
   */
  maxSize: number;
  /** Flip the delta sign — use for right-side and bottom-side handles. */
  invert?: boolean;
  /** Invoked with the new content-area size on every drag-induced resize. */
  onSizeChange?: (size: number) => void;
}

export interface UseResizableDrawerReturn extends UseDisclosureReturn {
  /** Current content-area size in pixels (0 when closed or not yet measured). */
  size: number;
  /** `true` while the user is actively dragging the resize handle. */
  isDragging: boolean;
  /**
   * `true` only when the current size change should be animated — i.e. an
   * open/close toggle. Content-driven resizes and drags are instant (`false`),
   * so the size snaps and doesn't fight the header's un-animated layout change.
   */
  animating: boolean;
  /** Props to spread onto the drag handle element. */
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
  };
  /**
   * Attach the size-bearing wrapper's `onTransitionEnd` to this so `animating`
   * clears when the open/close transition completes.
   */
  onTransitionEnd: () => void;
  /**
   * Attach to the content element. The hook observes it via ResizeObserver and
   * keeps the open size equal to `min(contentHeight, maxSize)` automatically.
   */
  contentRef: (el: HTMLElement | null) => void;
}

export function useResizableDrawer({
  axis,
  maxSize,
  invert = false,
  onSizeChange,
  ...disclosureOptions
}: UseResizableDrawerOptions): UseResizableDrawerReturn {
  const { open, setOpen } = useDisclosure(disclosureOptions);
  // Measured natural content height (synced every commit, below).
  const [contentHeight, setContentHeight] = useState(0);
  // Manual drag override in pixels; `null` means "auto-size to content".
  const [userSize, setUserSize] = useState<number | null>(null);
  // Only open/close toggles animate. Drags and content resizes are instant.
  const [animating, setAnimating] = useState(false);

  // useElementSize's ResizeObserver re-renders on *external* content changes
  // (image/font load, reflow). We capture the element to measure it
  // synchronously on every commit (below). Its reported height is unused.
  const { ref: observeRef } = useElementSize();
  const contentElRef = useRef<HTMLElement | null>(null);
  const contentRef = useCallback(
    (el: HTMLElement | null) => {
      contentElRef.current = el;
      observeRef(el);
    },
    [observeRef]
  );

  // Derived sizes:
  // - autoSize: the natural open size — content height, capped at maxSize.
  // - openSize: a manual drag can only shrink *below* autoSize; otherwise follow content.
  // - size: collapses to 0 when closed.
  const autoSize = Math.min(contentHeight, maxSize);
  const openSize = userSize != null ? Math.min(userSize, autoSize) : autoSize;
  const size = open ? openSize : 0;

  const openRef = useLatest(open);
  const sizeRef = useLatest(size);
  const invertRef = useLatest(invert);
  const maxSizeRef = useLatest(maxSize);
  const onSizeChangeRef = useLatest(onSizeChange);

  const dragStartSizeRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Measure content synchronously on every commit (skipped mid-drag, when the
  // content can't change). Running in the same commit that changed the
  // content/header means `size` updates before paint — no one-frame flicker.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (isDraggingRef.current) return;
    const h = contentElRef.current?.offsetHeight ?? 0;
    setContentHeight((prev) => (prev === h ? prev : h));
  });

  const onDragStart = useCallback(() => {
    isDraggingRef.current = true;
    setAnimating(false);
    dragStartSizeRef.current = openRef.current ? sizeRef.current : 0;
  }, [openRef, sizeRef]);

  const onDelta = useCallback(
    (delta: number) => {
      const adjusted = invertRef.current ? -delta : delta;
      const raw = dragStartSizeRef.current + adjusted;
      if (raw <= 0) {
        // Dragged shut: close and drop the manual override so reopening auto-sizes.
        if (openRef.current) {
          setOpen(false);
          setUserSize(null);
        }
        return;
      }
      const auto = Math.min(
        contentElRef.current?.offsetHeight ?? 0,
        maxSizeRef.current
      );
      const clamped = Math.min(raw, auto);
      // Dragging all the way up to the natural size re-enters auto mode.
      setUserSize(clamped >= auto ? null : clamped);
      if (!openRef.current) setOpen(true);
      onSizeChangeRef.current?.(clamped);
    },
    [invertRef, maxSizeRef, onSizeChangeRef, openRef, setOpen]
  );

  const onDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const { isDragging, handleProps } = useDragDelta({
    axis,
    onDragStart,
    onDelta,
    onDragEnd,
  });

  const toggle = useCallback(() => {
    setAnimating(true);
    // Both directions clear the manual override: reopening always auto-sizes
    // (no memory of the last dragged size) and closing renders size 0.
    setUserSize(null);
    setOpen(!openRef.current);
  }, [openRef, setOpen]);

  // Clear `animating` once the open/close transition finishes.
  const onTransitionEnd = useCallback(() => {
    if (!isDraggingRef.current) setAnimating(false);
  }, []);

  return {
    open,
    toggle,
    setOpen,
    size,
    isDragging,
    animating,
    onTransitionEnd,
    dragHandleProps: handleProps,
    contentRef,
  };
}
