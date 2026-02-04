import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Text } from "@/components/Text";
import { ToastContainer } from "@/components/ToastContainer";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  IconColor,
  Radius,
  Shadow,
  TextColor,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

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
  [Variant.Primary]: textColorClass(TextColor.Primary),
  [Variant.Secondary]: textColorClass(TextColor.Secondary),
  [Variant.Success]: textColorClass(IconColor.Success),
  [Variant.Danger]: textColorClass(IconColor.Destructive),
  [Variant.Icon]: textColorClass(TextColor.Primary),
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
          radiusStyles(Radius.Md),
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
