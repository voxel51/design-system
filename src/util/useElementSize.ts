import { useCallback, useRef, useState } from "react";

export interface UseElementSizeReturn {
  ref: (el: HTMLElement | null) => void;
  width: number;
  height: number;
}

export function useElementSize(): UseElementSizeReturn {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const roRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el) return;
    const measure = (): void =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    roRef.current = new ResizeObserver(measure);
    roRef.current.observe(el);
  }, []);

  return { ref, width: size.width, height: size.height };
}
