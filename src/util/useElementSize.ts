import { useCallback, useRef, useState } from "react";

/**
 * Return value of {@link useElementSize}.
 */
export interface UseElementSizeReturn {
  /** Callback ref to attach to the element you want to measure. */
  ref: (el: HTMLElement | null) => void;
  /** Current width of the observed element in pixels. `0` before the ref attaches. */
  width: number;
  /** Current height of the observed element in pixels. `0` before the ref attaches. */
  height: number;
}

/**
 * Hook that tracks the pixel dimensions of a DOM element via
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver}.
 *
 * Attach the returned `ref` callback to any element; `width` and `height`
 * update on mount and on every subsequent resize. The observer is
 * automatically disconnected when the element is unmounted or replaced.
 *
 * @example
 * ```tsx
 * function Panel() {
 *   const { ref, width, height } = useElementSize();
 *   return <div ref={ref}>Size: {width} × {height}</div>;
 * }
 * ```
 */
export function useElementSize(): UseElementSizeReturn {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const roRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el) return;
<<<<<<< HEAD
    const measure = (): void =>
=======
    const measure = () =>
>>>>>>> 7e67ff3 (lints)
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    roRef.current = new ResizeObserver(measure);
    roRef.current.observe(el);
  }, []);

  return { ref, width: size.width, height: size.height };
}
