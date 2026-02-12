import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ListItemProps } from "@/components/ListItem";
import { Descriptor } from "@/types";

import { SortableListItem } from "./SortableListItem";

export interface RichListProps extends HTMLAttributes<HTMLDivElement> {
  listItems: Descriptor<ListItemProps>[];
  draggable?: boolean;
  onSelected?: (selectedItems: string[]) => void;
  onOrderChange?: (newItems: Descriptor<ListItemProps>[]) => void;
  selected?: string[];
}

export const RichList: FC<RichListProps> = ({
  className,
  listItems,
  draggable = false,
  onSelected,
  onOrderChange,
  selected,
  ...props
}) => {
  // transientSelected contains the ID for each selected element in the list
  const [transientSelected, setTransientSelected] = useState<string[]>(
    () => []
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // allow for controlled selection behavior
  useEffect(() => {
    setTransientSelected([...(selected ?? [])]);
  }, [selected]);

  const onSelect = useCallback(
    (itemId: string, isSelected: boolean) => {
      if (transientSelected.includes(itemId)) {
        if (!isSelected) {
          // remove element
          const newSelectionState = transientSelected.filter(
            (v) => v !== itemId
          );
          setTransientSelected(newSelectionState);
          onSelected?.(newSelectionState);
        }
      } else {
        if (isSelected) {
          // add element
          const newSelectionState = [...transientSelected, itemId];
          setTransientSelected(newSelectionState);
          onSelected?.(newSelectionState);
        }
      }
    },
    [transientSelected, onSelected]
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = listItems.findIndex((item) => item.id === active.id);
      const newIndex = listItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(listItems, oldIndex, newIndex);
      onOrderChange?.(newItems);
    }
  };

  const listContent = useMemo(
    () =>
      listItems.map((descriptor) => (
        <SortableListItem
          key={descriptor.id}
          id={descriptor.id}
          disabled={!draggable}
          data-testid={descriptor.id}
          {...descriptor.data}
          canDrag={draggable && descriptor.data.canDrag !== false}
          selected={transientSelected.includes(descriptor.id)}
          onSelected={(isSelected) => onSelect(descriptor.id, isSelected)}
        />
      )),
    [listItems, draggable, onSelect, transientSelected]
  );

  return (
    <div
      className={clsx("flex flex-col", "w-full", "gap-y-md", className)}
      {...props}
    >
      {draggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={listItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {listContent}
          </SortableContext>
        </DndContext>
      ) : (
        listContent
      )}
    </div>
  );
};

RichList.displayName = "RichList";
