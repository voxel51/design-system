# Voxel Design System

## Theming

### Usage with MUI

```typescript jsx

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultMUIThemeConfig, createMUIThemeConfig } from '@voxel51/design-system';

// Option 1: Use default (dark mode)
const theme = createTheme(defaultMUIThemeConfig);

// Option 2: Create light mode
const lightTheme = createTheme(createMUIThemeConfig({ mode: 'light' }));

// Option 3: With overrides
const customTheme = createTheme(
    createMUIThemeConfig({
        mode: 'dark',
        overrides: {
            palette: {
                primary: { main: '#custom-color' },
            },
        },
    })
);

function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* Your app */}
        </ThemeProvider>
    );
}
```