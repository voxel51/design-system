/**
 * Copy one pattern group from the Lovable master into
 * `src/v2/components/patterns/<group>`, rewriting module specifiers and
 * reporting the application couplings that a human has to turn into props.
 *
 * Same principle as `port-lovable-ui.ts`: component bodies are not
 * transformed. What differs is that pattern components read application data
 * — mocks, stores, hooks, routers — and a design system cannot. Those imports
 * are left in place and listed, so the next step is visible rather than
 * silently guessed at.
 *
 * Usage:
 *   tsx utils/port-lovable-pattern.ts <group> [path-to-lovable-checkout]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";

const group = process.argv[2];
const SOURCE = resolve(process.argv[3] ?? "../fiftyone-copilot-internal");

if (!group) {
  console.error("Usage: tsx utils/port-lovable-pattern.ts <group> [lovable-path]");
  process.exit(1);
}

const SRC = join(SOURCE, "src/components", group);
const OUT = resolve("src/v2/components/patterns", group);

if (!existsSync(SRC)) {
  console.error(`No pattern group "${group}" at ${SRC}.`);
  process.exit(1);
}

/**
 * Specifier rewrites. `@/components/ui/*` and `@/lib/utils` resolve inside the
 * design system; everything else under `@/` is application state and is left
 * untouched for the report.
 */
const REWRITES: [RegExp, string][] = [
  [/from "@\/components\/ui\/([a-z0-9-]+)"/g, 'from "../../ui/$1"'],
  [new RegExp(`from "@/components/${group}/([A-Za-z0-9-]+)"`, "g"), 'from "./$1"'],
  [/from "@\/lib\/utils"/g, 'from "../../../lib/utils"'],
  [/from "@\/lib\/vizPalette"/g, 'from "../../../lib/vizPalette"'],
  [/from "@\/lib\/saveStatusStore"/g, 'from "../../../lib/saveStatusStore"'],
];

/**
 * Imports the design system cannot resolve — reported, never rewritten.
 *
 * Covers three kinds, and missing any of them under-reports the work:
 *   - application state: mocks, hooks, services, assets, lib
 *   - top-level components that live outside any group
 *   - components in a *different* pattern group, which is a port-order
 *     dependency rather than a prop seam
 */
const APP_IMPORT = new RegExp(
  String.raw`from "(@/(?:mocks|hooks|services|assets|lib)/[^"]+` +
    String.raw`|@/components/(?!ui/|${group}/)[^"]+)"`,
  "g",
);

const coupling = new Map<string, Set<string>>();
let count = 0;

mkdirSync(OUT, { recursive: true });

/** Copy a directory of sources, recursing so a group's own `lib/` comes too. */
const portDir = (from: string, to: string, prefix = "") => {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      portDir(join(from, entry.name), join(to, entry.name), `${prefix}${entry.name}/`);
      continue;
    }
    if (!/\.tsx?$/.test(entry.name)) continue;

    let code = readFileSync(join(from, entry.name), "utf8");
    for (const [pattern, replacement] of REWRITES) code = code.replace(pattern, replacement);

    const label = `${prefix}${entry.name}`;
    for (const m of code.matchAll(APP_IMPORT)) {
      if (!coupling.has(label)) coupling.set(label, new Set());
      coupling.get(label)!.add(m[1]);
    }

    writeFileSync(join(to, basename(entry.name)), code);
    count++;
  }
};

portDir(SRC, OUT);

console.log(`Ported ${count} file(s) into src/v2/components/patterns/${group}`);

if (coupling.size) {
  const total = [...coupling.values()].reduce((n, s) => n + s.size, 0);
  console.log(
    `\n${total} application import(s) across ${coupling.size} file(s) need a prop seam:`,
  );
  for (const [file, imports] of coupling) {
    console.log(`  ${file}`);
    for (const i of imports) console.log(`    ${i}`);
  }
  console.log(
    "\nReplace each with a prop, a callback or a type owned by the pattern.",
  );
} else {
  console.log("No application couplings — this group is self-contained.");
}
