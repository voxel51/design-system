import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useElementSize } from "@/util/useElementSize";

/** Options for {@link useOverflowFit}. */
export interface UseOverflowFitOptions {
  /** Space between items, in pixels. Default `4`. */
  gap?: number;
  /**
   * Room kept for an overflow control when some items do not fit, in pixels.
   * `0` when the control sits outside the measured container. Default `28`.
   */
  reserve?: number;
  /**
   * Lets the items go compact (icon-only, say) before any leave: when they do
   * not all fit, `compact` turns on and they are measured again. Default `false`.
   */
  compactable?: boolean;
}

/** Return value of {@link useOverflowFit}. */
export interface UseOverflowFitReturn {
  /** Callback ref for the container whose width the items share. */
  ref: (el: HTMLElement | null) => void;
  /** Callback ref for the rendered item with `key`, which measures it. */
  itemRef: (key: string) => (el: HTMLElement | null) => void;
  /** How many of the items, from the first, fit in the container. */
  fit: number;
  /** Whether the items should render compact; only with `compactable`. */
  compact: boolean;
}

/**
 * Hook that works out how many items, in priority order, fit side by side in a
 * container, so the rest can move into a "more" menu. Render the first `fit`
 * items with `itemRef(key)`; every item is rendered once first, to be measured.
 *
 * @example
 * ```tsx
 * const { ref, itemRef, fit } = useOverflowFit(actions.map((a) => a.id));
 * return (
 *   <div ref={ref} className="flex min-w-0 flex-1 gap-1">
 *     {actions.slice(0, fit).map((a) => (
 *       <div key={a.id} ref={itemRef(a.id)}>{a.button}</div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @param keys The items' keys, in priority order: the last ones leave first.
 * @param options See {@link UseOverflowFitOptions}.
 */
export function useOverflowFit(
  keys: string[],
  { gap = 4, reserve = 28, compactable = false }: UseOverflowFitOptions = {}
): UseOverflowFitReturn {
  const signature = keys.join("|");
  const { ref, width } = useElementSize();
  const slots = useRef(new Map<string, HTMLElement>());
  const full = useRef(new Map<string, number>());
  const small = useRef(new Map<string, number>());
  const [fit, setFit] = useState(keys.length);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const widths = compact ? small : full;
    slots.current.forEach((el, key) => widths.current.set(key, el.offsetWidth));
    [full, small].forEach((map) =>
      map.current.forEach((_, key) => {
        if (!keys.includes(key)) map.current.delete(key);
      })
    );
    if (!width) return;

    // An item never rendered has no width yet: render them all once
    if (keys.some((key) => !widths.current.has(key))) {
      setFit(keys.length);
      return;
    }

    const totalOf = (map: Map<string, number>): number =>
      keys.reduce((sum, key) => sum + (map.get(key) ?? 0) + gap, -gap);
    const total = totalOf(widths.current);

    // Compact before folding, and back to full once full fits again
    if (compactable && !compact && total > width) {
      setCompact(true);
      setFit(keys.length);
      return;
    }
    if (
      compact &&
      (!compactable ||
        (keys.every((key) => full.current.has(key)) &&
          totalOf(full.current) <= width))
    ) {
      setCompact(false);
      setFit(keys.length);
      return;
    }

    let next = keys.length;
    if (total > width) {
      const room = width - reserve - (reserve ? gap : 0);
      let used = 0;
      next = 0;
      while (
        next < keys.length &&
        used + (widths.current.get(keys[next]) ?? 0) <= room
      ) {
        used += (widths.current.get(keys[next]) ?? 0) + gap;
        next += 1;
      }
    }
    setFit(next);
    // `keys` follows `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, width, fit, compact, compactable, gap, reserve]);

  const itemRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) slots.current.set(key, el);
      else slots.current.delete(key);
    },
    []
  );

  return { ref, itemRef, fit: Math.min(fit, keys.length), compact };
}
