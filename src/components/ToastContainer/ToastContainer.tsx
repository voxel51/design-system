import clsx from "clsx";
import { Anchor } from "@/types";
import type { FC, HTMLAttributes } from "react";

export interface ToastContainerProps extends HTMLAttributes<HTMLDivElement> {
  anchor?: Anchor;
  open?: boolean;
}

const anchorStyles: Record<Anchor, string> = {
  [Anchor.TopLeft]: "top-4 left-4",
  [Anchor.Top]: "top-4 left-1/2 -translate-x-1/2",
  [Anchor.TopRight]: "top-4 right-4",
  [Anchor.Right]: "right-4 top-1/2 -translate-y-1/2",
  [Anchor.BottomRight]: "bottom-4 right-4",
  [Anchor.Bottom]: "bottom-4 left-1/2 -translate-x-1/2",
  [Anchor.BottomLeft]: "bottom-4 left-4",
  [Anchor.Left]: "left-4 top-1/2 -translate-y-1/2",
};

export const ToastContainer: FC<ToastContainerProps> = ({
  anchor = Anchor.Bottom,
  children,
  open,
  ...props
}) => (
  <>
    {open && (
      <div className={clsx("fixed", "z-100", anchorStyles[anchor])} {...props}>
        {children}
      </div>
    )}
  </>
);

ToastContainer.displayName = "ToastContainer";
