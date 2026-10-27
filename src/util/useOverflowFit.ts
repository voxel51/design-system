import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  capLabels,
  COLLAPSE_LABEL_ATTR,
  FULL_FIT,
  type OverflowRowFit,
} from "@/util/compact";
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
   * Lets the items shrink before any leave: their labels (marked
   * `data-collapse-label`, as `collapse="auto"` actions mark theirs) are cut,
   * widest first, down to `minLabel`; past that the items go compact
   * (icon-only). Default `false`.
   */
  compactable?: boolean;
  /** The narrowest a label is cut to before items go compact, in pixels. Default `40`. */
  minLabel?: number;
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
  /** The width labels are cut to, or `null`; only with `compactable`. */
  labelMax: number | null;
  /** `compact` and `labelMax` together, for `OverflowRowCompactContext`. */
  context: OverflowRowFit;
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
  {
    gap = 4,
    reserve = 28,
    compactable = false,
    minLabel = 40,
  }: UseOverflowFitOptions = {}
): UseOverflowFitReturn {
  const signature = keys.join("|");
  const { ref, width } = useElementSize();
  const slots = useRef(new Map<string, HTMLElement>());
  // items at full size, their labels' own widths, and items compact
  const full = useRef(new Map<string, number>());
  const labels = useRef(new Map<string, number>());
  const small = useRef(new Map<string, number>());
  const [state, setState] = useState({
    fit: keys.length,
    ...FULL_FIT,
  });
  // An item that changes size on its own (content arriving late) refits the
  // row. Each element is observed once: observing it again reports it again.
  const [resized, setResized] = useState(0);
  const observer = useRef<{
    resize: ResizeObserver;
    seen: WeakSet<HTMLElement>;
  } | null>(null);
  const watch = useCallback((el: HTMLElement): void => {
    const current = observer.current;
    if (!current || current.seen.has(el)) return;
    current.seen.add(el);
    current.resize.observe(el);
  }, []);
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return undefined;
    const resize = new ResizeObserver(() => setResized((n) => n + 1));
    observer.current = { resize, seen: new WeakSet() };
    slots.current.forEach(watch);
    return () => {
      resize.disconnect();
      observer.current = null;
    };
  }, [watch]);

  useLayoutEffect(() => {
    slots.current.forEach((el, key) => {
      if (state.compact) {
        small.current.set(key, el.offsetWidth);
      } else if (state.labelMax === null) {
        full.current.set(key, el.offsetWidth);
        const label = el.querySelector(`[${COLLAPSE_LABEL_ATTR}]`);
        labels.current.set(key, label?.scrollWidth ?? 0);
      }
    });
    [full, labels, small].forEach((map) =>
      map.current.forEach((_, key) => {
        if (!keys.includes(key)) map.current.delete(key);
      })
    );
    const all = keys.length;
    const set = (next: typeof state): void =>
      setState((prev) =>
        prev.fit === next.fit &&
        prev.compact === next.compact &&
        prev.labelMax === next.labelMax
          ? prev
          : next
      );
    // Unmeasured (hidden, or jsdom): show every item, including ones added
    // after the first render
    if (!width) {
      set({ fit: all, ...FULL_FIT });
      return;
    }
    const totalOf = (map: Map<string, number>): number =>
      keys.reduce((sum, key) => sum + (map.get(key) ?? 0) + gap, -gap);

    // An item never rendered at full size has no width yet: render them all
    if (keys.some((key) => !full.current.has(key))) {
      set({ fit: all, ...FULL_FIT });
      return;
    }
    const fullTotal = totalOf(full.current);
    if (fullTotal <= width) {
      set({ fit: all, ...FULL_FIT });
      return;
    }

    if (compactable) {
      // Cut the widest labels first, then go icon-only
      const labelMax = capLabels(
        keys.map((key) => labels.current.get(key) ?? 0),
        fullTotal - width,
        minLabel
      );
      if (labelMax !== null) {
        set({ fit: all, compact: false, labelMax });
        return;
      }
      if (keys.some((key) => !small.current.has(key))) {
        set({ fit: all, compact: true, labelMax: null });
        return;
      }
    }

    const widths = compactable ? small.current : full.current;
    let next = all;
    if (totalOf(widths) > width) {
      const room = width - reserve - (reserve ? gap : 0);
      let used = 0;
      next = 0;
      while (next < all && used + (widths.get(keys[next]) ?? 0) <= room) {
        used += (widths.get(keys[next]) ?? 0) + gap;
        next += 1;
      }
    }
    set({ fit: next, compact: compactable, labelMax: null });
    // `keys` follows `signature`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, width, state, resized, compactable, gap, reserve, minLabel]);

  const itemRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) {
        slots.current.set(key, el);
        watch(el);
      } else slots.current.delete(key);
    },
    [watch]
  );

  const { compact, labelMax } = state;
  const context = useMemo(() => ({ compact, labelMax }), [compact, labelMax]);
  return {
    ref,
    itemRef,
    fit: Math.min(state.fit, keys.length),
    compact,
    labelMax,
    context,
  };
}
