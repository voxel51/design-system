import { forwardRef, HTMLAttributes, useCallback } from "react";

import { Align, Justify, Orientation, Spacing } from "@/types";
import { cn } from "@/util/classes";
import { useScrollEdges } from "@/util/useScrollEdges";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  align?: Align;
  justify?: Justify;
  orientation?: Orientation;
  spacing?: Spacing;
  /** Lets children flow onto further lines when they do not fit on one. */
  wrap?: boolean;
  /** Keeps children on one line that scrolls sideways, with no scrollbar; children keep their width. */
  scroll?: boolean;
}

const alignStyles: Record<Align, string> = {
  [Align.Baseline]: "items-baseline",
  [Align.Center]: "items-center",
  [Align.End]: "items-end",
  [Align.Start]: "items-start",
};

const justifyStyles: Record<Justify, string> = {
  [Justify.Around]: "justify-around",
  [Justify.Between]: "justify-between",
  [Justify.Center]: "justify-center",
  [Justify.End]: "justify-end",
  [Justify.Evenly]: "justify-evenly",
  [Justify.Start]: "justify-start",
};

const spacingStyles: Record<Spacing, string> = {
  [Spacing.None]: "",
  [Spacing.Xs]: "gap-xs",
  [Spacing.Sm]: "gap-sm",
  [Spacing.Md]: "gap-md",
  [Spacing.Lg]: "gap-lg",
  [Spacing.Xl]: "gap-xl",
};

/**
 * A layout component which organizes children into a vertical or horizontal stack.
 *
 * @example
 * ```tsx
 * <Stack orientation="col" spacing="md">
 *   <Text>Top</Text>
 *   <Text>Middle</Text>
 *   <Text>Bottom</Text>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack orientation="row" spacing="md">
 *   <Text>Left</Text>
 *   <Text>Middle</Text>
 *   <Text>Right</Text>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack orientation="row" spacing="sm" scroll>
 *   <DropdownTrigger borderless>Status</DropdownTrigger>
 *   <DropdownTrigger borderless>Sort</DropdownTrigger>
 * </Stack>
 * ```
 * @example
 * ```tsx
 * <Stack orientation="row" align="center" justify="between">
 *   <Text>Left</Text>
 *   <Text>Middle</Text>
 *   <Text>Right</Text>
 * </Stack>
 * ```
 *
 * @param align Alignment of children along the stack's cross axis. See {@link Align}.
 * @param justify Justification of children along the stack's primary axis. See {@link Justify}.
 * @param orientation Orientation of the stack. See {@link Orientation}.
 * @param spacing Spacing between child components in the stack. See {@link Spacing}.
 * @param wrap If `true`, children flow onto further lines when they do not fit on one.
 * @param scroll If `true`, children stay on one line that scrolls sideways with a hidden scrollbar, each at its own width (filter pill rows on a phone). The edge with more content beyond it fades.
 * @param children Content which is wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      align,
      justify,
      orientation = Orientation.Row,
      spacing = Spacing.None,
      wrap = false,
      scroll = false,
      children,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const { ref: edgesRef, style: edgesStyle } = useScrollEdges();
    const ref = useCallback(
      (el: HTMLDivElement | null) => {
        if (scroll) edgesRef(el);
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      },
      [scroll, edgesRef, forwardedRef]
    );
    return (
      <div
        ref={ref}
        style={scroll ? { ...edgesStyle, ...style } : style}
        className={cn(
          "flex",
          orientation === Orientation.Column && "flex-col",
          spacingStyles[spacing],
          wrap && "flex-wrap",
          scroll &&
            "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0",
          align && alignStyles[align],
          justify && justifyStyles[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
