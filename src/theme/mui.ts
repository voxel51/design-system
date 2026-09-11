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
 * object straight into MUI's `createTheme`.
 *
 * @example Set up the theme once at the app root
 * ```tsx
 * import { createTheme, ThemeProvider } from "@mui/material/styles";
 * import { voodoMuiThemeOptions } from "@voxel51/voodo";
 * import "@voxel51/voodo/theme.css"; // REQUIRED — defines the CSS variables
 *
 * const theme = createTheme(voodoMuiThemeOptions);
 *
 * export function App() {
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <Root />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example MUI components are then Voodo-styled automatically
 * ```tsx
 * <Paper />                                  // background = Voodo card surface
 * <Button color="primary">Save</Button>      // Voodo brand orange
 * <Typography color="text.secondary">Hi</Typography>
 * ```
 *
 * @example Merge app-specific overrides
 * ```ts
 * import { deepmerge } from "@mui/utils";
 *
 * const theme = createTheme(
 *   deepmerge(voodoMuiThemeOptions, {
 *     shape: { borderRadius: 8 },
 *     components: { MuiButton: { defaultProps: { disableElevation: true } } },
 *   })
 * );
 * ```
 *
 * Light/dark follows Voodo's `.dark` class on an ancestor — not MUI's
 * `palette.mode` — since the variables themselves switch. Toggle dark by
 * adding/removing `.dark` on a wrapping element; Voodo and MUI flip together.
 *
 * Caveat: MUI can't mathematically derive shades or alpha tints from
 * `var(--…)` colors, so every palette shade is supplied explicitly and some
 * MUI auto-effects (computed hover/ripple overlays) may differ from a
 * hex-based theme.
 */
const c = cssVar.color;

// Contrast text for filled variants. Figma has no contrast-text token, and a
// mode-reactive one would go near-black on an orange button in light mode.
const FILLED_TEXT = "#FFFFFF";

export const voodoMuiThemeOptions = {
  palette: {
    primary: {
      main: c.brand.primary,
      light: c.brand.accent,
      dark: c.interactive["primary-pressed"],
      contrastText: FILLED_TEXT,
    },
    // NOTE: every palette color provides main+light+dark+contrastText.
    // MUI computes missing shades via lighten()/darken(), which parse the
    // color — and they CANNOT parse a `var(--…)` value (it throws). Supplying
    // all four means MUI never tries to compute, so var-based colors work.
    error: {
      main: c.interactive["danger-default"],
      light: c.interactive["danger-hover"],
      dark: c.interactive["danger-pressed"],
      contrastText: FILLED_TEXT,
    },
    // warning/info have no hover/pressed ramp in Voodo yet, so shades are flat.
    warning: {
      main: c.semantic.warning,
      light: c.semantic.warning,
      dark: c.semantic.warning,
      contrastText: FILLED_TEXT,
    },
    info: {
      main: c.semantic.info,
      light: c.semantic.info,
      dark: c.semantic.info,
      contrastText: FILLED_TEXT,
    },
    success: {
      main: c.interactive["success-default"],
      light: c.interactive["success-hover"],
      dark: c.interactive["success-pressed"],
      contrastText: FILLED_TEXT,
    },
    background: {
      default: c.bg.background,
      paper: c.bg["card-1"],
    },
    text: {
      primary: c.text.primary,
      secondary: c.text.secondary,
      disabled: c.text.tertiary,
    },
    divider: c.border.default,
    action: {
      active: c.icon.default,
      hover: c.interactive["secondary-hover"],
      selected: c.interactive["secondary-default"],
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
