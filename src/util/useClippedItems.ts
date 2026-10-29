import { useEffect, useState } from "react";

/** Options for {@link useClippedItems}. */
export interface UseClippedItemsOptions {
  /** Where the visible part of the row ends, if not at its right edge: controls held over its end. */
  end?: HTMLElement | null;
  /** The key of an item to scroll into the visible part first, such as the active tab. */
  activeKey?: string;
  /** Changes when the items do, so they are observed again. */
  count?: number;
}

/**
 * Hook that reports which items of a horizontally scrolling row lie outside
 * its visible part, so a menu can offer them, as a browser's tab list does.
 * Items are the row's children with a `data-clip-key` attribute; the active
 * item is scrolled into view first.
 *
 * @example
 * ```tsx
 * const [row, setRow] = useState<HTMLElement | null>(null);
 * const clipped = useClippedItems(row, { activeKey: active, count: tabs.length });
 * return (
 *   <div ref={setRow} className="flex overflow-hidden">
 *     {tabs.map((t) => <Tab key={t.id} data-clip-key={t.id} />)}
 *   </div>
 * );
 * ```
 *
 * @param row The scrolling row, or `null` before it mounts.
 * @param options See {@link UseClippedItemsOptions}.
 */
export function useClippedItems(
  row: HTMLElement | null,
  { end, activeKey, count }: UseClippedItemsOptions = {}
): string[] {
  const [clipped, setClipped] = useState<string[]>([]);

  useEffect(() => {
    if (!row) return undefined;
    const items = (): HTMLElement[] =>
      [...row.children].filter(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && el.dataset.clipKey !== undefined
      );
    const bounds = (): { left: number; right: number } => ({
      left: row.getBoundingClientRect().left,
      right: (end ?? row).getBoundingClientRect()[end ? "left" : "right"],
    });
    const update = (): void => {
      const active = items().find((el) => el.dataset.clipKey === activeKey);
      if (active) {
        const { left, right } = bounds();
        const box = active.getBoundingClientRect();
        if (box.right > right) row.scrollLeft += box.right - right;
        else if (box.left < left) row.scrollLeft -= left - box.left;
      }
      const { left, right } = bounds();
      const next = items()
        .filter((el) => {
          const box = el.getBoundingClientRect();
          return box.left < left - 1 || box.right > right + 1;
        })
        .map((el) => el.dataset.clipKey as string);
      setClipped((prev) => (prev.join() === next.join() ? prev : next));
    };
    const observer = new ResizeObserver(update);
    observer.observe(row);
    // controls that appear over the end narrow the visible part
    if (end) observer.observe(end);
    items().forEach((el) => observer.observe(el));
    update();
    return () => observer.disconnect();
  }, [row, end, activeKey, count]);

  return clipped;
}
