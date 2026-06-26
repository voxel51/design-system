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
    error: {
      main: c.action.danger.primary,
      dark: c.action.danger.tertiary,
      contrastText: c.action.danger.text,
    },
    warning: { main: c.semantic.warning },
    info: { main: c.semantic.info },
    success: {
      main: c.action.success.primary,
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
