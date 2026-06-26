import { cssVar } from "./cssVar";

/**
 * MUI theme bridge for consuming Voodo tokens in Material UI apps (e.g. the
 * FiftyOne app's legacy MUI components).
 *
 * `voodoMuiThemeOptions` maps Voodo's semantic CSS variables onto MUI's
 * `ThemeOptions` shape, so MUI components inherit Voodo's palette/typography
 * and stay theme-reactive (light/dark) and drift-free. Because every value is
 * a `var(--…)` reference, you never embed a hardcoded Voodo color.
 *
 * Voodo intentionally takes **no dependency** on `@mui/material`; pass this
 * object straight into MUI's `createTheme`:
 *
 * ```ts
 * import { createTheme } from "@mui/material/styles";
 * import { voodoMuiThemeOptions } from "@voxel51/voodo";
 * import "@voxel51/voodo/theme.css"; // defines the CSS variables
 *
 * const theme = createTheme(voodoMuiThemeOptions);
 * // or merge app overrides: createTheme(deepmerge(voodoMuiThemeOptions, {...}))
 * ```
 *
 * Light/dark follows Voodo's `.dark` class on an ancestor — not MUI's
 * `palette.mode` — since the variables themselves switch.
 *
 * Caveat: MUI can't mathematically derive shades or alpha tints from
 * `var(--…)` colors, so every palette shade is supplied explicitly and some
 * MUI auto-effects (computed hover/ripple overlays) may differ from a
 * hex-based theme.
 */
const c = cssVar.color;

export const voodoMuiThemeOptions = {
  palette: {
    primary: {
      main: c.brand.primary,
      light: c.brand.accent,
      dark: c.action.primary.tertiary,
      contrastText: c.action.primary.text,
    },
    // NOTE: every palette color provides main+light+dark+contrastText.
    // MUI computes missing shades via lighten()/darken(), which parse the
    // color — and they CANNOT parse a `var(--…)` value (it throws). Supplying
    // all four means MUI never tries to compute, so var-based colors work.
    error: {
      main: c.action.danger.primary,
      light: c.action.danger.secondary,
      dark: c.action.danger.tertiary,
      contrastText: c.action.danger.text,
    },
    // warning/info have no hover/pressed ramp in Voodo yet, so shades are flat.
    warning: {
      main: c.semantic.warning,
      light: c.semantic.warning,
      dark: c.semantic.warning,
      contrastText: c.action.primary.text,
    },
    info: {
      main: c.semantic.info,
      light: c.semantic.info,
      dark: c.semantic.info,
      contrastText: c.action.primary.text,
    },
    success: {
      main: c.action.success.primary,
      light: c.action.success.secondary,
      dark: c.action.success.tertiary,
      contrastText: c.action.success.text,
    },
    background: {
      default: c.bg.background,
      paper: c.bg.card[1],
    },
    text: {
      primary: c.text.primary,
      secondary: c.text.secondary,
      disabled: c.text.tertiary,
    },
    divider: c.border.default,
    action: {
      active: c.icon.default,
      hover: c.action.secondary.secondary,
      selected: c.action.secondary.primary,
      disabled: c.text.placeholder,
      disabledBackground: c.bg.muted,
      focus: c.focus.ring,
    },
  },
  typography: {
    fontFamily: cssVar.fontFamily.sans,
    body1: { fontSize: cssVar.text.md },
    body2: { fontSize: cssVar.text.sm },
    caption: { fontSize: cssVar.text.xs },
    button: { fontSize: cssVar.text.md, textTransform: "none" as const },
    h1: { fontSize: cssVar.text.xxl },
    h2: { fontSize: cssVar.text.xl },
    h3: { fontSize: cssVar.text.lg },
  },
};
