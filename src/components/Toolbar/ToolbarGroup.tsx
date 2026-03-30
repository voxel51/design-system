/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A labelled group of `ToolbarAction` items within a `Toolbar`.
 */

import { useContext } from "react";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Align, Spacing, TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { Orientation, OrientationContext } from "./context";

export interface ToolbarGroupProps {
  children: React.ReactNode;
  label?: string;
  "aria-label"?: string;
}

/**
 * A labelled group of `ToolbarAction` items within a `Toolbar`.
 *
 * Reads orientation from `OrientationContext` — no need to pass it explicitly.
 * A divider is automatically rendered after each group; the last group's divider is hidden.
 *
 * @param label Optional label rendered above (vertical) or before (horizontal) the group.
 * @param aria-label Accessible label for the group landmark.
 * @param children `ToolbarAction` items to render within the group.
 *
 * @example
 * ```tsx
 * <ToolbarGroup label="Draw">
 *   <ToolbarAction active={tool === "brush"} onClick={() => setTool("brush")}>
 *     <BrushIcon />
 *   </ToolbarAction>
 * </ToolbarGroup>
 * ```
 */
export const ToolbarGroup = ({
  children,
  label,
  "aria-label": ariaLabel,
}: ToolbarGroupProps) => {
  const orientation = useContext(OrientationContext);

  return (
    <Stack
      role="group"
      orientation={orientation}
      align={Align.Center}
      spacing={Spacing.Xs}
      aria-label={ariaLabel}
      className={cn("group/toolbar-group", orientation !== Orientation.Column && "self-stretch")}
    >
      {label && (
        <Text
          variant={TextVariant.Label}
          color={TextColor.Secondary}
          className={cn(
            "text-[10px] text-center",
            orientation === Orientation.Column ? "mb-0.5" : "mr-0.5"
          )}
        >
          {label}
        </Text>
      )}
      {children}
      <div
        className={cn(
          orientation === Orientation.Column ? "h-px w-full my-0.5" : "w-px self-stretch mx-0.5",
          "bg-[var(--color-content-border-strong)]",
          "group-last/toolbar-group:hidden"
        )}
      />
    </Stack>
  );
};

ToolbarGroup.displayName = "ToolbarGroup";
