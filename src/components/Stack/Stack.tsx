import { HTMLAttributes } from "react";
import Orientation from "@/types/orientation";
import { cn } from "@/util/classes";
import Spacing from "@/types/spacing";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  spacing?: Spacing;
}

const spacingStyles: Record<Spacing, string> = {
  [Spacing.Xs]: "gap-xs",
  [Spacing.Sm]: "gap-sm",
  [Spacing.Md]: "gap-md",
  [Spacing.Lg]: "gap-lg",
  [Spacing.Xl]: "gap-xl",
};

export const Stack: React.FC<StackProps> = ({
  orientation = Orientation.Row,
  spacing = Spacing.Sm,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex",
        orientation === Orientation.Column && "flex-col",
        spacingStyles[spacing]
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.displayName = "Stack";
