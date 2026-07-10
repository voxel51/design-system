import type { FC, HTMLAttributes } from "react";

import { type IconProps, IconWrapper } from "@/components/Icons";
import { Text } from "@/components/Text";
import { ToastContainer } from "@/components/ToastContainer";
import radiusStyles from "@/styles/radius";
import { textColor } from "@/styles/text";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

export interface ActivityToastProps extends HTMLAttributes<HTMLDivElement> {
  anchor?: Anchor;
  icon?: FC<IconProps>;
  message?: string;
  open?: boolean;
  variant?: Variant;
}

/**
 * A component which renders simple toast-style notifications.
 *
 * This component is best suited for non-interactive, ephemeral notifications.
 *
 * See also {@link Toast}.
 *
 * @example
 * ```tsx
 * <ActivityToast
 *   open={true}
 *   icon={CheckIcon}
 *   message={"Operation successful"}
 *   variant={Variant.Success}
 * />
 * ```
 *
 * @param anchor Position within the viewport to anchor the notification.
 *  Options include all cardinal directions as well as all four corners.
 * @param className `class` overrides to apply to the component.
 * @param icon Icon component which prefixes the toast message.
 * @param message Message to include in the toast.
 * @param open Boolean controlling whether the toast is visible.
 * @param variant The toast variant; this controls the general styling of the toast. See {@link Variant}.
 * @param props Additional HTML properties to apply to the component.
 */
export const ActivityToast: FC<ActivityToastProps> = ({
  anchor = Anchor.BottomRight,
  className,
  icon,
  message,
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
      <IconWrapper
        content={icon}
        className={cn("size-5", textColorClass(textColor(variant)!))}
      />

      {message && <Text color={textColor(variant)}>{message}</Text>}
    </div>
  </ToastContainer>
);

ActivityToast.displayName = "ActivityToast";
