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
import { Descriptor, Spacing } from "@/types";

import { SortableListItem } from "./SortableListItem";

const gapStyles: Record<Spacing, string> = {
  [Spacing.None]: "gap-y-0",
  [Spacing.Xs]: "gap-y-xs",
  [Spacing.Sm]: "gap-y-sm",
  [Spacing.Md]: "gap-y-md",
  [Spacing.Lg]: "gap-y-lg",
  [Spacing.Xl]: "gap-y-xl",
};

export interface RichListProps extends HTMLAttributes<HTMLDivElement> {
  listItems: Descriptor<ListItemProps>[];
  draggable?: boolean;
  onSelected?: (selectedItems: string[]) => void;
  onOrderChange?: (newItems: Descriptor<ListItemProps>[]) => void;
  selected?: string[];
  spacing?: Spacing;
}

/**
 * A list-like component which renders a group of {@link ListItem} children.
 *
 * This component operates as both a controlled and uncontrolled component.
 * See `selected`/`onSelected` and `listItems`/`onOrderChange` for controlled behavior.
 *
 * @example
 * ```tsx
 * const MyComponent = ({openSettings}: {openSettings: (id: string) => void}) => {
 *   const items: Descriptor<ListItemProps>[] = useMemo(() => [
 *       {
 *         id: "1",
 *         data: {
 *           primaryContent: "First Item",
 *           secondaryContent: "First item description"
 *           actions: (
 *             <Button
 *               variant={Variant.Icon}
 *               aria-label="Settings"
 *               leadingIcon={SettingsIcon}
 *               onClick={() => openSettings("1")}
 *             />
 *           )
 *         },
 *       },
 *       {
 *         id: "2",
 *         data: {
 *           primaryContent: "Second Item",
 *           secondaryContent: "Second item description"
 *           actions: (
 *             <Button
 *               variant={Variant.Icon}
 *               aria-label="Settings"
 *               leadingIcon={SettingsIcon}
 *               onClick={() => openSettings("2")}
 *             />
 *           )
 *         },
 *       {
 *         id: "3",
 *         data: {
 *           primaryContent: "Third Item",
 *           secondaryContent: "Third item description"
 *           actions: (
 *             <Button
 *               variant={Variant.Icon}
 *               aria-label="Settings"
 *               leadingIcon={SettingsIcon}
 *               onClick={() => openSettings("3")}
 *             />
 *           )
 *         },
 *       },
 *     ],
 *     []
 *   );
 *
 *   return (
 *     <RichList listItems={items} />
 *   );
 * };
 * ```
 *
 * @param className `class` overrides to apply to the list's container.
 * @param listItems List of component descriptors which will be used to create {@link ListItem} child components.
 *  The order of this list dictates the order of the children from top to bottom.
 * @param draggable If `true`, allows reordering of children via dragging {@link ListItem} components.
 * @param onSelected Callback triggered when selection state changes.
 *  This callback includes a list of currently-selected descriptor IDs.
 * @param onOrderChange Callback triggered when {@link ListItem} ordering changes.
 *  This callback includes the descriptors in order from top to bottom.
 * @param selected List of descriptor IDs which should be selected; this allows for controlled selection behavior.
 * @param props Additional HTML properties to apply to the component.
 */
export const RichList: FC<RichListProps> = ({
  className,
  listItems,
  draggable = false,
  onSelected,
  onOrderChange,
  selected,
  spacing = Spacing.Md,
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
      className={clsx("flex flex-col", "w-full", gapStyles[spacing], className)}
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
