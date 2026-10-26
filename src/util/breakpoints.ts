import { useMediaQuery } from "@/util/useMediaQuery";

/** The width breakpoints VOODO's responsive props use: Tailwind's. */
export const Breakpoint = {
  Sm: "sm",
  Md: "md",
  Lg: "lg",
  Xl: "xl",
} as const;
export type Breakpoint = `${(typeof Breakpoint)[keyof typeof Breakpoint]}`;

/** Each breakpoint's width in pixels: a window this wide or wider is past it. */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * The media query for windows narrower than a breakpoint, as CSS writes it:
 * `"sm"` gives `"(max-width: 639.98px)"`, which also fits a CSS-in-JS
 * `@media` key.
 *
 * @example
 * ```tsx
 * const sx = { [`@media ${belowBreakpoint("sm")}`]: { padding: 0 } };
 * ```
 *
 * @param breakpoint `"sm"` (640px), `"md"` (768px), `"lg"` (1024px) or `"xl"` (1280px).
 */
export const belowBreakpoint = (breakpoint: Breakpoint): string =>
  `(max-width: ${BREAKPOINT_WIDTHS[breakpoint] - 0.02}px)`;

/**
 * Hook that reports whether the window is narrower than a breakpoint, and
 * re-renders when that changes. `useBelowBreakpoint("sm")` is a phone.
 *
 * @example
 * ```tsx
 * const phone = useBelowBreakpoint("sm");
 * return phone ? <PhoneLayout /> : <Layout />;
 * ```
 *
 * @param breakpoint `"sm"` (640px), `"md"` (768px), `"lg"` (1024px) or `"xl"` (1280px).
 */
export const useBelowBreakpoint = (breakpoint: Breakpoint): boolean =>
  useMediaQuery(belowBreakpoint(breakpoint));
