import { useElementSize } from "./useElementSize";
import {
  UseResizableDrawerOptions,
  UseResizableDrawerReturn,
  useResizableDrawer,
} from "./useResizableDrawer";

export interface UsePinnableDrawerOptions
  extends Omit<UseResizableDrawerOptions, "closeThreshold"> {
  /**
   * Extra fixed pixels added to the measured pinnedContent height to compute
   * the closed size (e.g. drag-handle height + toggle-bar height).
   */
  closedPadding?: number;
}

export interface UsePinnableDrawerReturn extends UseResizableDrawerReturn {
  /** Attach to the element wrapping pinnedContent so its height is observed. */
  pinnedRef: (el: HTMLElement | null) => void;
  /** The total height/width when closed: pinnedContent size + closedPadding. */
  closedSize: number;
}

export function usePinnableDrawer({
  closedPadding = 0,
  ...options
}: UsePinnableDrawerOptions): UsePinnableDrawerReturn {
  const { ref: pinnedRef, height: pinnedHeight } = useElementSize();
  const closedSize = pinnedHeight + closedPadding;
  const result = useResizableDrawer({ ...options, closeThreshold: closedSize });
  return { ...result, pinnedRef, closedSize };
}
