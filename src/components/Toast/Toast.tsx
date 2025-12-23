import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/util/classes";
import { Text } from "@/components/Text";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  Shadow,
  TextColor,
  Variant,
} from "@/types";
import clsx from "clsx";
import { ToastContainer } from "@/components/ToastContainer";
import shadowStyles from "@/styles/shadow";

export interface ToastProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  action?: ReactNode;
  anchor?: Anchor;
  description?: ReactNode;
  icon?: FC;
  open?: boolean;
  title?: ReactNode;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  [Variant.Primary]: "text-content-text-primary",
  [Variant.Secondary]: "text-content-text-secondary",
  [Variant.Success]: "text-semantic-success",
  [Variant.Danger]: "text-semantic-destructive",
};

export const Toast: FC<ToastProps> = ({
  action,
  anchor = Anchor.Bottom,
  className,
  description,
  icon: Icon,
  open,
  title,
  variant = Variant.Primary,
  ...props
}) => {
  return (
    <ToastContainer open={open} anchor={anchor}>
      <div
        className={cn(
          "flex flex-nowrap",
          "gap-x-md",
          "p-4",
          "rounded-md",
          bgColorClass(BackgroundColor.Card2),
          shadowStyles(Shadow.Md),
          className
        )}
        {...props}
      >
        {Icon && (
          <span className={clsx("size-5", variantStyles[variant])}>
            <Icon />
          </span>
        )}

        <div className="flex items-center gap-x-xl">
          <div className="flex flex-col">
            {title && <Text className="font-semibold">{title}</Text>}
            {description && (
              <Text color={TextColor.Secondary}>{description}</Text>
            )}
          </div>

          {action && (
            <div className="flex items-center justify-center">{action}</div>
          )}
        </div>
      </div>
    </ToastContainer>
  );
};
