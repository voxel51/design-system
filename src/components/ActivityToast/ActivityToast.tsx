import type { FC, HTMLAttributes } from "react";
import { Text } from "@/components/Text";
import { ToastContainer } from "@/components/ToastContainer";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";
import { textColor } from "@/styles/text";
import radiusStyles from "@/styles/radius";

export interface ActivityToastProps extends HTMLAttributes<HTMLDivElement> {
  anchor?: Anchor;
  icon?: FC;
  message?: string;
  onClose?: () => void;
  open?: boolean;
  variant?: Variant;
}

export const ActivityToast: FC<ActivityToastProps> = ({
  anchor = Anchor.BottomRight,
  className,
  icon: Icon,
  message,
  onClose,
  open,
  variant = Variant.Primary,
  ...props
}) => (
  <ToastContainer open={open} anchor={anchor}>
    <div
      className={cn(
        "flex flex-nowrap",
        "gap-x-sm",
        "items-center",
        "py-2 pr-4 pl-3",
        "border",
        borderColorClass(BorderColor.Default),
        bgColorClass(BackgroundColor.Card1),
        radiusStyles(Radius.Md),
        className
      )}
      {...props}
    >
      {Icon && (
        <Text className="size-5" color={textColor(variant)}>
          <Icon />
        </Text>
      )}

      {message && <Text color={textColor(variant)}>{message}</Text>}
    </div>
  </ToastContainer>
);

ActivityToast.displayName = "ActivityToast";
