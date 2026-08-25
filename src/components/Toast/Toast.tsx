import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/Button";
import { CloseIcon, type IconInput, IconWrapper } from "@/components/Icons";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { ToastContainer } from "@/components/ToastContainer";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Align,
  Anchor,
  BackgroundColor,
  bgColorClass,
  IconColor,
  Justify,
  Orientation,
  Radius,
  Shadow,
  Size,
  Spacing,
  TextColor,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

type ToastVariant = `${Exclude<Variant, Variant.Borderless>}`;

export interface ToastProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  action?: ReactNode;
  anchor?: Anchor;
  description?: ReactNode;
  icon?: IconInput;
  onClose?: () => void;
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
 *       icon={CheckIcon}
 *       action={
 *         <Button variant={Variant.Secondary} onClick={() => setOpen(false)}>
 *           Undo
 *         </Button>
 *       }
 *       onClose={() => setOpen(false)}
 *       variant={Variant.Success}
 *     />
 *   );
 * };
 * ```
 *
 * @param action Optional content to display in the "action" slot; this is typically a {@link Button}/CTA.
 * @param anchor The location in the viewport to anchor the toast. See {@link Anchor}.
 * @param className `class` overrides to apply to the component.
 * @param description Optional content to display in the "description" slot; this should be considered secondary content.
 * @param icon An optional icon component to display in the "icon" slot.
 * @param onClose Optional handler invoked when the close/dismiss control is activated. If provided, a close
 *  control is rendered in the toast.
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
  icon,
  onClose,
  open,
  title,
  variant = Variant.Primary,
  ...props
}) => {
  const toastContent = (
    <Stack
      align={Align.Center}
      justify={Justify.Between}
      spacing={Spacing.Lg}
      className={cn(
        "p-4",
        // NB: use an explicit max-width. In this design system the Tailwind theme remaps the
        // named scales to spacing tokens, so `max-w-md` would resolve to `var(--spacing-md)`
        // (1rem) and clamp the toast to a thin sliver. 28rem (~448px) is the intended cap.
        "w-[90vw] max-w-[28rem]",
        radiusStyles(Radius.Md),
        bgColorClass(BackgroundColor.Card2),
        shadowStyles(Shadow.Md),
        className
      )}
      {...props}
    >
      {/* Content (icon, title, description) on the left. */}
      <Stack
        orientation={Orientation.Column}
        spacing={Spacing.Sm}
        className="min-w-0"
      >
        <Stack spacing={Spacing.Sm} align={Align.Center}>
          <IconWrapper
            content={icon}
            className={clsx("size-5 shrink-0", variantStyles[variant])}
          />
          {title && <Text className="font-semibold">{title}</Text>}
        </Stack>
        {description && <Text color={TextColor.Secondary}>{description}</Text>}
      </Stack>
      {/* Action and/or close control pinned to the right, not stacked under the content. */}
      {(action || onClose) && (
        <Stack align={Align.Center} spacing={Spacing.Sm} className="shrink-0">
          {action}
          {onClose && (
            <Button
              variant={Variant.Icon}
              size={Size.Sm}
              aria-label="Close"
              leadingIcon={CloseIcon}
              onClick={onClose}
              className="shrink-0"
            />
          )}
        </Stack>
      )}
    </Stack>
  );

  return (
    <ToastContainer open={open} anchor={anchor}>
      {toastContent}
    </ToastContainer>
  );
};
