import { useMemo, useSyncExternalStore } from "react";

import { colors } from "./tokens/colors";
import { chartPool, overlayPool, type VizHue } from "./tokens/palette";

/** Resolved color mode. Mirrors the `.dark` class contract in `tailwind.css`. */
export type ColorMode = "dark" | "light";

/**
 * The chart group's token shape. Keyed by `VizHue` rather than by
 * `typeof colors.dark…` so both modes satisfy it — the per-mode types are
 * disjoint unions of hex literals, and only the key set is common to them.
 */
type ChartColors = Record<VizHue, string>;

export interface ColorPalette extends ChartColors {
  /**
   * Chart hues in pool order — for anything that assigns colors by index and
   * draws onto the UI (chart series, legends, histograms).
   */
  pool: readonly string[];
  /**
   * Overlay hues in pool order — for marks drawn *over media* (looker's boxes,
   * masks, keypoints). Identical in both modes on purpose: the image behind
   * them does not change with the theme.
   */
  overlay: readonly string[];
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
 * Prefer `cssVar.color["viz-chart"].*` for anything that styles the DOM — CSS
 * variables react to the theme without re-rendering React. Reach for this hook
 * only where a literal value is required and a `var(--…)` cannot be used:
 * canvas and WebGL (the looker overlays), charting libraries that parse colors
 * themselves, and image export.
 *
 * @example
 * ```tsx
 * const palette = useColorPalette();
 * ctx.strokeStyle = palette.overlay[index % palette.overlay.length];
 * ctx.fillStyle = palette.teal;
 * ```
 */
export const useColorPalette = (): ColorPalette => {
  const mode = useColorMode();

  return useMemo(
    () => ({
      ...colors[mode].content["viz-chart"],
      pool: chartPool[mode],
      overlay: overlayPool,
    }),
    [mode]
  );
};
