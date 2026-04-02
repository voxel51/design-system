/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A single clickable icon-button within a `Toolbar`.
 */

import { Button } from "@headlessui/react";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  MouseEvent,
} from "react";

import { ActionColor, bgColorClass, ElementState, getColorCssVar, IconColor, Radius } from "@/types";
import { cn } from "@/util/classes";
import radiusStyles from "@/styles/radius";

export interface ToolbarActionProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
> {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

const toolbarActionClass = (
  active: boolean,
  isInteractive: boolean,
  className?: string
): string =>
  cn(
    "size-10 flex items-center justify-center",
    radiusStyles(Radius.Md),
    "transition-all",
    active
      ? cn(
          `[--toolbar-action-icon-color:var(${getColorCssVar(IconColor.BrandAccent)})]`,
          `bg-[color-mix(in_srgb,var(${getColorCssVar(IconColor.BrandAccent)})_20%,transparent)]`
        )
      : cn(
          `[--toolbar-action-icon-color:var(${getColorCssVar(IconColor.Default)})]`,
          "bg-transparent"
        ),
    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    isInteractive &&
      cn(
        bgColorClass(ActionColor.SecondaryHover, ElementState.Hover),
        "hover:[--toolbar-action-icon-color:var(--color-content-icon-emphasis)]"
      ),
    "outline-none",
    "data-[focus]:ring-2",
    "data-[focus]:ring-[var(--color-content-border-focus)]",
    "data-[focus]:ring-offset-1",
    className
  );

/**
 * A single clickable icon-button within a `Toolbar`.
 *
 * This component intentionally does not style its children. It sets
 * `--toolbar-action-icon-color` as a CSS custom property on the button element so
 * that children can opt in to state-aware coloring by consuming it:
 *
 * ```tsx
 * // SVG icon (e.g. a React component)
 * <BrushIcon className="text-[var(--toolbar-action-icon-color)]" />
 *
 * // Font Awesome icon eg: not an SVG icon
 * <i className="fa fa-gear" style={{ color: "var(--toolbar-action-icon-color)" }} />
 * ```
 *
 * Children that do not consume `--toolbar-action-icon-color` are unaffected and may
 * apply their own styles freely.
 *
 * @param active Whether the action is currently active/selected.
 * @param disabled Whether the action is disabled.
 * @param title Native title attribute for a basic tooltip. Callers can wrap with any tooltip component they prefer.
 * @param aria-label Accessible label for screen readers. Prefer this over `title` for a11y.
 * @param className Optional additional classes to apply to the button.
 * @param onClick Click handler.
 * @param children Icon content rendered inside the button.
 *
 * @example
 * ```tsx
 * <ToolbarAction active={tool === "brush"} onClick={() => setTool("brush")} aria-label="Brush">
 *   <BrushIcon className="text-[var(--toolbar-action-icon-color)]" />
 * </ToolbarAction>
 * ```
 */
export const ToolbarAction = forwardRef<HTMLButtonElement, ToolbarActionProps>(
  (
    {
      children,
      active = false,
      disabled = false,
      "aria-label": ariaLabel,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    const isInteractive = !disabled && !active;
    return (
      <Button
        ref={ref}
        disabled={disabled}
        aria-pressed={active}
        aria-label={ariaLabel}
        onClick={onClick}
        className={toolbarActionClass(active, isInteractive, className)}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

ToolbarAction.displayName = "ToolbarAction";
