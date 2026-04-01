import type { FC, HTMLAttributes } from "react";

import { Text, TextProps } from "@/components/Text";
import {
  bgColorClass,
  Orientation,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  label?: string;
  textProps?: TextProps;
}

interface LineProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
}

/**
 * A divider component used to separate content.
 * This is an alias for {@link Text} with {@link TextVariant.Xxs}.
 *
 * @param orientation A value used to determine whether to display the divider.
 * @param label The label to display on the divider.
 * @param props Additional HTML properties to apply to the component.
 *
 */
export const Divider: FC<DividerProps> = ({
  orientation,
  label,
  textProps,
  ...props
}) => {
  const isColumn = orientation === Orientation.Column;

  return (
    <div
      className={cn("flex items-center", isColumn ? "flex-col h-full" : "")}
      {...props}
    >
      <Line orientation={orientation} data-testid="divider-line-before" />
      {label && (
        <>
          <Text
            color={TextColor.Primary}
            variant={TextVariant.Caption}
            className={cn(
              isColumn ? "my-1" : "mx-2",
              textColorClass(TextColor.Primary)
            )}
            data-testid="divider-label"
            {...textProps}
          >
            {label}
          </Text>
          <Line orientation={orientation} data-testid="divider-line-after" />
        </>
      )}
    </div>
  );
};

const Line: FC<LineProps> = ({ orientation, ...props }) => {
  const isColumn = orientation === Orientation.Column;

  return (
    <div
      className={cn(
        bgColorClass(TextColor.Placeholder),
        isColumn ? "w-px h-full" : "h-px flex-1"
      )}
      {...props}
    />
  );
};

Divider.displayName = "Divider";
