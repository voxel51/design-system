import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { FC, ReactNode } from "react";

import { CloseIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  IconColor,
  Radius,
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

/** Edge the sheet slides in from. */
export enum SheetSide {
  Left = "left",
  Right = "right",
}

const sideStyles: Record<SheetSide, string> = {
  [SheetSide.Left]: "left-0 border-r-1 data-closed:-translate-x-full",
  [SheetSide.Right]: "right-0 border-l-1 data-closed:translate-x-full",
};

export interface SheetProps {
  /** Whether the sheet is rendered. Sheets are always controlled. */
  open: boolean;
  /** Invoked on the close button, the backdrop, or Escape. */
  onClose: () => void;
  /** Edge it slides in from. Defaults to {@link SheetSide.Right}. */
  side?: SheetSide;
  /** Heading rendered in the sheet's title bar. */
  title?: ReactNode;
  /**
   * Panel width in pixels. The sheet is full-width below this, so it takes
   * the whole viewport on a phone. Defaults to 460.
   */
  width?: number;
  /**
   * Whether to render the title bar's close button. Defaults to `true` when
   * a `title` is given.
   */
  showCloseButton?: boolean;
  /** `class` overrides for the panel. */
  className?: string;
  /** `class` overrides for the scrollable body. */
  contentClassName?: string;
  /** Accessible name when there is no visible `title`. */
  "aria-label"?: string;
  children?: ReactNode;
}

/**
 * A full-height overlay anchored to one side of the viewport.
 *
 * The side-panel counterpart to {@link Modal}: same focus trap and same
 * dismiss routes, but the panel is pinned to an edge and slides in, which
 * suits detail views that stay visually connected to the list behind them
 * (a run, a sample, a task). Reach for {@link Drawer} instead when the
 * content belongs inside the layout rather than over it, and {@link Modal}
 * when the user must deal with it before continuing.
 *
 * @example
 * ```tsx
 * <Sheet open={!!run} onClose={clear} title={run?.queue}>
 *   <RunDetail run={run} />
 * </Sheet>
 * ```
 *
 * @param open Whether the sheet is rendered.
 * @param onClose Invoked on close button, backdrop click, or Escape.
 * @param side Edge the sheet slides in from. See {@link SheetSide}.
 * @param title Heading for the title bar.
 * @param width Panel width in pixels; full-width below it.
 * @param showCloseButton Whether the title bar renders a close button.
 * @param className `class` overrides for the panel.
 * @param contentClassName `class` overrides for the scrollable body.
 * @param children Sheet content.
 */
export const Sheet: FC<SheetProps> = ({
  open,
  onClose,
  side = SheetSide.Right,
  title,
  width = 460,
  showCloseButton,
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
      className={cn("relative", zIndexStyles(ZIndex.High))}
      {...props}
    >
      <DialogBackdrop
        className={cn(
          "fixed inset-0 bg-black/50",
          transitionDuration(TransitionDuration.Normal),
          "transition-opacity data-closed:opacity-0"
        )}
      />
      <DialogPanel
        data-testid="sheet-panel"
        style={{ maxWidth: width }}
        className={cn(
          "fixed inset-y-0 flex w-full flex-col",
          sideStyles[side],
          bgColorClass(BackgroundColor.CardElevated),
          // A surface that paints its own background owns its foreground too.
          textColorClass(TextColor.Primary),
          borderColorClass(BorderColor.Default),
          transitionDuration(TransitionDuration.Moderate),
          "transition-transform",
          className
        )}
      >
        {(title || withCloseButton) && (
          <div className="flex flex-none items-center justify-between gap-md px-5 pt-5 pb-3">
            {title ? (
              <DialogTitle
                className={cn(
                  textStyles(TextVariant.Lg),
                  textColorClass(TextColor.Primary),
                  "text-semibold min-w-0"
                )}
              >
                {title}
              </DialogTitle>
            ) : (
              <span />
            )}
            {withCloseButton && (
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className={cn(
                  "flex flex-none cursor-pointer items-center justify-center",
                  "size-6",
                  radiusStyles(Radius.Sm),
                  textColorClass(IconColor.Subtle),
                  "hover:text-fg"
                )}
              >
                <CloseIcon size={Size.Xl} />
              </button>
            )}
          </div>
        )}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-5",
            title || withCloseButton ? "pb-5" : "py-5",
            contentClassName
          )}
        >
          {children}
        </div>
      </DialogPanel>
    </Dialog>
  );
};

Sheet.displayName = "Sheet";
