import { useRef } from "react";
import type { RefObject } from "react";

/**
 * Hook that returns a ref whose `.current` always points to the most recent
 * value passed in.
 *
 * Useful for letting an otherwise-stable callback (e.g. one returned by
 * `useCallback` with no dependencies) read fresh values without re-subscribing
 * — typically a parent-supplied handler or a frequently-changing piece of
 * state. The returned ref's identity is stable across renders.
 *
 * The assignment happens during render. Do not read `ref.current` during the
 * same render in which the value is captured; only read it from event
 * handlers, effects, or other deferred work.
 *
 * @example
 * ```tsx
 * const onChangeRef = useLatest(onChange);
 * const handler = useCallback(() => {
 *   onChangeRef.current?.(nextValue);
 * }, []);
 * ```
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
