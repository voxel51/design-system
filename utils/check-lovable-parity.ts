/**
 * Fail when the design system has fallen behind the Lovable master project.
 *
 * The design system is only a drop-in for a Lovable page if it actually
 * exports everything that page can import. This compares the master's
 * `components/ui` inventory — module names and exported symbols — against
 * v2, and reports pattern directories that have no design-system equivalent.
 *
 * Run it in CI against a checkout of voxel51/fiftyone-copilot-internal. A
 * component added to the mocks then shows up as a failure here rather than as
 * a hand-rolled one-off in a product repo three weeks later.
 *
 * Usage:
 *   tsx utils/check-lovable-parity.ts [path-to-lovable-checkout]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, join, resolve } from "path";

const SOURCE = resolve(process.argv[2] ?? "../fiftyone-copilot-internal");
const UI_SRC = join(SOURCE, "src/components/ui");
const UI_OUT = resolve("src/v2/components/ui");
const PATTERNS_OUT = resolve("src/v2/components/patterns");

if (!existsSync(UI_SRC)) {
  console.error(`Lovable checkout not found at ${SOURCE}.`);
  console.error("Pass the path explicitly, or clone voxel51/fiftyone-copilot-internal alongside this repo.");
  process.exit(2);
}

const moduleNames = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.tsx?$/.test(f) && !/\.(spec|test|stories)\./.test(f))
        .map((f) => f.replace(/\.tsx?$/, ""))
        .sort()
    : [];

/** Exported symbol names, read syntactically — no type checker needed. */
const exportedNames = (file: string): Set<string> => {
  const code = readFileSync(file, "utf8");
  const names = new Set<string>();
  for (const m of code.matchAll(
    /export\s+(?:declare\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_]+)/g,
  ))
    names.add(m[1]);
  for (const m of code.matchAll(/export\s*\{([^}]*)\}/g))
    for (const part of m[1].split(","))
      if (part.trim())
        names.add(part.trim().split(/\s+as\s+/).pop()!.trim().replace(/^type\s+/, ""));
  return names;
};

const resolveModule = (dir: string, mod: string): string | undefined =>
  [".tsx", ".ts"].map((ext) => join(dir, `${mod}${ext}`)).find(existsSync);

const failures: string[] = [];
const warnings: string[] = [];

// 1. Every Lovable ui module exists in v2.
const source = moduleNames(UI_SRC);
const ported = new Set(moduleNames(UI_OUT));
const missingModules = source.filter((m) => !ported.has(m));
if (missingModules.length) {
  failures.push(
    `${missingModules.length} component(s) in the Lovable master have no v2 equivalent:\n` +
      missingModules.map((m) => `    ${m}`).join("\n"),
  );
}

// 2. Every symbol those modules export exists in v2's copy. A page importing
//    a variant helper or a type is just as broken by a missing export as by a
//    missing component.
for (const mod of source) {
  if (!ported.has(mod)) continue;
  const from = resolveModule(UI_SRC, mod);
  const to = resolveModule(UI_OUT, mod);
  if (!from || !to) continue;
  const have = exportedNames(to);
  const missing = [...exportedNames(from)].filter((n) => !have.has(n));
  if (missing.length) {
    failures.push(`${mod}: missing export(s) ${missing.join(", ")}`);
  }
}

// 3. Every component has a story. Undocumented components get rebuilt by the
//    next person who cannot find them, which is how a design system grows a
//    second Button.
const withoutStories = [...ported].filter(
  (m) => !existsSync(join(UI_OUT, `${m}.stories.tsx`)),
);
if (withoutStories.length) {
  failures.push(
    `${withoutStories.length} component(s) have no story:\n` +
      withoutStories.map((m) => `    ${m}`).join("\n"),
  );
}

// 4. Pattern directories. Reported as warnings, not failures: patterns land
//    incrementally, and the list is the backlog rather than a broken build.
const patternDirs = readdirSync(join(SOURCE, "src/components"))
  .filter((d) => d !== "ui" && statSync(join(SOURCE, "src/components", d)).isDirectory())
  .sort();
const havePatterns = new Set(
  existsSync(PATTERNS_OUT)
    ? readdirSync(PATTERNS_OUT).map((d) => basename(d, ".tsx"))
    : [],
);
const missingPatterns = patternDirs.filter((d) => !havePatterns.has(d));
if (missingPatterns.length) {
  const counts = missingPatterns.map((d) => {
    const n = readdirSync(join(SOURCE, "src/components", d)).filter((f) =>
      f.endsWith(".tsx"),
    ).length;
    return `    ${d} (${n} component${n === 1 ? "" : "s"})`;
  });
  warnings.push(
    `${missingPatterns.length} pattern group(s) not yet in the design system:\n` +
      counts.join("\n"),
  );
}

console.log(
  `Atomic parity: ${source.length - missingModules.length}/${source.length} modules present.`,
);
console.log(
  `Story coverage: ${ported.size - withoutStories.length}/${ported.size} components documented.`,
);

for (const w of warnings) console.log(`\nwarning: ${w}`);

if (failures.length) {
  console.error(`\n${failures.length} parity failure(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log("No parity failures.");
