import clsx from "clsx";
import {
  forwardRef,
  HTMLAttributes,
  JSX,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { List, ListImperativeAPI, RowComponentProps } from "react-window";

import { ListItem, ListItemProps } from "@/components/ListItem";
import { Descriptor } from "@/types";

export interface VirtualizedRichListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * List of component descriptors which will be used to create {@link ListItem} child components.
   * The order of this list dictates the order of the children from top to bottom.
   */
  listItems: Descriptor<ListItemProps>[];
  /**
   * Explicit pixel height for the scroll container. Required because the
   * virtualized list must have a bounded height to measure its viewport.
   */
  height: number;
  /**
   * Row height in pixels. Either a fixed number applied to every row, or a
   * function called per index to support variable heights.
   */
  itemSize: number | ((index: number) => number);
  /**
   * Number of rows to render outside the visible window (above and below) to
   * reduce flicker while scrolling. Defaults to 5.
   */
  overscanCount?: number;
  /**
   * Callback triggered when selection state changes.
   * Receives the list of currently-selected descriptor IDs.
   */
  onSelected?: (selectedItems: string[]) => void;
  /**
   * List of descriptor IDs which should be selected; enables controlled
   * selection behavior.
   */
  selected?: string[];
}

type RowData = {
  items: Descriptor<ListItemProps>[];
  selected: string[];
  onSelect: (id: string, isSelected: boolean) => void;
};

const Row = ({
  index,
  style,
  items,
  selected,
  onSelect,
}: RowComponentProps<RowData>): JSX.Element => {
  const descriptor = items[index];
  return (
    <div style={style} data-testid={descriptor.id}>
      <ListItem
        {...descriptor.data}
        // Drag-and-drop is intentionally unsupported in the virtualized variant.
        canDrag={false}
        selected={selected.includes(descriptor.id)}
        onSelected={(isSelected) => onSelect(descriptor.id, isSelected)}
      />
    </div>
  );
};

/**
 * A virtualized sibling of {@link RichList} powered by `react-window`.
 *
 * Renders only the rows inside (viewport + overscan), making it suitable for
 * lists with hundreds to tens of thousands of items. Drag-and-drop is
 * intentionally unsupported because `@dnd-kit`'s `SortableContext` assumes all
 * sortable items are mounted, which virtualization violates. If drag-and-drop
 * is required, use {@link RichList} and accept the full-render cost.
 *
 * @example
 * ```tsx
 * <VirtualizedRichList
 *   listItems={items}
 *   height={400}
 *   itemSize={56}
 *   onSelected={(ids) => console.log(ids)}
 * />
 * ```
 *
 * @param listItems Descriptors to render.
 * @param height Explicit pixel height for the scroll container.
 * @param itemSize Row height in pixels (fixed number) or per-index function.
 * @param overscanCount Extra rows to render outside the viewport; defaults to 5.
 * @param onSelected Callback with the list of selected descriptor IDs.
 * @param selected Controlled selection — list of descriptor IDs to treat as selected.
 * @param className `class` overrides to apply to the list's container.
 * @param props Additional HTML properties to apply to the component.
 */
export const VirtualizedRichList = forwardRef<
  ListImperativeAPI,
  VirtualizedRichListProps
>((
  {
    className,
    listItems,
    height,
    itemSize,
    overscanCount = 5,
    onSelected,
    selected,
    style,
    ...props
  },
  ref
) => {
  const [transientSelected, setTransientSelected] = useState<string[]>(
    () => []
  );

  // Mirror RichList's controlled-selection behavior.
  useEffect(() => {
    setTransientSelected([...(selected ?? [])]);
  }, [selected]);

  const onSelect = useCallback(
    (itemId: string, isSelected: boolean) => {
      setTransientSelected((current) => {
        const alreadySelected = current.includes(itemId);
        if (alreadySelected && !isSelected) {
          const next = current.filter((v) => v !== itemId);
          onSelected?.(next);
          return next;
        }
        if (!alreadySelected && isSelected) {
          const next = [...current, itemId];
          onSelected?.(next);
          return next;
        }
        return current;
      });
    },
    [onSelected]
  );

  // Stable object for row props — new identity re-renders every mounted row.
  const rowProps = useMemo<RowData>(
    () => ({
      items: listItems,
      selected: transientSelected,
      onSelect,
    }),
    [listItems, transientSelected, onSelect]
  );

  const rowHeight = useMemo(() => {
    if (typeof itemSize === "number") {
      return itemSize;
    }
    // react-window v2 passes (index, rowProps) — we only need index.
    return (index: number) => itemSize(index);
  }, [itemSize]);

  return (
    <div
      className={clsx("w-full", className)}
      style={{ height, ...style }}
      {...props}
    >
      <List<RowData>
        listRef={ref as Ref<ListImperativeAPI>}
        rowComponent={Row}
        rowCount={listItems.length}
        rowHeight={rowHeight}
        rowProps={rowProps}
        overscanCount={overscanCount}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
});

VirtualizedRichList.displayName = "VirtualizedRichList";
