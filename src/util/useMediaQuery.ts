import { useCallback, useSyncExternalStore } from "react";

/**
 * Hook that reports whether a CSS media query matches, and re-renders when
 * that changes. `false` where there is no `window` (server rendering), and
 * for a `null` query, which subscribes to nothing.
 *
 * @example
 * ```tsx
 * function Toolbar() {
 *   const narrow = useMediaQuery("(max-width: 639.98px)");
 *   return narrow ? <CompactToolbar /> : <FullToolbar />;
 * }
 * ```
 *
 * @param query A media query, as written in CSS, or `null` for none.
 */
export function useMediaQuery(query: string | null): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (query === null || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () =>
      query !== null &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(query).matches,
    () => false
  );
}
