/**
 * Typography tokens — GENERATED from Figma's variable export by
 * kb/eng/projects/design-system-tokens/tools/build_typography.py.
 * Do not edit by hand; re-run the generator instead.
 *
 * Two tiers:
 *  - the primitive scales, verbatim from the export
 *  - `role`: the names designers apply. Figma keeps these in text
 *    styles, which `Variables → Export` does not include, so the map
 *    lives in the generator and is checked against the primitives on
 *    every run.
 */
export const typography = {
  fontFamily: {
    sans: ["Palanquin", "sans-serif"],
    mono: ["monospace"],
  },
  fontSize: {
    xxs: "9px",
    xs: "11px",
    sm: "12px",
    md: "13px",
    lg: "15px",
    xl: "18px",
    xxl: "23px",
  },
  lineHeight: {
    xxs: "16px",
    xs: "20px",
    sm: "24px",
    md: "28px",
    lg: "36px",
    xl: "44px",
    xxl: "52px",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  /** Figma text styles. `size` is px; see the generator header. */
  role: {
    "body-primary": { size: "15px", weight: 400 }, // Body Primary
    "body-secondary": { size: "14px", weight: 400 }, // Body Secondary
    "body-tertiary": { size: "12px", weight: 400 }, // Body Tertiary
    "heading-md": { size: "16px", weight: 500 }, // Heading Medium
    caption: { size: "11px", weight: 400 }, // Caption
    code: { size: "11px", weight: 400 }, // Code Secondary
  },
} as const;
