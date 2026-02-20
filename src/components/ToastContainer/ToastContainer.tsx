import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Anchor } from "@/types";

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

/**
 * A layout component which acts as a container for toast-like components.
 *
 * @param anchor The location in the viewport to anchor the toast. See {@link Anchor}.
 * @param children Content wrapped by this component.
 * @param open If `true`, this component and its children will be rendered; otherwise it will be hidden.
 * @param props Additional HTML properties to apply to the component.
 */
export const ToastContainer: FC<ToastContainerProps> = ({
  anchor = Anchor.Bottom,
  children,
  open,
  ...props
}) => (
  <>
    {open && (
      <div className={clsx("fixed", "z-9999", anchorStyles[anchor])} {...props}>
        {children}
      </div>
    )}
  </>
);

ToastContainer.displayName = "ToastContainer";
