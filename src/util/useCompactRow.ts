import { useLayoutEffect, useRef, useState } from "react";

import {
  capLabels,
  COLLAPSE_LABEL_ATTR,
  FULL_FIT,
  type OverflowRowFit,
} from "@/util/compact";

/** Options for {@link useCompactRow}. */
export interface UseCompactRowOptions {
  /** The narrowest a label is cut to before the row goes compact, in pixels. Default `40`. */
  minLabel?: number;
}

/** Return value of {@link useCompactRow}. */
export interface UseCompactRowReturn {
  /** Callback ref for the row: a single-line flex container. */
  ref: (el: HTMLElement | null) => void;
  /** Whether the row's parts should render compact (icon-only). */
  compact: boolean;
  /** The width labels are cut to, or `null`. */
  labelMax: number | null;
  /** `compact` and `labelMax` together, for `OverflowRowCompactContext`. */
  context: OverflowRowFit;
}

/**
 * Hook that works out how a single-line flex row's parts shrink so they do not
 * overlap: first the labels marked `data-collapse-label` (as `collapse="auto"`
 * actions mark theirs) are cut, widest first, down to `minLabel`; past that
 * the parts go compact (icon-only). Back to full once the row is as wide as
 * they need. Unlike `useOverflowFit`, nothing leaves the row. Provide
 * `context` through `OverflowRowCompactContext`. A wrapping row never shrinks.
 *
 * @example
 * ```tsx
 * const row = useCompactRow();
 * return (
 *   <Stack ref={row.ref} orientation="row">
 *     <Breadcrumb />
 *     <OverflowRowCompactContext.Provider value={row.context}>
 *       <Actions />
 *     </OverflowRowCompactContext.Provider>
 *   </Stack>
 * );
 * ```
 */
export function useCompactRow({
  minLabel = 40,
}: UseCompactRowOptions = {}): UseCompactRowReturn {
  const [row, setRow] = useState<HTMLElement | null>(null);
  const [fit, setFit] = useState<OverflowRowFit>(FULL_FIT);
  const current = useRef<OverflowRowFit>(FULL_FIT);
  // what the row needs at full size, and its labels' own widths
  const needed = useRef({ width: 0, labels: [] as number[] });

  useLayoutEffect(() => {
    if (!row || typeof ResizeObserver === "undefined") return;
    const update = (next: OverflowRowFit): void => {
      const prev = current.current;
      if (prev.compact === next.compact && prev.labelMax === next.labelMax) {
        return;
      }
      current.current = next;
      setFit(next);
    };
    const measure = (): void => {
      const css = window.getComputedStyle(row);
      if (css.flexWrap.startsWith("wrap")) {
        update(FULL_FIT);
        return;
      }
      // compact parts hide their labels: keep what was measured before
      if (!current.current.compact) {
        const parts = [...row.children].filter(
          (child) => child.getBoundingClientRect().width > 0
        );
        const labels = [
          ...row.querySelectorAll<HTMLElement>(`[${COLLAPSE_LABEL_ATTR}]`),
        ];
        needed.current = {
          width:
            parts.reduce((sum, part) => sum + part.scrollWidth, 0) +
            (parseFloat(css.columnGap) || 0) * Math.max(parts.length - 1, 0) +
            (parseFloat(css.paddingLeft) || 0) +
            (parseFloat(css.paddingRight) || 0) +
            // labels cut short count at their own width
            labels.reduce(
              (sum, label) => sum + label.scrollWidth - label.clientWidth,
              0
            ),
          labels: labels.map((label) => label.scrollWidth),
        };
      }
      const deficit = needed.current.width - row.clientWidth;
      if (deficit <= 1) {
        update(FULL_FIT);
        return;
      }
      const labelMax = capLabels(needed.current.labels, deficit, minLabel);
      update(
        labelMax !== null
          ? { compact: false, labelMax }
          : { compact: true, labelMax: null }
      );
    };
    const observer = new ResizeObserver(measure);
    const watchChildren = (): void =>
      [...row.children].forEach((child) => observer.observe(child));
    observer.observe(row);
    watchChildren();
    // parts added or removed later change what the row needs without resizing it
    const mutations = new MutationObserver(() => {
      watchChildren();
      measure();
    });
    mutations.observe(row, { childList: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [row, minLabel]);

  return {
    ref: setRow,
    compact: fit.compact,
    labelMax: fit.labelMax,
    context: fit,
  };
}
