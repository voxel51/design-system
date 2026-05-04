import { useCallback, useState } from "react";

export interface UseDisclosureOptions {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  open: boolean;
  toggle: () => void;
  setOpen: (next: boolean) => void;
}

export function useDisclosure({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
}: UseDisclosureOptions = {}): UseDisclosureReturn {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  return { open, toggle, setOpen };
}
