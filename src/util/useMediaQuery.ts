import { useCallback, useSyncExternalStore } from "react";

/**
 * Hook that reports whether a CSS media query matches, and re-renders when
 * that changes. `false` where there is no `window` (server rendering).
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const narrow = useMediaQuery("(max-width: 639.98px)");
 *   return narrow ? <CompactToolbar /> : <FullToolbar />;
 * }
 * ```
 *
 * @param query A media query, as written in CSS.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
