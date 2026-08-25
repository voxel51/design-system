import { colors } from "./colors";

/**
 * The palette pool — the ordered colors handed out when something needs a
 * series of distinguishable colors (label coloring, chart series, legends).
 *
 * A palette is N colors, not a fixed count: the slots are whatever numbered
 * keys the tokens define, read in ascending numeric order. Adding
 * `palette.13` to the tokens extends the pool with no code change here, and
 * the named aliases (`orange`, `teal`, …) are deliberately excluded — they are
 * for naming a specific hue, not for handing out.
 *
 * This module is pure data with no React or CSS dependency, so it is safe to
 * import from workers and other non-UI contexts via `@voxel51/voodo/tokens`.
 */

/** Numbered slot keys for a palette, in ascending numeric order. */
const SLOT = /^(\d+)(?:-|$)/;

const slotKeys = (palette: Record<string, string>): string[] =>
  Object.keys(palette)
    .filter((key) => SLOT.test(key))
    .sort((a, b) => Number(SLOT.exec(a)![1]) - Number(SLOT.exec(b)![1]));

const pool = (palette: Record<string, string>): string[] =>
  slotKeys(palette).map((key) => palette[key]);

export const paletteSlots = {
  dark: slotKeys(colors.dark.content.palette),
  light: slotKeys(colors.light.content.palette),
} as const;

export const palettePool = {
  dark: pool(colors.dark.content.palette),
  light: pool(colors.light.content.palette),
} as const;
