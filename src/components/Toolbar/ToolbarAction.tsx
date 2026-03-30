/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A single clickable action button within a `Toolbar`.
 */

import { Button } from "@headlessui/react";

import { ActionColor, bgColorClass, ElementState } from "@/types";
import { cn } from "@/util/classes";

export interface ToolbarActionProps {
  children: React.ReactNode;
  /** Whether the action is currently active/selected. */
  active?: boolean;
  /** Whether the action is disabled. */
  disabled?: boolean;
  /**
   * Native title attribute for a basic tooltip. Callers can wrap with any
   * tooltip component they prefer.
   */
  title?: string;
  /** Accessible label for screen readers. Prefer this over `title` for a11y. */
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ToolbarAction = ({
  children,
  active = false,
  disabled = false,
  title,
  "aria-label": ariaLabel,
  onClick,
}: ToolbarActionProps) => {
  return (
    <Button
      disabled={disabled}
      aria-pressed={active}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      className={cn(
        "w-10 h-10 flex items-center justify-center",
        "rounded transition-all",
        // icon sizing — scoped to svg to avoid conflict with global button styles
        "[&_svg]:text-xl",
        // icon color — scoped to svg to override global `button { color: ... }` rule
        active
          ? "[&_svg]:text-[var(--color-content-icon-brand-accent)]"
          : "[&_svg]:text-[var(--color-content-icon-default)]",
        // background
        active ? "bg-[rgba(255,153,80,0.2)]" : "bg-transparent",
        // hover (only when not disabled and not active)
        "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
        !disabled &&
          !active &&
          bgColorClass(ActionColor.SecondaryHover, ElementState.Hover),
        !disabled &&
          !active &&
          "hover:[&_svg]:text-[var(--color-content-icon-emphasis)]",
        // focus ring — use CSS var directly so Tailwind JIT can see the full class
        "outline-none",
        "data-[focus]:ring-2",
        "data-[focus]:ring-[var(--color-content-border-focus)]",
        "data-[focus]:ring-offset-1"
      )}
    >
      {children}
    </Button>
  );
};

ToolbarAction.displayName = "ToolbarAction";
