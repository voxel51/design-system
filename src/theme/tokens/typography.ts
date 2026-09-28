/**
 * Typography.
 *
 * Same two-tier split as spacing, and for the same reason: Figma re-keyed
 * `font-size` and `line-height` from t-shirt names to pixel values, and the
 * role names Tailwind emits (`text-sm`, `text-lg`) have to keep meaning what
 * they mean today.
 */

/** The Figma `font-size/*` scale. Keys are pixel values. */
export const fontSize = {
  9: "9px",
  11: "11px",
  12: "12px",
  13: "13px",
  14: "14px",
  15: "15px",
  16: "16px",
  18: "18px",
  23: "23px",
} as const;

/** The Figma `line-height/*` scale. Keys are pixel values. */
export const lineHeight = {
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  28: "28px",
  36: "36px",
  44: "44px",
  52: "52px",
} as const;

export const typography = {
  fontFamily: {
    sans: ["Palanquin", "sans-serif"],
    // Figma names a real face here. It was the generic `monospace` keyword,
    // which resolved to whatever the OS picked — so code blocks rendered
    // differently on every machine and never matched the design.
    mono: ["Roboto Mono", "monospace"],
  },

  /**
   * Named size roles — the public surface, and the only tier emitted as
   * `--text-*`.
   *
   * Emitting the numeric scale instead would leave `--text-sm` and `--text-lg`
   * undefined, and Tailwind would quietly fall back to its own built-in scale
   * across 41 call sites.
   *
   * Values are deliberately unchanged from the previous scale, so this tier is
   * a rename of nothing.
   *
   * Figma added `font-size/14` and `/16` and nothing consumes them yet. They
   * are almost certainly the new body and heading sizes, but re-pointing `md`
   * and `lg` at them in isolation makes type look worse, not better: the
   * line-heights these sizes are paired with are raw Tailwind numbers
   * (`text-md/5`), not tokens, so the size moves and the leading does not.
   * Size and leading have to be tokenised together, against Figma's 12 text
   * styles. Until then this tier holds still.
   */
  fontSize: {
    xxs: fontSize[9],
    xs: fontSize[11],
    sm: fontSize[12],
    md: fontSize[13],
    lg: fontSize[15],
    xl: fontSize[18],
    xxl: fontSize[23],
  },

  /**
   * Figma's `font-weight/*` scale, verbatim.
   *
   * The previous map (light 300, normal 400, semibold 500, bold 600) matched
   * no Figma variable — `semibold` was a step light of Figma's, and `light`
   * had no counterpart at all. Nothing reads these: they are not emitted as
   * custom properties and the `font-*` utilities in use come from Tailwind's
   * own scale, so this corrects the data without moving any pixels.
   */
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
