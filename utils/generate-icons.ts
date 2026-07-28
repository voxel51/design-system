import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates src/components/Icons/icons.tsx: one tree-shakable React component
 * per SVG in src/img.
 *
 * Run via `npm run generate-icons` after adding or removing an SVG.
 */

const IMG_DIR = path.resolve(__dirname, "../src/img");
const OUT_FILE = path.resolve(__dirname, "../src/components/Icons/icons.tsx");

const names = fs
  .readdirSync(IMG_DIR)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.replace(/\.svg$/, ""))
  .sort();

const invalid = names.filter((n) => !/^[A-Z][A-Za-z0-9]*$/.test(n));
if (invalid.length) {
  throw new Error(
    `SVG filenames must be PascalCase identifiers: ${invalid.join(", ")}`
  );
}

const lower = new Map<string, string>();
for (const n of names) {
  const clash = lower.get(n.toLowerCase());
  if (clash) {
    throw new Error(
      `SVG filenames must not differ only by case (breaks case-insensitive filesystems): ${clash} vs ${n}`
    );
  }
  lower.set(n.toLowerCase(), n);
}

const header = `// GENERATED FILE - DO NOT EDIT.
// Run \`npm run generate-icons\` after adding or removing an SVG in src/img.
//
// Each icon is exported as its own component so that bundlers can tree-shake
// unused icons; do not aggregate them into a runtime map inside this package.
import type { FC } from "react";

`;

const imports = names
  .map((n) => `import ${n}Svg from "@/img/${n}.svg?react";`)
  .join("\n");

const base = `\n\nimport { IconBase, type IconProps } from "./IconBase";\n\n`;

const components = names
  .map(
    (n) =>
      `export const ${n}Icon: FC<IconProps> = (props) => (\n  <IconBase {...props} svg={${n}Svg} />\n);`
  )
  .join("\n\n");

fs.writeFileSync(OUT_FILE, header + imports + base + components + "\n");
console.log(`Generated ${OUT_FILE} with ${names.length} icons.`);
