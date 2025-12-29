import type { FC, HTMLAttributes, ReactNode } from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import clsx from "clsx";
import { DragHandleIcon } from "@/components/Icons/DragHandle";
import { Text } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { Checkbox } from "@/components/Checkbox";

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  canSelect?: boolean;
  selected?: boolean;
  onSelected?: (selected: boolean) => void;
  canDrag?: boolean;
  dragHandleListeners?: SyntheticListenerMap;
  primaryContent?: ReactNode;
  secondaryContent?: ReactNode;
  actions?: ReactNode;
}

export const ListItem: FC<ListItemProps> = ({
  canSelect = false,
  selected = false,
  onSelected = undefined,
  canDrag = false,
  dragHandleListeners,
  primaryContent = undefined,
  secondaryContent = undefined,
  actions = undefined,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex flex-nowrap items-center justify-between",
        "gap-x-lg",
        "py-3 pr-3 pl-2",
        "bg-content-bg-card-2",
        "rounded-sm",
        "w-full",
        className
      )}
      {...props}
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
            <DragHandleIcon className="size-4 text-content-text-secondary" />
          </span>
        )}
        <Text variant={TextVariant.Lg}>{primaryContent}</Text>
        <Text variant={TextVariant.Md} color={TextColor.Secondary}>
          {secondaryContent}
        </Text>
      </div>

      <span>{actions}</span>
    </div>
  );
};

ListItem.displayName = "ListItem";
