# AGENTS.md — VOODO design system

Instructions for AI coding agents working on `@voxel51/voodo` (this repo).
Everything here is published to every product that uses VOODO, so the bar is
the public API, not just this repo's build.

## Tokens

Token props take plain strings: `<Button variant="primary" size="sm">`. New
token sets follow the const-object pattern used throughout `src/types`, which
accepts both the string and the member (`Variant.Primary`):

    export const CardBackground = {
      Primary: "primary",
      Secondary: "secondary",
    } as const;
    export type CardBackground =
      `${(typeof CardBackground)[keyof typeof CardBackground]}`;

Never use TypeScript's `enum` keyword for a token. A string enum rejects plain
strings, which breaks the API every other token offers.

Color tokens are generated from the Figma file. Do not hand-edit
`src/theme/tokens/colors.ts` or `src/types/color.ts`; each names its generator
in its header. `src/theme/cssVar.ts`, `src/styles/color-classes.ts` and the
gitignored `src/styles/tailwind.css` are generated too: run
`npm run generate-tailwind-theme`.

## CSS variables

In components, reach colors through `bgColorClass`, `textColorClass`,
`borderColorClass` or `getColorCssVar`, never a hand-written `var(--color-…)`
string. The type-checker cannot see strings, so a token rename breaks them
silently. Plain `.css` files have no choice; after any token rename, grep
`src/` for the old names.

## JSDoc

JSDoc is the documentation agents read: it ships in the `.d.ts` files, and
`voodo list` / `voodo docs <Name>` print it. For every exported component:

- The first sentence is a standalone summary; `voodo list` shows exactly it.
- Every prop the component declares itself has a `@param`, and every `@param`
  names a real prop.
- At least one `@example`, written with string token props. Examples are not
  compiled, so check that yours would: wrong member names have shipped in
  examples unnoticed.

`npm test` fails when an exported component has no summary or no `@example`.
Mark plumbing that consumers should not use `@internal`: it is exempt, and
`voodo list` hides it.

## Public API

`src/__contracts__/voodo-tests.tsx` pins the public types; change it only for
an intended API change, and let the diff show it. Renaming or removing an
export or token is a breaking change and needs a major version.

Merging to `main` publishes nothing. Pushing a `vX.Y.Z` tag publishes to npm
and to the Storybook site; `package.json` must already carry that version.

## Before opening a PR

    npm run validate:all
    node bin/voodo.mjs docs <Name>   # for each component you changed; needs a build

## TypeScript

Keep new code strictly typed. No `any`, and no suppressions (`@ts-ignore`,
`@ts-expect-error`, `eslint-disable`) without a comment explaining why.
