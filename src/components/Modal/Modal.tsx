import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { FC, ReactNode } from "react";

import { IconAction } from "@/components/IconAction";
import { CloseIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  ScrimColor,
  Shadow,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  TransitionDuration,
  transitionDuration,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Width of the modal panel. The panel is always full-width up to this cap so
 * it degrades to the viewport on small screens.
 */
export enum ModalSize {
  /** 400px — confirmations and single-field forms. */
  Sm = "sm",
  /** 600px — the default; forms and short reference content. */
  Md = "md",
  /** 800px — tables, side-by-side content. */
  Lg = "lg",
  /** 1000px — full editors. */
  Xl = "xl",
}

const sizeStyles: Record<ModalSize, string> = {
  [ModalSize.Sm]: "max-w-[400px]",
  [ModalSize.Md]: "max-w-[600px]",
  [ModalSize.Lg]: "max-w-[800px]",
  [ModalSize.Xl]: "max-w-[1000px]",
};

export interface ModalProps {
  /** Whether the modal is rendered. Modals are always controlled. */
  open: boolean;
  /**
   * Invoked when the user dismisses the modal — the close button, the
   * backdrop, or Escape. Pass a no-op to require an explicit action.
   */
  onClose: () => void;
  /** Heading rendered in the modal's title bar. */
  title?: ReactNode;
  /** Panel width. See {@link ModalSize}. Defaults to {@link ModalSize.Md}. */
  size?: ModalSize;
  /**
   * Whether to render the title bar's close button. Defaults to `true` when
   * a `title` is given. A modal with no title bar has no close button; give
   * it a dismiss control of its own.
   */
  showCloseButton?: boolean;
  /** Pinned below the scrollable body — typically the action buttons. */
  footer?: ReactNode;
  /** `class` overrides for the panel. */
  className?: string;
  /** `class` overrides for the scrollable body. */
  contentClassName?: string;
  /** Accessible name when there is no visible `title`. */
  "aria-label"?: string;
  /** Modal content. */
  children?: ReactNode;
}

/**
 * A centered, focus-trapping overlay for content that interrupts the page.
 *
 * Built on HeadlessUI's `Dialog`, so focus is trapped while open, the page
 * behind is inert, and Escape and backdrop clicks both route to `onClose`.
 * Reach for {@link Drawer} instead when the content should sit alongside the
 * page rather than over it.
 *
 * @example
 * ```tsx
 * const { open, setOpen } = useDisclosure({ defaultOpen: false });
 *
 * <Modal open={open} onClose={() => setOpen(false)} title="Rename dataset">
 *   <Input value={name} onChange={onChange} />
 * </Modal>
 * ```
 *
 * @example
 * ```tsx
 * // Actions pinned below a long, scrolling body.
 * <Modal
 *   open={open}
 *   onClose={close}
 *   title="Keyboard reference"
 *   size={ModalSize.Lg}
 *   footer={<Button onClick={close}>Done</Button>}
 * >
 *   {rows}
 * </Modal>
 * ```
 *
 * @param open Whether the modal is rendered.
 * @param onClose Invoked on close button, backdrop click, or Escape.
 * @param title Heading for the title bar.
 * @param size Panel width. See {@link ModalSize}.
 * @param showCloseButton Whether the title bar renders a close button.
 * @param footer Content pinned below the scrollable body.
 * @param className `class` overrides for the panel.
 * @param contentClassName `class` overrides for the scrollable body.
 * @param children Modal content.
 */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = ModalSize.Md,
  showCloseButton,
  footer,
  className,
  contentClassName,
  children,
  ...props
}) => {
  const withCloseButton = showCloseButton ?? Boolean(title);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      transition
      className={cn(
        "relative",
        zIndexStyles(ZIndex.High),
        transitionDuration(TransitionDuration.Normal),
        "transition-opacity data-closed:opacity-0"
      )}
      {...props}
    >
      <DialogBackdrop
        className={cn("fixed inset-0", bgColorClass(ScrimColor.Default))}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          data-testid="modal-panel"
          className={cn(
            "flex w-full flex-col overflow-hidden",
            "max-h-[85vh]",
            sizeStyles[size],
            // Figma Confirmation Modal: bg/background, border/default, radius 8,
            // 24px padding, scrim/default backdrop
            bgColorClass(BackgroundColor.Background),
            // A surface that paints its own background owns its foreground
            // too: without this the panel inherits whatever the host page
            // set, which is black text on the dark card in an app that
            // themes `body` rather than `:root`.
            textColorClass(TextColor.Primary),
            borderColorClass(BorderColor.Default),
            "border-1",
            radiusStyles(Radius.Lg),
            shadowStyles(Shadow.Lg),
            className
          )}
        >
          {(title || withCloseButton) && (
            <div
              className={cn(
                "flex flex-none items-center justify-between gap-md",
                "px-6 pt-6 pb-5"
              )}
            >
              {title ? (
                <DialogTitle
                  className={cn(
                    TEXT_STYLES[TextVariant.HeadingLg],
                    textColorClass(TextColor.Primary),
                    "min-w-0"
                  )}
                >
                  {title}
                </DialogTitle>
              ) : (
                <span />
              )}
              {withCloseButton && (
                <IconAction
                  size={Size.Lg}
                  aria-label="Close"
                  icon={CloseIcon}
                  onClick={onClose}
                  className="shrink-0"
                />
              )}
            </div>
          )}
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto px-6",
              title || withCloseButton ? "pb-6" : "py-6",
              contentClassName
            )}
          >
            {children}
          </div>
          {footer && (
            <div
              className={cn(
                // Figma: 16px between actions, 40px above them, no divider
                "flex flex-none items-center justify-end gap-4",
                "px-6 pt-4 pb-6"
              )}
            >
              {footer}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

Modal.displayName = "Modal";
