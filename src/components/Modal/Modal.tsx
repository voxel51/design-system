import { Dialog, DialogPanel } from "@headlessui/react";
import { type FC, type ReactNode, useEffect } from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Shadow,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";
import styles from "./Modal.module.css";

// ── Size ─────────────────────────────────────────────────────────────────────

export enum ModalSize {
  Sm = "sm",
  Md = "md",
  Lg = "lg",
  Full = "full",
}

const sizeClasses: Record<ModalSize, string> = {
  [ModalSize.Sm]: "min-w-80 max-w-[480px] max-h-[80vh]",
  [ModalSize.Md]: "min-w-[480px] max-w-[640px] max-h-[85vh]",
  [ModalSize.Lg]: "min-w-[640px] max-w-[860px] max-h-[90vh]",
  [ModalSize.Full]: "w-[95vw] h-[95vh]",
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the modal should close (backdrop click, ESC). */
  onClose: () => void;
  /** Controls min/max width and max height. Defaults to `md`. */
  size?: ModalSize;
  /**
   * When true, neither backdrop click nor ESC will close the modal.
   * Use sparingly — only for flows that require an explicit decision.
   */
  unclosable?: boolean;
  /**
   * When true, pressing ESC will not close the modal but backdrop click still will.
   * Useful for forms where ESC might conflict with field interactions.
   */
  disableEscapeKey?: boolean;
  children?: ReactNode;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  size = ModalSize.Md,
  unclosable = false,
  disableEscapeKey = false,
  children,
  className,
}) => {
  useEffect(() => {
    if (!open || (!disableEscapeKey && !unclosable)) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [open, disableEscapeKey, unclosable]);

  return (
    <Dialog
      open={open}
      onClose={unclosable ? () => {} : onClose}
      unmount={false}
    >
      <div
        aria-hidden="true"
        className={cn(styles.backdrop, zIndexStyles(ZIndex.High), open && styles.open)}
      />

      <div className={cn("fixed inset-0 flex items-center justify-center p-6", zIndexStyles(ZIndex.High))}>
        <DialogPanel
          className={cn(
            styles.panel,
            open && styles.open,
            bgColorClass(BackgroundColor.Card1),
            borderColorClass(BorderColor.Default),
            shadowStyles(Shadow.Xl),
            radiusStyles(Radius.Lg),
            "border-1 overflow-hidden",
            sizeClasses[size],
            className
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

Modal.displayName = "Modal";
