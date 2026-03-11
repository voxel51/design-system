import type { ThemeOptions, PaletteMode } from "@mui/material";

import { getComponentThemeConfig } from "@/theme/mui/components";
import { colors } from "@/theme/tokens/colors";
import { typography } from "@/theme/tokens/typography";

/**
 * Create a theme configuration object compatible with Material UI's createTheme.
 * This is a plain object, not a Theme instance.
 *
 * @param mode Light or dark mode
 * @param overrides Optional theme overrides
 *
 * @returns ThemeOptions configuration object
 */
export const createMUIThemeConfig = ({
  mode = "dark",
  overrides = {},
}: {
  mode?: PaletteMode;
  overrides?: ThemeOptions;
} = {}): ThemeOptions => {
  const { light, dark } = colors;
  const activeTheme = mode === "light" ? light : dark;

  const baseConfig: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: activeTheme.action.primary.primary,
      },
      secondary: {
        main: activeTheme.action.secondary.primary,
      },
      error: {
        main: activeTheme.action.danger.primary,
      },
      background: {
        default: activeTheme.content.bg.background,
      },
    },
    typography: {
      fontFamily: typography.fontFamily.sans.join(","),
      h1: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
      },
      h2: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
      },
      h3: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
      },
      h4: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
      },
      h5: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
      },
      h6: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.normal,
      },
      body1: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.normal,
        color: activeTheme.content.text.primary,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
        color: activeTheme.content.text.primary,
      },
    },
    spacing: (factor: number) => `${factor * 0.25}rem`,
  };

  // Get component overrides
  const componentConfig = getComponentThemeConfig(baseConfig);

  // Merge base, components, and user overrides
  return {
    ...baseConfig,
    ...componentConfig,
    ...overrides,
    // Deep merge components specifically
    components: {
      ...componentConfig.components,
      ...overrides.components,
    },
  };
};

/**
 * Default theme configuration (dark mode)
 *
 * Usage:
 * ```tsx
 * import { createTheme } from '@mui/material/styles';
 * import { defaultMUIThemeConfig } from '@voxel51/design-system';
 *
 * const theme = createTheme(defaultMUIThemeConfig);
 * ```
 */
export const defaultMUIThemeConfig = createMUIThemeConfig({ mode: "dark" });

/**
 * Light mode theme configuration
 */
export const lightMUIThemeConfig = createMUIThemeConfig({ mode: "light" });
