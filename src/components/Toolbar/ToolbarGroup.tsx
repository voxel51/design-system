/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A group of `ToolbarAction` items within a `Toolbar`.
 */

import React, { useContext } from "react";

import { Stack } from "@/components/Stack";
import { Align, Orientation, Spacing } from "@/types";
import { cn } from "@/util/classes";

import { OrientationContext } from "./context";

export interface ToolbarGroupProps {
  children: React.ReactNode;
  "aria-label"?: string;
}

/**
 * A group of `ToolbarAction` items within a `Toolbar`.
 *
 * Reads orientation from `OrientationContext` — no need to pass it explicitly.
 * A divider is automatically rendered after each group; the last group's divider is hidden.
 *
 * @param aria-label Accessible label for the group landmark.
 * @param children `ToolbarAction` items to render within the group.
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
  "aria-label": ariaLabel,
}: ToolbarGroupProps): React.ReactElement => {
  const orientation = useContext(OrientationContext);

  return (
    <Stack
      role="group"
      orientation={orientation}
      align={Align.Center}
      spacing={Spacing.Xs}
      aria-label={ariaLabel}
      className={cn(
        "group/toolbar-group",
        orientation !== Orientation.Column && "self-stretch"
      )}
    >
      {children}
      <div
        className={cn(
          orientation === Orientation.Column
            ? "h-px w-full my-0.5"
            : "w-px self-stretch mx-0.5",
          "bg-[var(--color-content-border-strong)]",
          "group-last/toolbar-group:hidden"
        )}
      />
    </Stack>
  );
};

ToolbarGroup.displayName = "ToolbarGroup";
