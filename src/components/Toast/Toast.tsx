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

type ToastVariant = Exclude<Variant, Variant.Borderless>;

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
  variant?: ToastVariant;
}

const variantStyles: Record<ToastVariant, string> = {
  [Variant.Primary]: textColorClass(TextColor.Primary),
  [Variant.Secondary]: textColorClass(TextColor.Secondary),
  [Variant.Success]: textColorClass(IconColor.Success),
  [Variant.Danger]: textColorClass(IconColor.Destructive),
  [Variant.Icon]: textColorClass(TextColor.Primary),
};

/**
 * A toast component with opinionated slots for content.
 *
 * See also {@link ActivityToast}.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [open, setOpen] = useState<boolean>(true);
 *
 *   return (
 *     <Toast
 *       open={open}
 *       title="Message sent"
 *       description="You will be notified when the recipient opens your message"
 *       icon={() => <Icon name={IconName.Check} />}
 *       action={
 *         <Button onClick={() => setOpen(false)}>
 *           Close
 *         </Button>
 *       }
 *       variant={Variant.Success}
 *     />
 *   );
 * };
 * ```
 *
 * @param action Optional content to display in the "action" slot; this is typically something like a button/CTA.
 * @param anchor The location in the viewport to anchor the toast. See {@link Anchor}.
 * @param className `class` overrides to apply to the component.
 * @param description Optional content to display in the "description" slot; this should be considered secondary content.
 * @param icon An optional reference ({@link FC}) to an icon to display in the "icon" slot.
 * @param open If `true`, the toast will be visible; otherwise it will be hidden.
 * @param title Optional content to display in the "title" slot; this should be considered the primary content.
 * @param variant The variant of the toast; this controls icon styling. See {@link Variant}.
 * @param props Additional HTML properties to apply to the component.
 */
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
