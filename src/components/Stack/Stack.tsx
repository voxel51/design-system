import { FC, HTMLAttributes } from "react";

import { Orientation, Spacing } from "@/types";
import { cn } from "@/util/classes";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  spacing?: Spacing;
}

const spacingStyles: Record<Spacing, string> = {
  [Spacing.None]: "",
  [Spacing.Xs]: "gap-xs",
  [Spacing.Sm]: "gap-sm",
  [Spacing.Md]: "gap-md",
  [Spacing.Lg]: "gap-lg",
  [Spacing.Xl]: "gap-xl",
};

export const Stack: FC<StackProps> = ({
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
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.displayName = "Stack";
