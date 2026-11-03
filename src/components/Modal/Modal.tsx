import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { FC, ReactNode } from "react";

import { IconAction, type IconActionProps } from "@/components/IconAction";
import { ArrowLeftStrokeIcon, XIcon } from "@/components/Icons";
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
export const ModalSize = {
  /** 400px — confirmations and single-field forms. */
  Sm: "sm",
  /** 600px — the default; forms and short reference content. */
  Md: "md",
  /** 800px — tables, side-by-side content. */
  Lg: "lg",
  /** 1000px — full editors. */
  Xl: "xl",
} as const;
export type ModalSize = `${(typeof ModalSize)[keyof typeof ModalSize]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ModalSize {
  export type Sm = typeof ModalSize.Sm;
  export type Md = typeof ModalSize.Md;
  export type Lg = typeof ModalSize.Lg;
  export type Xl = typeof ModalSize.Xl;
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
  /** A line under the title saying what the modal is for, in secondary text. */
  description?: ReactNode;
  /** Panel width. See {@link ModalSize}. Defaults to `"md"`. */
  size?: ModalSize;
  /**
   * Whether to render the title bar's close button. Defaults to `true` when
   * a `title` is given. Without a `title`, no close button renders unless
   * `showCloseButton` is `true`; otherwise give the modal a dismiss control
   * of its own.
   */
  showCloseButton?: boolean;
  /** Pinned below the scrollable body — typically the action buttons. */
  footer?: ReactNode;
  /**
   * Pinned at the footer's start, opposite `footer` — a selection count or a
   * secondary action. Renders the footer row on its own.
   */
  footerStart?: ReactNode;
  /** When given, a back arrow before the title calls it (a sub-view's way out). */
  onBack?: () => void;
  /** Extra props for the close button, such as a test id or a tooltip title. */
  closeButtonProps?: Partial<Omit<IconActionProps, "icon" | "onClick">> & {
    [data: `data-${string}`]: string | undefined;
  };
  /**
   * Stacking level. Defaults to `"high"`; `"above-modal"` puts it over app
   * overlays (an open sample viewer and its tooltips).
   */
  zIndex?: ZIndex;
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
 * // A sub-view: back arrow, a count at the footer's start.
 * <Modal
 *   open={open}
 *   onClose={close}
 *   onBack={showList}
 *   title="Edit field"
 *   size="lg"
 *   zIndex="above-modal"
 *   footerStart={<Text variant="body-secondary">2 selected</Text>}
 *   footer={<Button size="sm">Save</Button>}
 * >
 *   {form}
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
 *   size="lg"
 *   footer={<Button onClick={close}>Done</Button>}
 * >
 *   {rows}
 * </Modal>
 * ```
 *
 * @param open Whether the modal is rendered.
 * @param onClose Invoked on close button, backdrop click, or Escape.
 * @param title Heading for the title bar.
 * @param description A line under the title saying what the modal is for.
 * @param size Panel width. See {@link ModalSize}.
 * @param showCloseButton Whether the title bar renders a close button.
 * @param footer Content pinned below the scrollable body.
 * @param footerStart Content pinned at the footer's start, opposite `footer`.
 * @param onBack When given, renders a back arrow before the title that calls it.
 * @param closeButtonProps Extra props for the close button.
 * @param zIndex Stacking level. See {@link ZIndex}.
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
  description,
  footer,
  footerStart,
  onBack,
  closeButtonProps,
  zIndex = ZIndex.High,
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
        // spans the viewport, so the root itself has a box (tests and
        // hit-testing find the dialog by it)
        "fixed inset-0",
        zIndexStyles(zIndex),
        transitionDuration(TransitionDuration.Normal),
        "transition-opacity data-closed:opacity-0"
      )}
      {...props}
    >
      <DialogBackdrop
        className={cn("fixed inset-0", bgColorClass(ScrimColor.Default))}
      />
      {/* Sized to the viewport, not to the page beside its scrollbar: the
          scroll lock lifts as the close fades in, and a scrollbar returning
          then would slide a centered panel sideways. */}
      <div className="fixed inset-y-0 left-0 flex w-screen items-center justify-center p-4">
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
                "flex flex-none items-start justify-between gap-md",
                "px-6 pt-6 pb-5"
              )}
            >
              {title ? (
                <div className="flex min-w-0 items-start gap-2">
                  {onBack && (
                    <IconAction
                      size={Size.Sm}
                      aria-label="Back"
                      icon={ArrowLeftStrokeIcon}
                      onClick={onBack}
                      className="-ml-1 shrink-0"
                    />
                  )}
                  <div className="flex min-w-0 flex-col gap-1">
                    <DialogTitle
                      className={cn(
                        TEXT_STYLES[TextVariant.HeadingLg],
                        textColorClass(TextColor.Primary)
                      )}
                    >
                      {title}
                    </DialogTitle>
                    {description && (
                      <Description
                        className={cn(
                          TEXT_STYLES[TextVariant.BodyPrimary],
                          textColorClass(TextColor.Secondary)
                        )}
                      >
                        {description}
                      </Description>
                    )}
                  </div>
                </div>
              ) : (
                <span />
              )}
              {withCloseButton && (
                // Lovable's modal close: a 16px thin X, held at the title's height
                <IconAction
                  size={Size.Md}
                  aria-label="Close"
                  icon={XIcon}
                  onClick={onClose}
                  className="-mt-1.5 -mr-2 shrink-0"
                  {...closeButtonProps}
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
          {(footer || footerStart) && (
            <div
              className={cn(
                // Figma: 16px between actions, 40px above them, no divider
                "flex flex-none flex-wrap items-center justify-end gap-4",
                "px-6 pt-4 pb-6"
              )}
            >
              {footerStart && (
                <div className="mr-auto flex min-w-0 items-center gap-2">
                  {footerStart}
                </div>
              )}
              {footer}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

Modal.displayName = "Modal";
