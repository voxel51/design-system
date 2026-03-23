import { FC, HTMLAttributes } from "react";

import { Align, Justify, Orientation, Spacing } from "@/types";
import { cn } from "@/util/classes";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  align?: Align;
  justify?: Justify;
  orientation?: Orientation;
  spacing?: Spacing;
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
 * <Stack orientation={Orientation.Vertical} spacing={Spacing.Md}>
 *   <Text>Top</Text>
 *   <Text>Middle</Text>
 *   <Text>Bottom</Text>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack orientation={Orientation.Horizontal} spacing={Spacing.Md}>
 *   <Text>Left</Text>
 *   <Text>Middle</Text>
 *   <Text>Right</Text>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack orientation={Orientation.Horizontal} align={Align.Center} justify={Justify.Between}>
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
 * @param children Content which is wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const Stack: FC<StackProps> = ({
  align,
  justify,
  orientation = Orientation.Row,
  spacing = Spacing.None,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex",
        orientation === Orientation.Column && "flex-col",
        spacingStyles[spacing],
        align && alignStyles[align],
        justify && justifyStyles[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.displayName = "Stack";
