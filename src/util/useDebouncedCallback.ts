import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";

/**
 * Re-definition of lodash's DebouncedFunc;
 * this type is not included in the lodash.debounce package.
 */
interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

/**
 * Hook which returns a debounced version of the provided callback.
 *
 * @example
 * ```tsx
 * const delay = 300;
 * const debouncedCallback = useDebouncedCallback(
 *   useCallback(
 *     (value: string) => {
 *       doSomething(value);
 *     },
 *     [doSomething]
 *   ),
 *   delay
 * );
 * ```
 *
 * @param callback Callback to debounce; this is expected to be a stable ref
 * @param delay Debounce delay
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): DebouncedFunc<T> => {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );

  useEffect(() => {
    return () => debouncedCallback.cancel();
  }, [debouncedCallback]);

  return debouncedCallback;
};
