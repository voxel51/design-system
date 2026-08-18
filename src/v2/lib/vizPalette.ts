/**
 * Categorical data-visualization palette.
 *
 * Single source of truth for *field / class / series* colors anywhere we draw
 * data: class distributions, split charts, embeddings clusters, annotation
 * label colors, temporal tag strips. Values come from the design-system
 * `palette/` token group (`--palette-1 … --palette-18` in index.css). Each slot
 * has a light-theme value and a dark-theme twin, tuned for >=3:1 contrast
 * against that theme's canvas; the CSS variable resolves the right one.
 *
 * Never hand-roll a hue — assign from here so the same class renders the same
 * color everywhere in the app.
 */

export const PALETTE_SIZE = 18;

/** Ordered slots. Index 0 = palette-1. */
const SLOTS = Array.from({ length: PALETTE_SIZE }, (_, i) => i + 1);

/** Preferred assignment order — maximizes hue separation for small series. */
export const PALETTE_ORDER = [2, 1, 7, 4, 5, 14, 13, 6, 8, 3, 17, 18, 15, 11, 9, 12, 10, 16];

/** `hsl(var(--palette-N))` reference, theme-safe. */
export const paletteVar = (slot: number) =>
  `hsl(var(--palette-${((slot - 1) % PALETTE_SIZE) + 1}))`;

/** Same color with alpha, for fills behind strokes. */
export const paletteVarAlpha = (slot: number, alpha: number) =>
  `hsl(var(--palette-${((slot - 1) % PALETTE_SIZE) + 1}) / ${alpha})`;

/** Nth series color (0-based), following the separation-optimized order. */
export const paletteAt = (index: number) =>
  paletteVar(PALETTE_ORDER[((index % PALETTE_SIZE) + PALETTE_SIZE) % PALETTE_SIZE]);

/** Deterministic slot for an arbitrary key (class name, field name, tag). */
export const paletteSlotFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE_ORDER[h % PALETTE_SIZE];
};

/** Deterministic color for an arbitrary key. Stable across renders and views. */
export const paletteColorFor = (key: string) => paletteVar(paletteSlotFor(key));

export const paletteColorForAlpha = (key: string, alpha: number) =>
  paletteVarAlpha(paletteSlotFor(key), alpha);

/** All slots, in canonical token order — for design-system swatch displays. */
export const PALETTE_SLOTS = SLOTS;

/**
 * Literal hex values for the same slots — ONLY for contexts that cannot resolve
 * CSS variables (WebGL/THREE materials, canvas 2D gradients, exported images).
 * Keep in sync with `--palette-N` in index.css.
 */
export const PALETTE_HEX_DARK: Record<number, string> = {
  1: "#FA5300", 2: "#2563EB", 3: "#1E7D45", 4: "#8B5CF6", 5: "#DB2777", 6: "#D97706",
  7: "#0D9488", 8: "#6F42C1", 9: "#818CF8", 10: "#C33636", 11: "#E8A33D", 12: "#5FA97A",
  13: "#38BDF8", 14: "#65A30D", 15: "#C026D3", 16: "#64748B", 17: "#F43F5E", 18: "#34D399",
};

export const PALETTE_HEX_LIGHT: Record<number, string> = {
  1: "#FA5300", 2: "#2563EB", 3: "#1E7D45", 4: "#7C3AED", 5: "#DB2777", 6: "#B45309",
  7: "#0F766E", 8: "#6F42C1", 9: "#4F46E5", 10: "#C33636", 11: "#B26003", 12: "#166638",
  13: "#0284C7", 14: "#4D7C0F", 15: "#A21CAF", 16: "#475569", 17: "#E11D48", 18: "#059669",
};

/** True when the app is rendering the dark theme (default outside the browser). */
const isDarkTheme = () =>
  typeof document === "undefined" ||
  document.documentElement.classList.contains("dark") ||
  !document.documentElement.classList.contains("light");

/** Theme-resolved hex map. Prefer `paletteVar()` unless you truly need a hex. */
export const paletteHexMap = () => (isDarkTheme() ? PALETTE_HEX_DARK : PALETTE_HEX_LIGHT);

/** @deprecated use `paletteHexMap()` — kept as the dark-theme map for callers. */
export const PALETTE_HEX = PALETTE_HEX_DARK;

/** Deterministic hex for a key — same slot as `paletteColorFor`. */
export const paletteHexFor = (key: string) => paletteHexMap()[paletteSlotFor(key)];

/** Nth series hex (0-based), same order as `paletteAt`. */
export const paletteHexAt = (index: number) =>
  paletteHexMap()[PALETTE_ORDER[((index % PALETTE_SIZE) + PALETTE_SIZE) % PALETTE_SIZE]];

/** Token reference usable *inside* an `hsl()` wrapper — `hsl(var(--palette-N))`.
 *  For APIs (ColorPicker, stored accent values) that keep bare HSL triples. */
export const paletteTripleVar = (slot: number) =>
  `var(--palette-${((slot - 1) % PALETTE_SIZE) + 1})`;

/** Literal `h s% l%` triple for the active theme — for consumers that cannot
 *  resolve CSS variables (THREE materials, canvas gradients). */
export const paletteHslTriple = (slot: number) => {
  const hex = paletteHexMap()[((slot - 1) % PALETTE_SIZE) + 1];
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};
