import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Checkbox } from "@/components/Checkbox";
import { DragHandleIcon } from "@/components/Icons/DragHandle";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  Radius,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  canSelect?: boolean;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
  canDrag?: boolean;
  dragHandleListeners?: SyntheticListenerMap;
  primaryContent?: ReactNode;
  secondaryContent?: ReactNode;
  actions?: ReactNode;
  additionalContent?: ReactNode;
}

/**
 * An item to be displayed in a list.
 *
 * @param canSelect If `true`, the component will include a {@link Checkbox} to enable selection.
 * @param selected Controls the selection state of the list item. If `canSelect` is not truthy, this has no effect.
 * @param onSelected Callback triggered when this item is selected.
 * @param canDrag If `true`, displays a {@link DragHandleIcon} to allow dragging this component.
 * @param dragHandleListeners Optional mapping of `listenerId: listener` for drag events.
 * @param primaryContent Primary content to display in the list item.
 * @param secondaryContent Secondary content to display in the list item.
 * @param actions Content to display as "actions" for the list item.
 *  This content will be pushed to the trailing edge of the list item.
 * @param additionalContent Additional content to display in the list item.
 *  This content will be placed between the `secondaryContent` and the `actions.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by the {@link RichList} component.
 */
export const ListItem: FC<ListItemProps> = ({
  canSelect = false,
  selected = false,
  onSelected = undefined,
  canDrag = false,
  dragHandleListeners,
  primaryContent = undefined,
  secondaryContent = undefined,
  actions = undefined,
  additionalContent = undefined,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col",
        "w-full",
        bgColorClass(BackgroundColor.Card2),
        radiusStyles(Radius.Sm),
        className
      )}
      {...props}
    >
      <div
        className={clsx(
          "flex flex-nowrap items-center justify-between",
          "w-full",
          "gap-x-lg"
        )}
      >
        <div className={clsx("flex flex-nowrap items-center", "gap-x-md")}>
          {canSelect && (
            <Checkbox
              checked={selected}
              onChange={(checked) => onSelected?.(checked)}
            />
          )}
          {canDrag && (
            <span
              className="flex align-items cursor-grab touch-none"
              {...dragHandleListeners}
            >
              <DragHandleIcon
                className={clsx("size-4", textColorClass(TextColor.Secondary))}
              />
            </span>
          )}
          <Text variant={TextVariant.Lg}>{primaryContent}</Text>
          <div
            className={clsx(
              "flex items-center",
              "text-md/7",
              textColorClass(TextColor.Secondary)
            )}
          >
            {secondaryContent}
          </div>
        </div>

        <span>{actions}</span>
      </div>
      {additionalContent && (
        <div
          className={clsx(
            "px-sm pb-3",
            // Align with primaryContent by adding margin for checkbox/drag handle
            canSelect && canDrag && "ml-12",
            canSelect && !canDrag && "ml-6",
            !canSelect && canDrag && "ml-6"
          )}
        >
          {additionalContent}
        </div>
      )}
    </div>
  );
};

ListItem.displayName = "ListItem";
