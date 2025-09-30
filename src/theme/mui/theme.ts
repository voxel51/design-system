import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { colors } from "@/theme/default/colors";
import { spacing } from "@/theme/default/spacing";
import { createComponentTheme } from "@/theme/mui/components";
import { typography } from "@/theme/default/typography";

/**
 * Create a `Theme` object compatible with Material UI.
 *
 * @param mode Light or dark mode
 * @param overrides Optional theme overrides
 *
 * @returns `Theme` instance
 */
export const createMUITheme = ({
  mode = "dark",
  overrides = {},
}: {
  mode?: PaletteMode;
  overrides?: ThemeOptions;
}) => {
  const { light, dark } = colors;
  const activeTheme = mode === "light" ? light : dark;

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: activeTheme.primary.main,
      },
      secondary: {
        main: activeTheme.secondary.main,
      },
      error: {
        main: activeTheme.error.main,
      },
      // todo
      // warning: {},
      // success: {},
      // info: {},
      background: {
        default: activeTheme.background.body,
      },
    },
    typography: {
      fontFamily: typography.fontFamily.sans.join(","),
      h1: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
      },
      h2: {
        fontSize: typography.fontSize["2xl"],
        fontWeight: typography.fontWeight.bold,
      },
      h3: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
      },
      h4: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
      },
      h5: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.normal,
      },
      h6: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
      },
      body1: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.normal,
        color: activeTheme.text.primary,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
        color: activeTheme.text.secondary,
      },
    },
    spacing: (factor: number) =>
      spacing[factor as keyof typeof spacing] ?? `${factor * 0.25}rem`,
    // todo
    // shape: {}
  });

  const componentTheme = createComponentTheme(baseTheme);

  const themeParts = [baseTheme, componentTheme, overrides ?? {}];
  const resolvedTheme = themeParts.reduce((a, b) =>
    deepmerge(a, b)
  ) as ThemeOptions;

  return createTheme(resolvedTheme);
};

export const defaultTheme = createMUITheme({});
