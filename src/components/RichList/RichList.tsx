import { FC, HTMLAttributes, useState } from "react";
import clsx from "clsx";
import { ListItem, ListItemProps } from "@/components/ListItem";
import { Descriptor } from "@/types";

export interface RichListProps extends HTMLAttributes<HTMLDivElement> {
  listItems: Descriptor<ListItemProps>[];
  onSelected?: (selectedItems: string[]) => void;
  onOrderChange?: (newItems: Descriptor<ListItemProps>[]) => void;
}

export const RichList: FC<RichListProps> = ({
  className,
  listItems,
  onSelected,
  onOrderChange,
  ...props
}) => {
  // selected contains the ID for each selected element in the list
  const [selected, setSelected] = useState<string[]>(() => []);

  const onSelect = (itemId: string, isSelected: boolean) => {
    if (selected.includes(itemId)) {
      if (!isSelected) {
        // remove element
        const newSelectionState = selected.filter((v) => v !== itemId);
        setSelected(newSelectionState);
        onSelected?.(newSelectionState);
      }
    } else {
      if (isSelected) {
        // add element
        const newSelectionState = [...selected, itemId];
        setSelected(newSelectionState);
        onSelected?.(newSelectionState);
      }
    }
  };

  return (
    <div
      className={clsx("flex flex-col", "w-full", "gap-y-md", className)}
      {...props}
    >
      {listItems.map((descriptor) => (
        <ListItem
          key={descriptor.id}
          data-testid={descriptor.id}
          {...descriptor.data}
          selected={selected.includes(descriptor.id)}
          onSelected={(isSelected) => onSelect(descriptor.id, isSelected)}
        />
      ))}
    </div>
  );
};

RichList.displayName = "RichList";
