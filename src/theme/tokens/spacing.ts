/**
 * Spacing.
 *
 * Two tiers, because Figma's names are values and Tailwind's are too.
 *
 * `spacing` mirrors the Figma `spacing/*` scale verbatim — Figma re-keyed it
 * from steps to raw pixels, so `spacing/16` means 16px and not the 64px that
 * the identically-named step used to mean.
 *
 * `spacingRole` is the tier Figma's Primitives collection does not have yet,
 * and is what consumers bind to. Only these reach CSS: see the note below.
 */

/** The Figma `spacing/*` scale. Keys are pixel values, not steps. */
export const spacing = {
  2: "2px",
  4: "4px",
  6: "6px",
  8: "8px",
  10: "10px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
  64: "64px",
} as const;

/**
 * Named spacing roles — the public surface.
 *
 * **These, and only these, are emitted as `--spacing-*` custom properties.**
 * Tailwind v4 derives every numeric spacing utility from a single multiplier
 * (`--spacing: 0.25rem`), so `py-2` is `calc(var(--spacing) * 2)` = 8px — but
 * only while `--spacing-2` is undefined. Emitting the numeric scale above
 * would define it, silently redefining `py-2` as 2px and doing the same to 71
 * other numeric utilities, with no error from tsc, eslint or the suite.
 *
 * Values are unchanged from the previous t-shirt scale, so this tier is a
 * rename of nothing: xs was 0.25rem = 4px and still is.
 */
export const spacingRole = {
  xs: spacing[4],
  sm: spacing[8],
  md: spacing[16],
  lg: spacing[24],
  xl: spacing[32],
} as const;
