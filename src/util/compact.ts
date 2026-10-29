import { createContext, useContext } from "react";

/** How a row wants its items drawn so they fit: see {@link useOverflowRowFit}. */
export interface OverflowRowFit {
  /** Items show their icon alone, named by a tooltip. */
  compact: boolean;
  /** Labels are cut to this width with an ellipsis; `null` for no limit. */
  labelMax: number | null;
}

/** A row with room for every item as it is. */
export const FULL_FIT: OverflowRowFit = { compact: false, labelMax: null };

/** Marks the label of an action whose row may shorten it. */
export const COLLAPSE_LABEL_ATTR = "data-collapse-label";

/**
 * How the items of a row should render to fit. {@link OverflowRow} provides
 * it; a row that fits its own items with `useOverflowFit` or `useCompactRow`
 * provides their `context`.
 */
export const OverflowRowCompactContext =
  createContext<OverflowRowFit>(FULL_FIT);

/** How the enclosing row wants its items drawn; full inside an overflow menu. */
export const useOverflowRowFit = (): OverflowRowFit =>
  useContext(OverflowRowCompactContext);

/**
 * Whether the enclosing row wants its items compact (icon-only, with a
 * tooltip) to fit more of them. Always `false` inside an overflow menu.
 */
export const useOverflowRowCompact = (): boolean =>
  useContext(OverflowRowCompactContext).compact;

/**
 * The widest label that still lets a row fit: cutting every label wider than
 * it to that width saves `deficit` pixels, widest labels first. `null` when
 * that width would fall below `min`, where the row goes icon-only instead.
 */
export function capLabels(
  labels: number[],
  deficit: number,
  min: number
): number | null {
  if (deficit <= 0) return null;
  const sorted = [...labels].sort((a, b) => b - a);
  let sum = 0;
  for (let k = 1; k <= sorted.length; k++) {
    sum += sorted[k - 1];
    const cap = (sum - deficit) / k;
    const next = sorted[k] ?? 0;
    if (cap >= next) return cap >= min ? Math.floor(cap) : null;
  }
  return null;
}
