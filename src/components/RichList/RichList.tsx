import { FC, HTMLAttributes, useState } from "react";
import clsx from "clsx";
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
import { SortableListItem } from "./SortableListItem";
import { ListItemProps } from "@/components/ListItem";
import { Descriptor } from "@/types";

export interface RichListProps extends HTMLAttributes<HTMLDivElement> {
  listItems: Descriptor<ListItemProps>[];
  draggable?: boolean;
  onSelected?: (selectedItems: string[]) => void;
  onOrderChange?: (newItems: Descriptor<ListItemProps>[]) => void;
}

export const RichList: FC<RichListProps> = ({
  className,
  listItems,
  draggable = false,
  onSelected,
  onOrderChange,
  ...props
}) => {
  const [selected, setSelected] = useState<string[]>(() => []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onSelect = (itemId: string, isSelected: boolean) => {
    if (selected.includes(itemId)) {
      if (!isSelected) {
        const newSelectionState = selected.filter((v) => v !== itemId);
        setSelected(newSelectionState);
        onSelected?.(newSelectionState);
      }
    } else {
      if (isSelected) {
        const newSelectionState = [...selected, itemId];
        setSelected(newSelectionState);
        onSelected?.(newSelectionState);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = listItems.findIndex((item) => item.id === active.id);
      const newIndex = listItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(listItems, oldIndex, newIndex);
      onOrderChange?.(newItems);
    }
  };

  const listContent = listItems.map((descriptor) => (
    <SortableListItem
      key={descriptor.id}
      id={descriptor.id}
      disabled={!draggable}
      data-testid={descriptor.id}
      {...descriptor.data}
      canDrag={draggable && descriptor.data.canDrag !== false}
      selected={selected.includes(descriptor.id)}
      onSelected={(isSelected) => onSelect(descriptor.id, isSelected)}
    />
  ));

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
