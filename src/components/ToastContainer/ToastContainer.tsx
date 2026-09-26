import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";
import { createContext } from "react";

import { Anchor } from "@/types";

/**
 * Whether a container is already placing its children. A toast inside one
 * takes its place in the stack rather than anchoring itself to the viewport.
 */
export const ToastStack = createContext<boolean>(false);

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

// Children arrive oldest first, and the newest belongs against the edge the
// stack is anchored to, so a top-anchored stack grows downward from its newest
const stackStyles: Record<Anchor, string> = {
  [Anchor.TopLeft]: "flex-col-reverse items-start",
  [Anchor.Top]: "flex-col-reverse items-center",
  [Anchor.TopRight]: "flex-col-reverse items-end",
  [Anchor.Right]: "flex-col items-end",
  [Anchor.BottomRight]: "flex-col items-end",
  [Anchor.Bottom]: "flex-col items-center",
  [Anchor.BottomLeft]: "flex-col items-start",
  [Anchor.Left]: "flex-col items-start",
};

/**
 * A layout component which acts as a container for toast-like components.
 *
 * Several children stack at the anchor, oldest first, with the newest against
 * the anchored edge.
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
      <div
        className={clsx(
          "fixed",
          "z-9999",
          "flex gap-2",
          anchorStyles[anchor],
          stackStyles[anchor]
        )}
        {...props}
      >
        <ToastStack.Provider value={true}>{children}</ToastStack.Provider>
      </div>
    )}
  </>
);

ToastContainer.displayName = "ToastContainer";
