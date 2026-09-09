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
   * **`md` and `lg` are re-pointed to the two steps Figma added.** The 08-25
   * scale had no 14 or 16; the current one adds exactly those two and nothing
   * else, and the text styles went 6 -> 12 at the same time. Nothing else in
   * the file consumes them, so if they are not the new body and heading sizes
   * they were added for no reason. `md` is body text, so this is the change
   * that is actually visible.
   *
   * ASSUMPTION — the text styles are not exportable, so which role binds to 14
   * vs 16 is inferred, not read. Revert by putting `md` back to 13 and `lg`
   * to 15; nothing else depends on the choice.
   */
  fontSize: {
    xxs: fontSize[9],
    xs: fontSize[11],
    sm: fontSize[12],
    md: fontSize[14],
    lg: fontSize[16],
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
