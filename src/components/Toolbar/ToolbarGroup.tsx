/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A labelled group of `ToolbarAction` items within a `Toolbar`.
 */

import { useContext } from "react";

import { TextColor, textColorClass } from "@/types";
import { cn } from "@/util/classes";

import { Orientation, OrientationContext } from "./context";

export interface ToolbarGroupProps {
  children: React.ReactNode;
  /** Optional label rendered above (vertical) or before (horizontal) the group. */
  label?: string;
  /** Accessible label for the group. */
  "aria-label"?: string;
}

export const ToolbarGroup = ({
  children,
  label,
  "aria-label": ariaLabel,
}: ToolbarGroupProps) => {
  const orientation = useContext(OrientationContext);
  const isVertical = orientation === Orientation.Column;

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "group/toolbar-group flex items-center gap-1.5",
        isVertical ? "flex-col" : "flex-row self-stretch"
      )}
    >
      {label && (
        <span
          className={cn(
            "text-[9px] font-semibold uppercase tracking-[0.3px] text-center",
            isVertical ? "mb-0.5" : "mr-0.5",
            textColorClass(TextColor.Secondary)
          )}
        >
          {label}
        </span>
      )}
      {children}
      <div
        className={cn(
          isVertical ? "h-px w-full my-0.5" : "w-px self-stretch mx-0.5",
          "bg-[var(--color-content-border-strong)]",
          "group-last/toolbar-group:hidden"
        )}
      />
    </div>
  );
};

ToolbarGroup.displayName = "ToolbarGroup";
