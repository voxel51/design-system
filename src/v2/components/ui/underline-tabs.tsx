import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

/**
 * UnderlineTabs — workspace-level tab style used across the app.
 * Renders a single sliding underline that animates between the active tab
 * (identified by `data-active="true"` on its UnderlineTab child).
 */
export const UnderlineTabs = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>({
      left: 0,
      width: 0,
      visible: false,
    });
    const hasAnimatedRef = useRef(false);

    const setRefs = (el: HTMLDivElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    };

    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const measure = () => {
        const active = el.querySelector<HTMLElement>('[data-active="true"]');
        if (!active) {
          setIndicator((p) => ({ ...p, visible: false }));
          return;
        }
        const parentRect = el.getBoundingClientRect();
        const rect = active.getBoundingClientRect();
        setIndicator({
          left: rect.left - parentRect.left,
          width: rect.width,
          visible: true,
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      el.querySelectorAll<HTMLElement>("[data-tab]").forEach((c) => ro.observe(c));
      window.addEventListener("resize", measure);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [children]);

    useEffect(() => {
      if (indicator.visible) {
        // Skip the transition only on the very first paint so it doesn't slide in from 0.
        const id = requestAnimationFrame(() => {
          hasAnimatedRef.current = true;
        });
        return () => cancelAnimationFrame(id);
      }
    }, [indicator.visible]);

    return (
      <div ref={setRefs} className={cn("relative flex items-end gap-0", className)} {...props}>
        {children}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-0 h-[1.5px] bg-foreground rounded-full",
            hasAnimatedRef.current && "transition-[left,width] duration-300 ease-out",
          )}
          style={{
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.visible ? 1 : 0,
          }}
        />
      </div>
    );
  },
);
UnderlineTabs.displayName = "UnderlineTabs";

interface UnderlineTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const UnderlineTab = forwardRef<HTMLButtonElement, UnderlineTabProps>(
  ({ active, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-tab
      data-active={active ? "true" : "false"}
      className={cn(
        "px-3 pb-2 pt-1 text-body transition-colors",
        active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground font-normal",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
UnderlineTab.displayName = "UnderlineTab";
