import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import ts from "typescript";

/**
 * Checks that every component in src/components is fully described for
 * consumers: a story, a Playwright page object, and a page-object spec that
 * agree with each other and with the `@voxel51/voodo/e2e` entry. Together with
 * `npm run test:pom`, which drives every story through its page object, this
 * is the `component alignment` PR check.
 *
 * Components that are not there yet are listed in
 * component-alignment-allowlist.json with a reason. The list only shrinks: a
 * component that becomes aligned must be removed from it, and a component that
 * is not on it must be aligned.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const E2E_ENTRY = path.join(ROOT, "src/e2e/index.ts");
const ALLOWLIST = path.join(__dirname, "component-alignment-allowlist.json");

/** Selectors a page object must never use: they leak markup, not behavior. */
const FORBIDDEN_IN_POM: [RegExp, string][] = [
  [/locator\(\s*["'`]\s*\./, "class selector"],
  [/data-headlessui/, "Headless UI internal attribute"],
  [/data-testid|getByTestId/, "test id (page objects locate by role and name)"],
  [/waitForTimeout/, "fixed timeout"],
];

const failures: string[] = [];
const fail = (component: string, message: string): void => {
  failures.push(`${component}: ${message}`);
};

const components = fs
  .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const allowlist = JSON.parse(fs.readFileSync(ALLOWLIST, "utf8")) as Record<
  string,
  string
>;

for (const name of Object.keys(allowlist)) {
  if (!components.includes(name)) {
    fail(name, "is on the allowlist but has no directory in src/components");
  }
}

const e2eEntry = fs.readFileSync(E2E_ENTRY, "utf8");

/** Public methods of every class in a page-object file that lack a doc comment. */
const undocumentedMethods = (file: string): string[] => {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );
  const missing: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isClassDeclaration(node) && node.name) {
      for (const member of node.members) {
        if (!ts.isMethodDeclaration(member) && !ts.isGetAccessor(member)) {
          continue;
        }
        const flags = ts.getCombinedModifierFlags(member);
        if (flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) {
          continue;
        }
        if (ts.getJSDocCommentsAndTags(member).length === 0) {
          missing.push(`${node.name.text}.${member.name.getText(source)}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return missing;
};

/** Every problem with one component, empty when it is aligned. */
const problems = (name: string): string[] => {
  const dir = path.join(COMPONENTS_DIR, name);
  const out: string[] = [];
  const storiesFile = path.join(dir, `${name}.stories.tsx`);
  const pomFile = path.join(dir, `${name}.pom.ts`);
  const specFile = path.join(dir, `${name}.pom.spec.ts`);

  if (!fs.existsSync(storiesFile)) {
    out.push(`missing ${name}.stories.tsx`);
  } else {
    const stories = fs.readFileSync(storiesFile, "utf8");
    if (!/^export const \w+: Story\b/m.test(stories)) {
      out.push(`${name}.stories.tsx exports no \`const X: Story\``);
    }
    if (!/title:\s*"[^"]+"/.test(stories)) {
      out.push(`${name}.stories.tsx has no string \`title\` in its meta`);
    }
  }

  if (!fs.existsSync(pomFile)) {
    out.push(`missing ${name}.pom.ts`);
  } else {
    const pom = fs.readFileSync(pomFile, "utf8");
    if (!new RegExp(`export class ${name}Pom\\b`).test(pom)) {
      out.push(`${name}.pom.ts does not export \`class ${name}Pom\``);
    }
    if (/^import (?!type\b)/m.test(pom)) {
      out.push(
        `${name}.pom.ts has runtime imports; page objects import types only`
      );
    }
    const code = pom.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    for (const [pattern, label] of FORBIDDEN_IN_POM) {
      if (pattern.test(code)) {
        out.push(`${name}.pom.ts uses a ${label}`);
      }
    }
    for (const method of undocumentedMethods(pomFile)) {
      out.push(`${method} has no doc comment`);
    }
    const exportLine = `export * from "../components/${name}/${name}.pom";`;
    if (!e2eEntry.includes(exportLine)) {
      out.push(`src/e2e/index.ts is missing \`${exportLine}\``);
    }
  }

  if (!fs.existsSync(specFile)) {
    out.push(`missing ${name}.pom.spec.ts`);
  } else {
    const spec = fs.readFileSync(specFile, "utf8");
    if (!spec.includes("storiesOf(import.meta.url)")) {
      out.push(`${name}.pom.spec.ts does not enumerate stories via storiesOf`);
    }
    if (!spec.includes("expectStoryIndexToMatch")) {
      out.push(`${name}.pom.spec.ts does not call expectStoryIndexToMatch`);
    }
    if (!spec.includes(`${name}Pom`)) {
      out.push(`${name}.pom.spec.ts does not use ${name}Pom`);
    }
  }

  return out;
};

for (const name of components) {
  const issues = problems(name);
  const allowed = name in allowlist;
  if (allowed && issues.length === 0) {
    fail(
      name,
      "is aligned; remove it from utils/component-alignment-allowlist.json"
    );
  }
  if (!allowed) {
    for (const issue of issues) fail(name, issue);
  }
}

const aligned = components.filter((name) => !(name in allowlist)).length;

if (failures.length > 0) {
  console.error("✗ Component alignment failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `✅ ${aligned}/${components.length} components aligned ` +
    `(${Object.keys(allowlist).length} allowlisted)`
);
