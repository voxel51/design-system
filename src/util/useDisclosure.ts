import { useCallback } from "react";

import { useControllableState } from "@/util/useControllableState";

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
  const [open, setOpen] = useControllableState({
    initializer: () => defaultOpen,
    onChange: onOpenChange,
    value: controlledOpen,
  });

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  return { open, toggle, setOpen };
}
