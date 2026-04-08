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
  getColorCssVar,
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
    <Stack
      role="group"
      orientation={orientation}
      align={Align.Center}
      spacing={Spacing.Xs}
      className={cn(
        "group/toolbar-group",
        orientation !== Orientation.Column && "self-stretch",
        className
      )}
      {...props}
    >
      {children}
      <div
        className={cn(
          orientation === Orientation.Column
            ? "h-px w-full my-0.5"
            : "w-px self-stretch mx-0.5",
          `bg-[var(${getColorCssVar(BorderColor.Strong)})]`,
          "group-last/toolbar-group:hidden"
        )}
      />
    </Stack>
  );
};

ToolbarGroup.displayName = "ToolbarGroup";
