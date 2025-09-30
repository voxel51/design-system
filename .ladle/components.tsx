import { GlobalProvider, ThemeState } from "@ladle/react";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Box, useTheme } from "@mui/material";

export const Provider: GlobalProvider = ({ children, globalState }) => (
  <ThemeProvider
    mode={globalState.theme === ThemeState.Light ? "light" : "dark"}
  >
    <ThemedContainer>{children}</ThemedContainer>
  </ThemeProvider>
);

const ThemedContainer = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Box sx={{ background: theme.palette.background.default }}>{children}</Box>
  );
};
