import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Checkbox } from "@/components/Checkbox";
import { GripVerticalIcon } from "@/components/Icons/icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  IconColor,
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
 * @param canDrag If `true`, displays a 14px grip handle to allow dragging this component.
 * @param dragHandleListeners Optional mapping of `listenerId: listener` for drag events.
 * @param primaryContent Primary content to display in the list item. One line: it truncates with an ellipsis
 *  (full text in a tooltip when cut, when a string), up to 70% of the row when there is secondary content, after that content has given up its space.
 * @param secondaryContent Secondary content to display in the list item. A string is one line and truncates
 *  with an ellipsis (full text in a tooltip when cut); a node must handle its own overflow with `min-width: 0`.
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
              <GripVerticalIcon
                size={14}
                className={textColorClass(IconColor.Subtle)}
              />
            </span>
          )}
          <div
            className={cn(
              "min-w-0",
              !!secondaryContent && "max-w-[70%] shrink-0"
            )}
          >
            <Text
              variant={
                size === Size.Sm
                  ? TextVariant.BodySecondary
                  : TextVariant.BodyPrimary
              }
              className="min-w-0"
              truncate={typeof primaryContent === "string"}
            >
              {primaryContent}
            </Text>
          </div>
          <div
            className={cn(
              "flex min-w-0 shrink items-center",
              TEXT_STYLES[
                size === Size.Sm
                  ? TextVariant.BodyTertiary
                  : TextVariant.BodySecondary
              ],
              textColorClass(TextColor.Secondary)
            )}
          >
            {typeof secondaryContent === "string" ? (
              <Text
                variant={
                  size === Size.Sm
                    ? TextVariant.BodyTertiary
                    : TextVariant.BodySecondary
                }
                color={TextColor.Secondary}
                truncate
              >
                {secondaryContent}
              </Text>
            ) : (
              secondaryContent
            )}
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
