/**
 * Hides a control's label below a breakpoint: `true` or `"lg"` below 1024px,
 * `"sm"` below 640px, `"always"` at every width, `"auto"` while the enclosing
 * row is compact (see `useOverflowRowCompact`).
 */
export type Collapse = boolean | "sm" | "lg" | "always" | "auto";

// Shown, a label is one line of text that its row may cut short with an
// ellipsis; icons belong in the button's icon props, not in the label
const LABEL = "min-w-0 max-w-full truncate";
const COLLAPSE_STYLES = {
  sm: `hidden sm:inline-block ${LABEL}`,
  lg: `hidden lg:inline-block ${LABEL}`,
  always: "hidden",
  shown: `inline-block ${LABEL}`,
} as const;

/** Classes for a collapsible label; `undefined` is a label always shown. */
export default function collapseStyles(
  collapse: true | "sm" | "lg" | "always" | undefined
): string {
  return COLLAPSE_STYLES[
    collapse === undefined ? "shown" : collapse === true ? "lg" : collapse
  ];
}

/** A collapse with `"auto"` settled by whether its row is compact. */
export function resolveCollapse(
  collapse: Collapse | undefined,
  compact: boolean
): Exclude<Collapse, "auto"> | undefined {
  return collapse === "auto" ? (compact ? "always" : undefined) : collapse;
}
