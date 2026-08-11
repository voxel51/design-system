/**
 * Verify that the built bundles actually export what consumers import.
 *
 * Type-checking the source is not enough: rollup decides what ends up in each
 * chunk, and it does not forward star exports out of a module that is itself a
 * build entry. `src/theme/tokens/index.ts` became such an entry when the
 * `./tokens` subpath was added, which silently dropped `palettePool` and
 * `paletteSlots` from the package root even though `src/theme/index.ts`
 * re-exported them and `tsc` was happy. Nothing in the test suite could see
 * that, because jest runs against source.
 *
 * Runs on `postbuild`, so a missing export fails the build rather than
 * reaching a consumer as a runtime `undefined`.
 */

const EXPECTED = {
  "../dist/index.js": [
    "Button",
    "colors",
    "cssVar",
    "palettePool",
    "paletteSlots",
    "primitives",
    "transitions",
    "useColorMode",
    "useColorPalette",
    "voodoMuiThemeOptions",
  ],
  "../dist/tokens.js": [
    "colors",
    "palettePool",
    "paletteSlots",
    "primitives",
    "transitions",
  ],
};

const failures = [];

for (const [entry, names] of Object.entries(EXPECTED)) {
  let module;
  try {
    module = await import(entry);
  } catch (error) {
    failures.push(`${entry} could not be imported: ${error.message}`);
    continue;
  }

  const missing = names.filter((name) => module[name] === undefined);
  if (missing.length > 0) {
    failures.push(`${entry} is missing: ${missing.join(", ")}`);
  }
}

// The tokens entry must stay free of React and CSS — it exists so workers and
// other non-UI consumers can read token values
const { readFileSync } = await import("fs");
const tokensBundle = readFileSync(
  new URL("../dist/tokens.js", import.meta.url),
  "utf8"
);
const contamination = ["react", "jsx", ".css"].filter((needle) =>
  tokensBundle.includes(needle)
);
if (contamination.length > 0) {
  failures.push(
    `dist/tokens.js should not reference ${contamination.join(", ")} — ` +
      "the tokens entry must stay importable from non-UI contexts"
  );
}

if (failures.length > 0) {
  console.error("✗ Export verification failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("✅ Verified bundle exports (root + tokens entry)");
