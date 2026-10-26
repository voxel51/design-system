import { createContext, useContext } from "react";

/**
 * Whether the items of a row should render compact. {@link OverflowRow}
 * provides it; a row that fits its own items with `useOverflowFit` or
 * `useCompactRow` provides their `compact`.
 */
export const OverflowRowCompactContext = createContext(false);

/**
 * Whether the enclosing row wants its items compact (icon-only, with a
 * tooltip) to fit more of them. Always `false` inside an overflow menu.
 */
export const useOverflowRowCompact = (): boolean =>
  useContext(OverflowRowCompactContext);
