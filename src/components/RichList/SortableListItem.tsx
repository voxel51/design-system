import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListItem, ListItemProps } from "@/components/ListItem";

interface SortableListItemProps extends ListItemProps {
  id: string;
  disabled?: boolean;
}

export const SortableListItem: FC<SortableListItemProps> = ({
  id,
  disabled = false,
  ...props
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ListItem {...props} dragHandleListeners={listeners} />
    </div>
  );
};

SortableListItem.displayName = "SortableListItem";
