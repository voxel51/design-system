# VOODO: Voxel's Official Design Ontology

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-7289DA?logo=discord&logoColor=white)](https://discord.gg/fiftyone-community)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-purple?style=flat&logo=huggingface)](https://huggingface.co/Voxel51)
[![Voxel51 Blog](https://img.shields.io/badge/Voxel51_Blog-fa5300?style=flat)](https://voxel51.com/blog)
[![Newsletter](https://img.shields.io/badge/Newsletter-BE5B25?logo=mail.ru&logoColor=white)](https://share.hsforms.com/1zpJ60ggaQtOoVeBqIZdaaA2ykyk)
[![LinkedIn](https://img.shields.io/badge/In-white?style=flat&label=Linked&labelColor=blue)](https://www.linkedin.com/company/voxel51)
[![Twitter](https://img.shields.io/badge/Twitter-000000?logo=x&logoColor=white)](https://x.com/voxel51)
[![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/voxel51)

</div>

This library acts as both a design system and a component library for Voxel51's
front-end applications.

Note: this library is currently in a pre-release state and may have frequent breaking changes.
This library will adhere to semantic versioning best-practices starting with version 1.0.0.

## Installation

```shell
npm i @voxel51/voodo
```

## Usage

### Using components

This library exports a number of React components which are consistent with VOODO's look and feel.

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

Note that you'll need to import this library's theme somewhere in your application for the components
to be styled correctly. See [CSS Themes](#css-themes).

### Using icons

Every icon is exported as its own component so that bundlers only include the
icons you actually import (there is intentionally no icon-name enum or runtime
icon map — that would defeat tree-shaking):

```typescript jsx
import { CheckIcon, Size } from "@voxel51/voodo";

export const Component = () => <CheckIcon size={Size.Md} />;
```

To add a new icon, drop the SVG in `src/img` (PascalCase filename) and run
`npm run generate-icons`.

### Theming

#### CSS Themes

This library is based on Tailwind and exports a set of CSS variables which capture
the relevant colors, spacing, typography, etc.

To consume the CSS variables, simply include the following line somewhere in your
application.

```typescript
import "@voxel51/voodo/theme.css";
```

## Contributing

This library is based on [HeadlessUI](https://headlessui.com/) and [Tailwind](https://tailwindcss.com/). 
Components should be minimal, intentional, and adhere strictly to the Voxel51's internal design guidelines.

General rules of thumb:
 - Prefer explicit behavior over implicit
 - Provide configurability where appropriate
   - Ensure top-level properties adhere to design guidelines
   - Allow for property overrides
 - Prefer small, composable components

## Publishing

Pushing a `v*` tag publishes to NPM via the `release` workflow.

Stable release, on `main`:

```shell
npm version minor && git push --follow-tags
```

The tag must match `package.json` or the workflow fails.

Prerelease, on any branch:

```shell
git tag v0.2.0-dev-my-feature.0 && git push origin v0.2.0-dev-my-feature.0
```

Prerelease versions (`vX.Y.Z-<id>.N`) are stamped from the tag — they never
appear in `package.json` — and publish under NPM dist-tag `<id>`
(`npm i @voxel51/voodo@dev-my-feature`), so `latest` only moves on stable
releases. Use `rc` as the id for release candidates from `main` and
`dev-<branch>` for feature-branch builds.

This library is currently in a pre-release state, with versions matching `0.x.y`.
Standard semantic versioning will be enforced starting with version `1.0.0`.

## License

Copyright 2024-2026 Voxel51, Inc. Licensed under the [Apache License, Version 2.0](LICENSE).

A portion of the icon artwork is derived from
[Google Material Icons](https://fonts.google.com/icons) (Apache License 2.0),
extracted via [`@mui/icons-material`](https://mui.com/material-ui/material-icons/)
(MIT License). See [NOTICE](NOTICE) for attribution details.
