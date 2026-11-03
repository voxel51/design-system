import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Checkbox } from "@/components/Checkbox";
import { DragHandleGripIcon } from "@/components/Icons/DragHandle";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

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
  size?: Size.Sm | Size.Md;
}

/**
 * An item to be displayed in a list.
 *
 * @param canSelect If `true`, the component will include a {@link Checkbox} to enable selection.
 * @param selected Controls the selection state of the list item. If `canSelect` is not truthy, this has no effect.
 * @param onSelected Called when the checkbox toggles, with the new selected state.
 * @param canDrag If `true`, displays a {@link DragHandleGripIcon} to allow dragging this component.
 * @param dragHandleListeners Optional mapping of `listenerId: listener` for drag events.
 * @param primaryContent Primary content to display in the list item.
 * @param secondaryContent Secondary content to display in the list item.
 * @param actions Content to display as "actions" for the list item.
 *  This content will be pushed to the trailing edge of the list item.
 * @param additionalContent Additional content to display in the list item.
 *  Rendered below the main row, indented to line up with `primaryContent`.
 * @param size `"sm"` is the dense row (8px tall padding, 14px name, 12px
 *  detail, small checkbox); `"md"` (default) the roomy one.
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
  size = Size.Md,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        "w-full",
        size === Size.Sm ? "py-2 pl-3.5 pr-2" : "py-3 px-3.5",
        bgColorClass(BackgroundColor.CardNested),
        radiusStyles(Radius.Sm),
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-nowrap items-center justify-between",
          "w-full",
          "gap-x-lg"
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-nowrap items-center",
            size === Size.Sm ? "gap-x-sm" : "gap-x-md"
          )}
        >
          {canSelect && (
            <Checkbox
              size={size === Size.Sm ? Size.Sm : Size.Md}
              checked={selected}
              onChange={(checked) => onSelected?.(checked)}
            />
          )}
          {canDrag && (
            <span
              className="flex align-items cursor-grab touch-none"
              {...dragHandleListeners}
            >
              <DragHandleGripIcon
                className={cn("size-4", textColorClass(TextColor.Secondary))}
              />
            </span>
          )}
          <Text
            variant={
              size === Size.Sm
                ? TextVariant.BodySecondary
                : TextVariant.BodyPrimary
            }
            className="min-w-0"
          >
            {primaryContent}
          </Text>
          <div
            className={cn(
              "flex min-w-0 items-center",
              TEXT_STYLES[
                size === Size.Sm
                  ? TextVariant.BodyTertiary
                  : TextVariant.BodySecondary
              ],
              textColorClass(TextColor.Secondary)
            )}
          >
            {secondaryContent}
          </div>
        </div>

        <span
          className={cn(
            "flex shrink-0 flex-nowrap items-center",
            size === Size.Sm ? "gap-x-xs" : "gap-x-sm",
            // Action affordances (e.g. icon Buttons) read as light grey, not white.
            textColorClass(TextColor.Secondary)
          )}
        >
          {actions}
        </span>
      </div>
      {additionalContent && (
        <div
          className={cn(
            "px-sm py-3",
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
