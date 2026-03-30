/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A single clickable icon-button within a `Toolbar`.
 */

import { Button } from "@headlessui/react";

import { ActionColor, bgColorClass, ElementState } from "@/types";
import { cn } from "@/util/classes";

export interface ToolbarActionProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * A single clickable icon-button within a `Toolbar`.
 *
 * @param active Whether the action is currently active/selected.
 * @param disabled Whether the action is disabled.
 * @param title Native title attribute for a basic tooltip. Callers can wrap with any tooltip component they prefer.
 * @param aria-label Accessible label for screen readers. Prefer this over `title` for a11y.
 * @param onClick Click handler.
 * @param children Icon content rendered inside the button.
 *
 * @example
 * ```tsx
 * <ToolbarAction active={tool === "brush"} onClick={() => setTool("brush")} aria-label="Brush">
 *   <BrushIcon />
 * </ToolbarAction>
 * ```
 */
export const ToolbarAction = ({
  children,
  active = false,
  disabled = false,
  title,
  "aria-label": ariaLabel,
  onClick,
}: ToolbarActionProps) => {
  const isInteractive = !disabled && !active;

  const toolbarActionClass = cn(
    "size-10 flex items-center justify-center",
    "rounded transition-all",
    "[&_svg]:text-xl",
    active
      ? "[&_svg]:text-[var(--color-content-icon-brand-accent)]"
      : "[&_svg]:text-[var(--color-content-icon-default)]",
    active
      ? "bg-[color-mix(in_srgb,var(--color-content-icon-brand-accent)_20%,transparent)]"
      : "bg-transparent",
    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    isInteractive &&
      bgColorClass(ActionColor.SecondaryHover, ElementState.Hover),
    isInteractive && "hover:[&_svg]:text-[var(--color-content-icon-emphasis)]",
    "outline-none",
    "data-[focus]:ring-2",
    "data-[focus]:ring-[var(--color-content-border-focus)]",
    "data-[focus]:ring-offset-1"
  );
  return (
    <Button
      disabled={disabled}
      aria-pressed={active}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      className={toolbarActionClass}
    >
      {children}
    </Button>
  );
};

ToolbarAction.displayName = "ToolbarAction";
