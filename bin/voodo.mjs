#!/usr/bin/env node
// @ts-check
/**
 * `voodo`: agent-friendly docs for @voxel51/voodo, read from the installed
 * package's own type declarations, so the output always matches the version
 * that is installed.
 *
 *   npx @voxel51/voodo list
 *   npx @voxel51/voodo docs Button
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  findComponents,
  findTokenGroups,
  lookup,
  renderDocs,
  renderList,
  renderTokens,
  resolveExports,
} from "../dist/cli.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8")
);

const USAGE = `voodo: docs for @voxel51/voodo ${version}

  voodo list             every component, one line each
  voodo docs <Name>      one component's props, docs and token values
  voodo tokens [Group]   token values, e.g. \`voodo tokens TextColor\`
  voodo icons            every per-icon component name`;

/** @param {string} dir Relative to the package root, `/`-separated. */
const readDeclarations = (dir) => {
  const absolute = join(root, ...dir.split("/"));

  if (!existsSync(absolute)) {
    console.error(
      `voodo: ${dir} not found. In the design-system repo, run \`npm run build\` first.`
    );
    process.exit(1);
  }

  return readdirSync(absolute, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith(".d.ts"))
    .sort()
    .map((file) => ({
      path: `${dir}/${file.split(sep).join("/")}`,
      text: readFileSync(join(absolute, file), "utf8"),
    }));
};

const ICONS_FILE = "dist/components/Icons/icons.d.ts";

const [command, argument] = process.argv.slice(2);
const componentFiles = readDeclarations("dist/components");
const exported = resolveExports(
  new Map(componentFiles.map((file) => [file.path, file.text])),
  "dist/components/index.d.ts"
);
// Only what the package exports: the dist also holds internal modules.
const published = findComponents(componentFiles).filter(
  (entry) => exported.get(entry.name) === entry.file
);
const components = published.filter((entry) => entry.file !== ICONS_FILE);
const iconNames = published
  .filter((entry) => entry.file === ICONS_FILE)
  .map((entry) => entry.name);
const tokens = findTokenGroups([
  ...readDeclarations("dist/types"),
  ...componentFiles,
]);

switch (command) {
  case "list":
    console.log(renderList(components, iconNames, version));
    break;

  case "docs": {
    if (!argument) {
      console.error("Usage: voodo docs <Name>. Run `voodo list` for names.");
      process.exit(1);
    }

    const { match, suggestions } = lookup(components, argument);

    if (!match) {
      console.error(
        suggestions.length
          ? `No component named ${argument}. Did you mean: ${suggestions.join(", ")}?`
          : `No component named ${argument}. Run \`voodo list\` for names.`
      );
      process.exit(1);
    }

    const file = componentFiles.find((entry) => entry.path === match.file);
    console.log(renderDocs(match, file?.text ?? "", tokens));
    break;
  }

  case "tokens": {
    const output = renderTokens(tokens, argument);

    if (!output) {
      console.error(
        `No token group named ${argument}. Run \`voodo tokens\` for all.`
      );
      process.exit(1);
    }

    console.log(output);
    break;
  }

  case "icons":
    console.log(iconNames.join("\n"));
    break;

  default:
    console.log(USAGE);
    if (command && command !== "help" && command !== "--help") process.exit(1);
}
