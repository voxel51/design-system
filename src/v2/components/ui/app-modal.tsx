import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
} from "./dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { IconAction } from "./icon-action";
import { Button } from "./button";
import { cn } from "../../lib/utils";

/**
 * AppModal — the default modal for the design system.
 *
 * Mirrors the "New service" modal chrome so every dialog across the app shares
 * one look: a titled header with an icon-action close button, a scrollable body,
 * and a right-aligned footer (Cancel + primary action). Use this for any modal
 * unless there's a strong reason not to.
 */
interface AppModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional element shown to the right of the title (e.g. a badge). */
  headerAccessory?: React.ReactNode;
  children: React.ReactNode;
  /** Footer content. When omitted, use `primaryAction`/`secondaryAction`. */
  footer?: React.ReactNode;
  /** Convenience footer: primary button. */
  primaryAction?: { label: React.ReactNode; onClick: () => void; disabled?: boolean };
  /** Convenience footer: secondary/cancel button. Defaults to a "Cancel" that closes. */
  secondaryAction?: { label: React.ReactNode; onClick: () => void };
  /** Extra content shown above the footer buttons (e.g. a warning banner). */
  footerBanner?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  headerAccessory,
  children,
  footer,
  primaryAction,
  secondaryAction,
  footerBanner,
  className,
  contentClassName,
}: AppModalProps) {
  const hasFooter = footer || primaryAction || secondaryAction || footerBanner;

  return (
    // modal={false} + manual overlay mirrors ServiceSheet to avoid the Radix
    // body pointer-events lock that lingers after a Select closes.
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogPortal>
        {open && (
          <div
            className="fixed inset-0 z-[100] bg-scrim/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            aria-hidden
          />
        )}
        <DialogContent
        className={cn(
          "max-w-[560px] gap-0 p-0 bg-background border border-border/30 z-[101] [&>button.absolute]:hidden",
          className,
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/15 text-left space-y-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-title font-semibold leading-tight">{title}</DialogTitle>
            {headerAccessory}
            <DialogClose asChild>
              <IconAction size="md" className="ml-auto shrink-0">
                <X />
                <span className="sr-only">Close</span>
              </IconAction>
            </DialogClose>
          </div>
          {description && (
            <DialogDescription className="text-body text-secondary-foreground mt-1.5">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className={cn("px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto", contentClassName)}>
          {children}
        </div>

        {hasFooter && (
          <div className="border-t border-border/15 bg-background">
            {footerBanner}
            {footer ?? (
              <div className="flex items-center justify-end gap-3 px-6 py-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={secondaryAction?.onClick ?? (() => onOpenChange(false))}
                >
                  {secondaryAction?.label ?? "Cancel"}
                </Button>
                {primaryAction && (
                  <Button
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className="h-9 px-4"
                  >
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
