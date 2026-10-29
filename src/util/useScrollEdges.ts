import { type CSSProperties, useCallback, useRef, useState } from "react";

const FADE = 24;

const fade = (start: boolean, end: boolean): CSSProperties | undefined => {
  if (!start && !end) return undefined;
  const mask = `linear-gradient(to right, ${
    start ? `transparent, #000 ${FADE}px` : "#000, #000"
  }, ${end ? `#000 calc(100% - ${FADE}px), transparent` : "#000, #000"})`;
  return { maskImage: mask, WebkitMaskImage: mask };
};

/**
 * Hook that fades the edge of a sideways-scrolling element on each side which
 * has more content beyond it, so the row shows that it scrolls.
 *
 * @returns `ref` to attach to the scrolling element, and `style` holding the fade.
 */
export function useScrollEdges(): {
  ref: (el: HTMLElement | null) => void;
  style: CSSProperties | undefined;
} {
  const [edges, setEdges] = useState({ start: false, end: false });
  const cleanup = useRef<(() => void) | undefined>(undefined);

  const ref = useCallback((el: HTMLElement | null): void => {
    cleanup.current?.();
    cleanup.current = undefined;
    if (!el) return;
    const measure = (): void => {
      const start = el.scrollLeft > 1;
      const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setEdges((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end }
      );
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(el);
    Array.from(el.children).forEach((child) => observer?.observe(child));
    cleanup.current = () => {
      el.removeEventListener("scroll", measure);
      observer?.disconnect();
    };
  }, []);

  return { ref, style: fade(edges.start, edges.end) };
}
