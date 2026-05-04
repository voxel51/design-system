import { useCallback } from "react";

import { useControllableState } from "@/util/useControllableState";

/**
 * Options for {@link useDisclosure}.
 *
 * Provide `defaultOpen` for an uncontrolled disclosure, or `open` (with
 * `onOpenChange`) for a controlled disclosure.
 */
export interface UseDisclosureOptions {
  /** Initial open state when uncontrolled. Default `true`. */
  defaultOpen?: boolean;
  /** When defined, switches the hook into controlled mode and uses this as the resolved open state. */
  open?: boolean;
  /** Invoked with the next open state on every change, in both controlled and uncontrolled modes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Return value of {@link useDisclosure}.
 */
export interface UseDisclosureReturn {
  /** Current open state. */
  open: boolean;
  /** Flip the open state. In controlled mode this only fires `onOpenChange` and does not update internal state. */
  toggle: () => void;
  /** Set the open state. In controlled mode this only fires `onOpenChange` and does not update internal state. */
  setOpen: (next: boolean) => void;
}

/**
 * Hook for managing a boolean "open / closed" state, suitable for popovers,
 * dialogs, accordions, and other disclosures.
 *
 * Supports both controlled and uncontrolled usage via {@link useControllableState}:
 * pass `defaultOpen` for uncontrolled, or `open` (typically alongside
 * `onOpenChange`) for controlled.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * const { open, toggle, setOpen } = useDisclosure({ defaultOpen: false });
 *
 * // Controlled
 * const { open, toggle } = useDisclosure({ open: isOpen, onOpenChange: setIsOpen });
 * ```
 */
export function useDisclosure({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
}: UseDisclosureOptions = {}): UseDisclosureReturn {
  const [open, setOpen] = useControllableState({
    initializer: () => defaultOpen,
    onChange: onOpenChange,
    value: controlledOpen,
  });

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  return { open, toggle, setOpen };
}
