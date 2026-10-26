import { useLayoutEffect, useRef, useState } from "react";

/** Return value of {@link useCompactRow}. */
export interface UseCompactRowReturn {
  /** Callback ref for the row: a single-line flex container. */
  ref: (el: HTMLElement | null) => void;
  /** Whether the row's parts should render compact so they do not overlap. */
  compact: boolean;
}

/**
 * Hook that reports whether a single-line flex row needs its parts compact
 * (icon-only) so they do not overlap: on when their full widths overflow the
 * row, off again once the row is as wide as they needed. Unlike
 * `useOverflowFit`, nothing leaves the row; its parts may shrink. Provide
 * `compact` through `OverflowRowCompactContext` so actions with
 * `collapse="auto"` follow it. A wrapping row never compacts.
 *
 * @example
 * ```tsx
 * const { ref, compact } = useCompactRow();
 * return (
 *   <Stack ref={ref} orientation="row">
 *     <Breadcrumb />
 *     <OverflowRowCompactContext.Provider value={compact}>
 *       <Actions />
 *     </OverflowRowCompactContext.Provider>
 *   </Stack>
 * );
 * ```
 */
export function useCompactRow(): UseCompactRowReturn {
  const [row, setRow] = useState<HTMLElement | null>(null);
  const [compact, setCompact] = useState(false);
  const needed = useRef(0);

  useLayoutEffect(() => {
    if (!row) return;
    const measure = (): void => {
      const css = window.getComputedStyle(row);
      if (css.flexWrap.startsWith("wrap")) {
        setCompact(false);
        return;
      }
      const parts = [...row.children].filter(
        (child) => child.getBoundingClientRect().width > 0
      );
      const width =
        parts.reduce((sum, part) => sum + part.scrollWidth, 0) +
        (parseFloat(css.columnGap) || 0) * Math.max(parts.length - 1, 0) +
        (parseFloat(css.paddingLeft) || 0) +
        (parseFloat(css.paddingRight) || 0);
      setCompact((current) => {
        if (!current && width > row.clientWidth + 1) {
          needed.current = width;
          return true;
        }
        return current && row.clientWidth < needed.current;
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    [...row.children].forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [row]);

  return { ref: setRow, compact };
}
