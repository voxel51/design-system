import { createTheme, ThemeOptions } from "@mui/material";
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
  mode?: "light" | "dark";
  overrides?: ThemeOptions;
}) => {
  const { light, dark } = colors;
  const activeTheme = mode === "light" ? light : dark;

  const baseTheme = createTheme({
    palette: {
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
    },
    typography: {
      fontFamily: typography.fontFamily.sans.join(","),
      // todo h1-h6
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
    // todo shape
  });

  const componentTheme = createComponentTheme(baseTheme);

  const themeParts = [baseTheme, componentTheme, overrides ?? {}];
  const resolvedTheme = themeParts.reduce((a, b) =>
    deepmerge(a, b)
  ) as ThemeOptions;

  return createTheme(resolvedTheme);
};

export const defaultTheme = createMUITheme({});
