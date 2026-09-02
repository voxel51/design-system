/**
 * Named z-index values for stacking context.
 * Use when a component needs to control its layering relative to modals, dropdowns, etc.
 */
export const ZIndex = {
  /** No explicit stacking; uses document flow (z-index: auto). */
  Default: "default",
  /** Low stacking (e.g. dropdowns in page context). */
  Low: "low",
  /** Medium stacking (e.g. popovers, tooltips). */
  Medium: "medium",
  /** High stacking (e.g. dropdowns above other overlays). */
  High: "high",
  /** Above modal; for portaled content that must appear over modals. */
  AboveModal: "above-modal",
} as const;
export type ZIndex = `${(typeof ZIndex)[keyof typeof ZIndex]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ZIndex {
  export type Default = typeof ZIndex.Default;
  export type Low = typeof ZIndex.Low;
  export type Medium = typeof ZIndex.Medium;
  export type High = typeof ZIndex.High;
  export type AboveModal = typeof ZIndex.AboveModal;
}

/**
 * Numeric z-index values for each named value.
 * Used by theme CSS variables (e.g. --z-low, --z-above-modal).
 */
export const Z_INDEX_VALUES: Record<ZIndex, number | "auto"> = {
  [ZIndex.Default]: "auto",
  [ZIndex.Low]: 10,
  [ZIndex.Medium]: 100,
  [ZIndex.High]: 1000,
  [ZIndex.AboveModal]: 10010,
};

/**
 * Returns the Tailwind z-index class for the given z-index.
 * Default uses "z-auto"; others use the theme CSS variable (e.g. z-[var(--z-above-modal)]).
 */
export function zIndexStyles(zIndex: ZIndex): string {
  if (zIndex === ZIndex.Default) {
    return "z-auto";
  }
  const varName = `--z-${zIndex}`;
  return `z-[var(${varName})]`;
}

export default ZIndex;
