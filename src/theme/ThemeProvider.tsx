import { colors } from "@/theme/default/colors";
import { spacing } from "@/theme/default/spacing";
import { typography } from "@/theme/default/typography";
import { createContext, useContext } from "react";
import {
  CssBaseline,
  Theme,
  ThemeOptions,
  ThemeProvider as MaterialThemeProvider,
} from "@mui/material";
import { createMUITheme } from "@/theme/mui/theme";

export type DesignTokens = {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
};

const DesignSystemContext = createContext<DesignTokens | undefined>(undefined);

export const useDesignSystem = () => useContext(DesignSystemContext);

type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: Theme;
  overrides?: ThemeOptions;
  mode?: "light" | "dark";
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme,
  overrides,
  mode,
}) => {
  const resolvedTheme = theme ?? createMUITheme({ mode, overrides });
  const tokens: DesignTokens = {
    colors,
    spacing,
    typography,
  };

  return (
    <DesignSystemContext.Provider value={tokens}>
      <MaterialThemeProvider theme={resolvedTheme}>
        <CssBaseline />
        {children}
      </MaterialThemeProvider>
    </DesignSystemContext.Provider>
  );
};
