/**
 * Hides a control's label below a breakpoint: `true` or `"lg"` below 1024px,
 * `"sm"` below 640px, `"always"` at every width, `"auto"` while the enclosing
 * row is compact (see `useOverflowRowCompact`).
 */
export type Collapse = boolean | "sm" | "lg" | "always" | "auto";

// Shown, the label is a flex item of its button: a row with the button's own
// gap, so an icon among its children stays on the label's line
const COLLAPSE_STYLES = {
  sm: "hidden sm:flex items-center gap-[inherit]",
  lg: "hidden lg:flex items-center gap-[inherit]",
  always: "hidden",
} as const;

export default function collapseStyles(
  collapse: true | "sm" | "lg" | "always"
): string {
  return COLLAPSE_STYLES[collapse === true ? "lg" : collapse];
}

/** A collapse with `"auto"` settled by whether its row is compact. */
export function resolveCollapse(
  collapse: Collapse | undefined,
  compact: boolean
): Exclude<Collapse, "auto"> | undefined {
  return collapse === "auto" ? (compact ? "always" : undefined) : collapse;
}
