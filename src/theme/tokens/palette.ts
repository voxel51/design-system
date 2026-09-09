import { colors } from "./colors";

/**
 * The visualization palettes — the colors handed out when something needs a
 * series of distinguishable colors.
 *
 * Figma splits these into two groups, and the distinction matters:
 *
 *  - `viz-overlay` is **mode-independent** (identical in both themes). These
 *    are marks drawn *on media* — looker's detection boxes, masks, keypoints.
 *    The image behind them does not get lighter when the UI does, so neither
 *    may they, or a label that read well over a dark photo stops reading.
 *  - `viz-chart` **varies by mode**. These are marks drawn *on the UI* —
 *    histograms, plots, legends — and must hold contrast against a surface
 *    that does change.
 *
 * Pick by what the color is drawn onto, not by which list is nearer to hand.
 *
 * This module is pure data with no React or CSS dependency, so it is safe to
 * import from workers and other non-UI contexts via `@voxel51/voodo/tokens`.
 */

/**
 * Pool order. **Code-side, not a Figma token.**
 *
 * Figma's `palette/1-brand … 18-mint` numbered the slots, so the order was the
 * design's to state and code just read the numbers off. `viz-chart` and
 * `viz-overlay` are keyed by hue with no ordering, so the sequence has to live
 * here until Figma expresses it again.
 *
 * Ordered for separation between *adjacent* slots, since a pool is consumed by
 * index and neighbours are what land side by side. `neutral` sorts last: it
 * reads as "no category" and should be the last color a dataset reaches for.
 * Brand orange is deliberately absent — Figma dropped it from both viz groups,
 * and a data series colored like the primary action is a real ambiguity.
 */
const POOL_ORDER = [
  "blue",
  "green",
  "purple",
  "pink",
  "yellow",
  "teal",
  "red",
  "lime",
  "magenta",
  "neutral",
] as const;

export type VizHue = (typeof POOL_ORDER)[number];

type VizGroup = Record<VizHue, string>;

const pool = (group: VizGroup): readonly string[] =>
  POOL_ORDER.map((hue) => group[hue]);

/** Hue names in pool order. The slot list, for anything that labels slots. */
export const paletteSlots: readonly VizHue[] = POOL_ORDER;

/**
 * Mode-independent overlay colors, in pool order. The right pool for anything
 * drawn over media.
 */
export const overlayPool: readonly string[] = pool(
  colors.dark.content["viz-overlay"]
);

/** Chart colors in pool order, per mode. */
export const chartPool = {
  dark: pool(colors.dark.content["viz-chart"]),
  light: pool(colors.light.content["viz-chart"]),
} as const;

/**
 * @deprecated Figma's `palette/*` group was replaced by `viz-chart` and
 * `viz-overlay` in the 2026-09-05 token release. This alias keeps the old
 * import working and resolves to the **chart** pool; if the colors are drawn
 * over media, move to `overlayPool` instead — that is a behaviour change, not
 * a rename, and it is the one this split exists to make visible.
 */
export const palettePool = chartPool;
