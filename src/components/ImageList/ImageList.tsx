import {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { Spinner } from "@/components/Spinner";
import { Descriptor, Orientation, Size } from "@/types";
import { cn } from "@/util/classes";

export interface ImageListProps<
  T = unknown,
> extends HTMLAttributes<HTMLDivElement> {
  /** Items to display in the grid. */
  items: Descriptor<T>[];
  /** Renders the content of each grid cell. */
  renderItem: (data: T, id: string) => ReactNode;
  /**
   * Number of columns for vertical orientation, or number of rows for
   * horizontal orientation. Defaults to `3`.
   */
  cols?: number;
  /** Gap between cells in pixels. Defaults to `8`. */
  gap?: number;
  /**
   * Controls the scroll axis.
   * - `Orientation.Column` (default) — items flow into columns; the list
   *   scrolls **vertically**.
   * - `Orientation.Row` — items flow into rows; the list scrolls
   *   **horizontally**.
   */
  orientation?: Orientation;
  /**
   * Fixed height of each row in pixels for vertical orientation.
   * Defaults to `164`.
   */
  rowHeight?: number;
  /**
   * Fixed width of each auto-generated column in pixels for horizontal
   * orientation. Defaults to `164`.
   */
  colWidth?: number;
  /**
   * Called when the sentinel element near the end of the list becomes
   * visible. Use this to fetch and append more items.
   */
  onLoadMore?: () => void;
  /** Set to `true` while loading additional items. */
  hasMore?: boolean;
  /** Displays a {@link Spinner} in the sentinel area while `true`. */
  loading?: boolean;
}

/**
 * A scrollable grid that lays items out in a uniform, non-masonry grid.
 * Supports vertical and horizontal scroll directions and infinite scroll
 * via `onLoadMore`.
 *
 * @example
 * ```tsx
 * <ImageList
 *   items={photos.map((p) => ({ id: p.id, data: p }))}
 *   renderItem={(photo) => (
 *     <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
 *   )}
 *   cols={3}
 *   rowHeight={200}
 *   onLoadMore={fetchMore}
 *   hasMore={hasMore}
 *   loading={loading}
 * />
 * ```
 */
export function ImageList<T = unknown>({
  items,
  renderItem,
  cols = 3,
  gap = 8,
  orientation = Orientation.Column,
  rowHeight = 164,
  colWidth = 164,
  onLoadMore,
  hasMore = false,
  loading = false,
  className,
  style,
  ...rest
}: ImageListProps<T>): ReactElement {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !onLoadMore) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
      rootMargin: "200px",
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection, onLoadMore]);

  const isVertical = orientation === Orientation.Column;

  const gridStyle: CSSProperties = isVertical
    ? {
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
        gap: `${gap}px`,
      }
    : {
        gridTemplateRows: `repeat(${cols}, 1fr)`,
        gridAutoFlow: "column",
        gridAutoColumns: `${colWidth}px`,
        gap: `${gap}px`,
      };

  const sentinelStyle: CSSProperties = isVertical
    ? { gridColumn: "1 / -1" }
    : { gridRow: "1 / -1" };

  return (
    <div
      className={cn(
        "grid",
        isVertical
          ? "overflow-y-auto overflow-x-hidden"
          : "overflow-x-auto overflow-y-hidden",
        className
      )}
      style={{ ...gridStyle, ...style }}
      {...rest}
    >
      {items.map(({ id, data }) => (
        <div key={id} className="overflow-hidden">
          {renderItem(data, id)}
        </div>
      ))}

      {onLoadMore && (
        <div
          ref={sentinelRef}
          style={sentinelStyle}
          className="flex items-center justify-center py-2"
        >
          {loading && <Spinner size={Size.Lg} />}
        </div>
      )}
    </div>
  );
}

ImageList.displayName = "ImageList";
