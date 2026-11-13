import { useDisclosure } from "@/util/useDisclosure";

/** Return value of {@link useShowMore}. */
export interface UseShowMoreReturn<T> {
  /** The items to draw: the first `max`, or all of them while open. */
  shown: T[];
  /** How many items are left out while closed; 0 when they all fit or while forced open. */
  hidden: number;
  /** Whether every item shows. */
  open: boolean;
  /** Flip between the first items and all of them. */
  toggle: () => void;
}

/**
 * Hook for a list that shows its first items and keeps the rest behind a
 * "+N more" control.
 *
 * @example
 * ```tsx
 * const { shown, hidden, open, toggle } = useShowMore(models, 12);
 * ```
 *
 * @param items All the items.
 * @param max How many show while closed.
 * @param forceOpen Keeps every item showing, such as while a search matches a hidden one.
 */
export function useShowMore<T>(
  items: T[],
  max: number,
  forceOpen = false
): UseShowMoreReturn<T> {
  const { open: toggled, toggle } = useDisclosure({ defaultOpen: false });
  const open = toggled || forceOpen;

  return {
    shown: open ? items : items.slice(0, max),
    hidden: forceOpen ? 0 : Math.max(0, items.length - max),
    open,
    toggle,
  };
}
