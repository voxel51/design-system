# VOODO: Voxel's Official Design Ontology

This library acts as both a design system and a component library for Voxel51's
front-end applications.

Note: this library is currently in a pre-release state and may have frequent
breaking changes. This library will adhere to semantic versioning
best-practices starting with version 1.0.0.

## Development

### Viewing Components

To view and interact with VOODO components in a live environment, use the
[design-system-documentation](https://github.com/voxel51/design-system-documentation)
repository. Follow the setup instructions there to run the documentation webapp
locally.

### Local Development

When developing components in this repository:

```shell
# Install dependencies
npm install

# Build the library
npm run build

# create local npm link for `design-system-documentation`
npm link

# Run in watch mode (rebuilds on file changes)
npm run dev
```

## Installation

```shell
npm i @voxel51/voodo
```

## Usage

### Using components

This library exports a number of React components which are consistent with
VOODO's look and feel.

```typescript jsx
import { Button } from "@voxel51/voodo";

export const Component = () => {
    return (
        <Button onClick={() => alert("Button clicked!")}>
            Click me!
        </Button>
    )
};
```

Note that you'll need to import this library's theme somewhere in your
application for the components to be styled correctly. See
[CSS Themes](#css-themes).

### Theming

#### CSS Themes

This library is based on Tailwind and exports a set of CSS variables which
capture the relevant colors, spacing, typography, etc.

To consume the CSS variables, simply include the following line somewhere in
your application.

```typescript
import "@voxel51/voodo/theme.css";
```

#### Usage with MUI

This library also exports theme configuration (in the form of a Material
`ThemeConfig`) which can be used to generate an MUI theme.

```typescript jsx

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultMUIThemeConfig, createMUIThemeConfig } from '@voxel51/voodo';

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

## Contributing

This library is based on [HeadlessUI](https://headlessui.com/) and
[Tailwind](https://tailwindcss.com/). Components should be minimal,
intentional, and adhere strictly to the Voxel51's internal design guidelines.

General rules of thumb:

- Prefer explicit behavior over implicit
- Provide configurability where appropriate
    - Ensure top-level properties adhere to design guidelines
    - Allow for property overrides
- Prefer small, composable components

## Publishing

This library is published to NPM via GitHub Actions workflows. Releases are
triggered by tagging a commit with a `v<version>` tag, where `<version>` should
match the `version` property in `package.json`. For example, the initial
release has the tag `v0.0.1`.

Once a release is tagged and published, the `version` property in
`package.json` should receive a patch bump.

This library is currently in a pre-release state, with versions matching
`0.x.y`. Standard semantic versioning will be enforced starting with version
`1.0.0`.
