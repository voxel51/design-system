/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A group of `ToolbarAction` items within a `Toolbar`.
 */

import { HTMLAttributes, JSX, ReactNode } from "react";

import { Stack } from "@/components/Stack";
import {
  Align,
  BorderColor,
  borderColorClass,
  Orientation,
  Spacing,
} from "@/types";
import { cn } from "@/util/classes";

import { useOrientationContext } from "./context";

export interface ToolbarGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children: ReactNode;
}

/**
 * A group of `ToolbarAction` items within a `Toolbar`.
 *
 * Reads orientation from `OrientationContext` — no need to pass it explicitly.
 * A divider is automatically rendered after each group; the last group's divider is hidden.
 *
 * @param children `ToolbarAction` items to render within the group.
 * @param props Additional `HTMLDivElement` attributes (e.g. `data-testid`, `aria-label`) forwarded to the root element.
 *
 * @example
 * ```tsx
 * <ToolbarGroup aria-label="Draw">
 *   <ToolbarAction active={tool === "brush"} onClick={() => setTool("brush")}>
 *     <BrushIcon />
 *   </ToolbarAction>
 * </ToolbarGroup>
 * ```
 */
export const ToolbarGroup = ({
  children,
  className,
  ...props
}: ToolbarGroupProps): JSX.Element => {
  const orientation = useOrientationContext();

  return (
    <div
      className={cn(
        `group/toolbar-group flex gap-${Spacing.Xs}`,
        orientation === Orientation.Column
          ? "w-full flex-col"
          : "h-full flex-row"
      )}
    >
      <Stack
        role="group"
        orientation={orientation}
        align={Align.Center}
        spacing={Spacing.Xs}
        className={cn(
          "flex-1",
          orientation !== Orientation.Column && "self-stretch",
          className
        )}
        {...props}
      >
        {children}
      </Stack>
      <div
        role="separator"
        className={cn(
          orientation === Orientation.Column
            ? "w-full my-0.5 border-t-1"
            : "h-full mx-0.5 border-l-1",
          borderColorClass(BorderColor.Strong),
          "group-last/toolbar-group:hidden"
        )}
      />
    </div>
  );
};

ToolbarGroup.displayName = "ToolbarGroup";
