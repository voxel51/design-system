/**
 * Copyright 2017-2026, Voxel51, Inc.
 *
 * A single clickable icon-button within a `Toolbar`.
 */

import { Button } from "@headlessui/react";
import {
  CSSProperties,
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  MouseEvent,
} from "react";

import radiusStyles from "@/styles/radius";
import {
  InteractiveColor,
  bgColorClass,
  BorderColor,
  ElementState,
  getColorCssVar,
  IconColor,
  Radius,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface ToolbarActionProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
> {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const toolbarActionClass = (
  isInteractive: boolean,
  className?: string
): string =>
  cn(
    "size-10 flex items-center justify-center transition-all",
    radiusStyles(Radius.Md),
    isInteractive &&
      bgColorClass(InteractiveColor.SecondaryHover, ElementState.Hover),
    "data-[disabled]:opacity-50",
    "data-[disabled]:cursor-not-allowed",
    "outline-none",
    "data-[focus]:ring-2",
    `data-[focus]:ring-[var(${getColorCssVar(BorderColor.Focus)})]`,
    "data-[focus]:ring-offset-1",
    className
  );

const iconClass = (active: boolean, isInteractive: boolean): string =>
  cn(
    "size-full flex items-center justify-center",
    active
      ? textColorClass(IconColor.Brand)
      : textColorClass(IconColor.Default),
    isInteractive && textColorClass(IconColor.Emphasis, ElementState.Hover)
  );

/**
 * A single clickable icon-button within a `Toolbar`.
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
 *   <BrushIcon />
 * </ToolbarAction>
 * ```
 */
export const ToolbarAction = forwardRef<HTMLButtonElement, ToolbarActionProps>(
  (
    {
      children,
      active = false,
      disabled = false,
      className,
      onClick,
      style,
      ...rest
    },
    ref
  ) => {
    const isInteractive = !disabled && !active;

    const activeStyle: CSSProperties | undefined = active
      ? {
          backgroundColor: `color-mix(in srgb, var(${getColorCssVar(IconColor.Brand)}) 20%, transparent)`,
        }
      : undefined;

    return (
      <Button
        ref={ref}
        disabled={disabled}
        aria-pressed={active}
        onClick={onClick}
        className={toolbarActionClass(isInteractive, className)}
        style={{ ...activeStyle, ...style }}
        {...rest}
      >
        <div className={iconClass(active, isInteractive)}>{children}</div>
      </Button>
    );
  }
);

ToolbarAction.displayName = "ToolbarAction";
