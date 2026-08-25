import { useMemo, useSyncExternalStore } from "react";

import { colors } from "./tokens/colors";
import { palettePool } from "./tokens/palette";

/** Resolved color mode. Mirrors the `.dark` class contract in `tailwind.css`. */
export type ColorMode = "dark" | "light";

/**
 * The palette's own token shape — every slot the tokens define, keyed as Figma
 * names them (`1-brand`, `7-teal`, …). Keys are derived rather than enumerated,
 * so a palette of N colors types correctly without touching this file; values
 * widen to `string` because the two modes resolve the same slot to different
 * literals.
 */
type PaletteColors = Record<keyof typeof colors.dark.content.palette, string>;

export interface ColorPalette extends PaletteColors {
  /**
   * The ordered slots as an array — the shape wanted by anything that assigns
   * colors by index (label coloring, chart series, legends).
   */
  pool: readonly string[];
}

const DEFAULT_MODE: ColorMode = "dark";

const isDark = (): boolean =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const getSnapshot = (): ColorMode => (isDark() ? "dark" : "light");

const getServerSnapshot = (): ColorMode => DEFAULT_MODE;

const subscribe = (onChange: () => void): (() => void) => {
  if (typeof document === "undefined") return () => undefined;

  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["class"],
    attributes: true,
  });

  return () => observer.disconnect();
};

/**
 * The currently active color mode, tracked by observing the `.dark` class on
 * `<html>`.
 *
 * Voodo has no theme provider by design — the `.dark` class is the whole
 * contract, and consuming apps already drive it (FiftyOne's `ThemeProvider`
 * syncs it from app config). Observing the class means this hook works with no
 * setup and stays correct when the mode is toggled from anywhere.
 *
 * Only `<html>` is observed. Tailwind's `dark` variant also matches a `.dark`
 * class on any ancestor, so a subtree deliberately pinned to dark inside a
 * light page will style correctly but report `light` here. Apps toggle the mode
 * at the root, so this is a limitation rather than a bug — if a locally-themed
 * subtree ever needs correct values, this should take an element to observe.
 */
export const useColorMode = (): ColorMode =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

/**
 * Resolved palette colors as literal hex strings for the active color mode.
 *
 * Prefer `cssVar.color.palette.*` for anything that styles the DOM — CSS
 * variables react to the theme without re-rendering React. Reach for this hook
 * only where a literal value is required and a `var(--…)` cannot be used:
 * canvas and WebGL (the looker overlays), charting libraries that parse colors
 * themselves, and image export.
 *
 * @example
 * ```tsx
 * const palette = useColorPalette();
 * ctx.strokeStyle = palette.pool[index % palette.pool.length];
 * ctx.fillStyle = palette["7-teal"];
 * ```
 */
export const useColorPalette = (): ColorPalette => {
  const mode = useColorMode();

  return useMemo(
    () => ({ ...colors[mode].content.palette, pool: palettePool[mode] }),
    [mode]
  );
};
