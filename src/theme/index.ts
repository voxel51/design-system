export * from "./tokens";
// Not redundant with the `export *` above: `tokens/index.ts` is its own build
// entry (the `./tokens` subpath), and rollup does not forward a build entry's
// star exports into the root chunk. Removing this line drops both from the
// package root — silently, which is why utils/verify-exports.mjs checks it.
export { palettePool, paletteSlots } from "./tokens/palette";
export { cssVar } from "./cssVar";
export { voodoMuiThemeOptions } from "./mui";
export { useColorMode, useColorPalette } from "./useColorPalette";
export type { ColorMode, ColorPalette } from "./useColorPalette";
