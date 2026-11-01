import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";

import {
  getColorCssVar,
  TextColor,
  TransitionDuration,
  transitionDuration,
  TransitionEasing,
  transitionEasing,
} from "@/types";
import { cn } from "@/util/classes";

export type TabsProps = HTMLAttributes<HTMLDivElement>;

// useLayoutEffect measures before paint so the indicator never renders in the
// wrong place; on the server there is nothing to measure and React warns, so
// fall back to useEffect there.
const useMeasureEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface Indicator {
  left: number;
  width: number;
  visible: boolean;
  /** Slide to the new place: only when the active tab changed, not on a resize. */
  slide: boolean;
}

const HIDDEN: Indicator = { left: 0, width: 0, visible: false, slide: false };

/**
 * A horizontal tab bar with a single underline which slides to the active
 * {@link Tab}.
 *
 * The bar stretches to its parent's height, so the underline sits on the
 * bottom edge of whatever contains it — a header, for instance, where the
 * underline reads as part of the header's own bottom border.
 *
 * @example
 * ```tsx
 * <Tabs aria-label="Workspace">
 *   <Tab active count={15} onClick={() => go("/datasets")}>
 *     Datasets
 *   </Tab>
 *   <Tab onClick={() => go("/settings")}>Settings</Tab>
 * </Tabs>
 * ```
 *
 * @param className `class` overrides to apply to the component.
 * @param children The bar's {@link Tab}s.
 * @param props Additional HTML properties to apply to the component.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [indicator, setIndicator] = useState<Indicator>(HIDDEN);
    // the first placement and resizes must not animate, only a new active tab
    const activeRef = useRef<HTMLElement | null>(null);

    const setRefs = useCallback(
      (el: HTMLDivElement | null) => {
        containerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref]
    );

    useMeasureEffect((): (() => void) | undefined => {
      const container = containerRef.current;
      if (!container) return;

      const measure = (): void => {
        const active = container.querySelector<HTMLElement>(
          '[role="tab"][aria-selected="true"]'
        );
        if (!active) {
          setIndicator((prev) => (prev.visible ? HIDDEN : prev));
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const slide =
          activeRef.current !== null && activeRef.current !== active;
        activeRef.current = active;
        setIndicator({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          visible: true,
          slide,
        });
      };

      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(container);
      container
        .querySelectorAll<HTMLElement>('[role="tab"]')
        .forEach((tab) => observer.observe(tab));
      window.addEventListener("resize", measure);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [children]);

    return (
      <div
        ref={setRefs}
        role="tablist"
        className={cn("relative flex h-full items-stretch gap-1", className)}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-0 h-0.5 rounded-full",
            indicator.slide &&
              cn(
                "transition-[left,width]",
                transitionDuration(TransitionDuration.Moderate),
                transitionEasing(TransitionEasing.Out)
              )
          )}
          style={{
            backgroundColor: getColorCssVar(TextColor.Primary),
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.visible ? 1 : 0,
          }}
        />
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
