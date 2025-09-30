import { GlobalProvider, ThemeState } from "@ladle/react";
import { ThemeProvider } from "@/theme/ThemeProvider";

export const Provider: GlobalProvider = ({ children, globalState }) => (
  <ThemeProvider
    mode={globalState.theme === ThemeState.Light ? "light" : "dark"}
  >
    {children}
  </ThemeProvider>
);
