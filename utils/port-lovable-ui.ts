/**
 * One-shot importer: copy the Lovable master project's `components/ui` tree
 * into `src/v2/components/ui`, rewriting only module specifiers.
 *
 * The component bodies are NOT transformed. Keeping them byte-identical is
 * the point: a page ported from Lovable must render the same pixels, and any
 * hand-editing during import is a place where drift starts.
 *
 * Usage:
 *   tsx utils/port-lovable-ui.ts [path-to-lovable-checkout]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";

const SOURCE = resolve(
  process.argv[2] ?? "../fiftyone-copilot-internal",
);
const UI_SRC = join(SOURCE, "src/components/ui");
const UI_OUT = resolve("src/v2/components/ui");
const HOOKS_OUT = resolve("src/v2/hooks");
const LIB_OUT = resolve("src/v2/lib");

if (!existsSync(UI_SRC)) {
  console.error(`Lovable checkout not found at ${SOURCE}.`);
  console.error("Pass the path explicitly: tsx utils/port-lovable-ui.ts ../fiftyone-copilot-internal");
  process.exit(1);
}

/** Specifier rewrites, applied in order. Everything else is left alone. */
const REWRITES: [RegExp, string][] = [
  [/from "@\/components\/ui\/([a-z0-9-]+)"/g, 'from "./$1"'],
  [/from "@\/hooks\/([a-zA-Z0-9-]+)"/g, 'from "../../hooks/$1"'],
  [/from "@\/lib\/utils"/g, 'from "../../lib/utils"'],
  [/from "@\/lib\/([a-zA-Z0-9-]+)"/g, 'from "../../lib/$1"'],
];

const port = (src: string, outDir: string, rewrites = REWRITES) => {
  let code = readFileSync(src, "utf8");
  for (const [pattern, replacement] of rewrites) {
    code = code.replace(pattern, replacement);
  }
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, basename(src)), code);
  return basename(src);
};

const ported = readdirSync(UI_SRC)
  .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
  .map((f) => port(join(UI_SRC, f), UI_OUT));

// Hooks and lib helpers the ui tree depends on. `use-mobile` backs the
// Sidebar's responsive collapse; `use-toast` is the toast store.
for (const hook of ["use-mobile.tsx", "use-toast.ts"]) {
  const src = join(SOURCE, "src/hooks", hook);
  if (existsSync(src)) {
    port(src, HOOKS_OUT, [
      [/from "@\/components\/ui\/([a-z0-9-]+)"/g, 'from "../components/ui/$1"'],
      [/from "@\/lib\/utils"/g, 'from "../lib/utils"'],
    ]);
  }
}

const viz = join(SOURCE, "src/lib/vizPalette.ts");
if (existsSync(viz)) port(viz, LIB_OUT, []);

console.log(`Ported ${ported.length} ui modules to src/v2/components/ui`);
