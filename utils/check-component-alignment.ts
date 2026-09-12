import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import ts from "typescript";

/**
 * Checks that every component in src/components is fully described for
 * consumers: a story, a Playwright page object, and a page-object spec that
 * agree with each other and with the `@voxel51/voodo/e2e` entry. Page objects
 * follow the fiftyone e2e-pw conventions: `data-cy` test ids looked up with
 * getByTestId, locators as `get` accessors or get-prefixed methods, actions as
 * verbs, and assertions only in a composed `<Name>PomAsserter`. Together with
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
const PROPS_IGNORE = path.join(__dirname, "component-props-ignore.json");

/**
 * Props that imply a page-object member. A component exposing a matching prop
 * must have a page object or asserter with at least one of the listed members,
 * so the state the prop controls can be read, driven, or asserted.
 */
const PROP_METHODS: [RegExp, string[]][] = [
  [/^disabled$/, ["isDisabled"]],
  [/^onChange$/, ["getValue", "getSelectedLabels", "hasValue", "hasSelected"]],
  [/^value$/, ["getValue", "hasValue"]],
  [/^checked$/, ["isChecked", "hasChecked"]],
  [/^(options|items)$/, ["getOptionLabels", "getItemLabels"]],
  [/^onClick$/, ["click", "choose"]],
  [/^(open|onClose|onOpenChange)$/, ["isOpen"]],
];

/** Selectors a page object must never use: they leak markup, not behavior. */
const FORBIDDEN_IN_POM: [RegExp, string][] = [
  [/locator\(\s*["'`]\s*\./, "class selector"],
  [/data-headlessui/, "Headless UI internal attribute"],
  [/data-testid/, "data-testid (the test id attribute is data-cy)"],
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
const propsIgnore = JSON.parse(fs.readFileSync(PROPS_IGNORE, "utf8")) as Record<
  string,
  Record<string, string>
>;

for (const name of Object.keys(allowlist)) {
  if (!components.includes(name)) {
    fail(name, "is on the allowlist but has no directory in src/components");
  }
}
for (const name of Object.keys(propsIgnore)) {
  if (!components.includes(name)) {
    fail(name, "is in component-props-ignore.json but has no directory");
  }
}

const e2eEntry = fs.readFileSync(E2E_ENTRY, "utf8");

const stripComments = (code: string): string =>
  code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

const parse = (file: string): ts.SourceFile =>
  ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

interface Member {
  className: string;
  name: string;
  isGetter: boolean;
  /** The declared return type mentions `Locator`. */
  returnsLocator: boolean;
  documented: boolean;
}

/** Public members of every class in a page-object file. */
const classMembers = (file: string): Member[] => {
  const source = parse(file);
  const members: Member[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isClassDeclaration(node) && node.name) {
      for (const member of node.members) {
        const isGetter = ts.isGetAccessor(member);
        if (!ts.isMethodDeclaration(member) && !isGetter) continue;
        const flags = ts.getCombinedModifierFlags(member);
        if (flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) {
          continue;
        }
        members.push({
          className: node.name.text,
          name: member.name.getText(source),
          isGetter,
          returnsLocator: /\bLocator\b/.test(
            member.type?.getText(source) ?? ""
          ),
          documented: ts.getJSDocCommentsAndTags(member).length > 0,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return members;
};

/** Source text of every class in a file whose name does not end in Asserter. */
const nonAsserterClassText = (file: string): string => {
  const source = parse(file);
  const chunks: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isClassDeclaration(node) &&
      node.name &&
      !node.name.text.endsWith("Asserter")
    ) {
      chunks.push(node.getText(source));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return chunks.join("\n");
};

/** Own members of `interface <Name>Props` in the component's main file. */
const ownProps = (name: string, dir: string): string[] => {
  const file = path.join(dir, `${name}.tsx`);
  if (!fs.existsSync(file)) return [];
  const source = parse(file);
  const props: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === `${name}Props`) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
          props.push(member.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return props;
};

/**
 * Every prop name that some story passes through `args`, following spreads of
 * top-level object constants in the same file.
 */
const storyArgs = (storiesFile: string): Set<string> => {
  const source = parse(storiesFile);
  const constants = new Map<string, ts.ObjectLiteralExpression>();
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        constants.set(declaration.name.text, declaration.initializer);
      }
    }
  }
  const names = new Set<string>();
  const collect = (
    literal: ts.ObjectLiteralExpression,
    seen: Set<ts.Node>
  ): void => {
    if (seen.has(literal)) return;
    seen.add(literal);
    for (const property of literal.properties) {
      if (
        ts.isSpreadAssignment(property) &&
        ts.isIdentifier(property.expression)
      ) {
        const target = constants.get(property.expression.text);
        if (target) collect(target, seen);
      } else if (property.name && ts.isIdentifier(property.name)) {
        names.add(property.name.text);
      }
    }
  };
  const visit = (node: ts.Node): void => {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "args" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      collect(node.initializer, new Set());
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return names;
};

/** Every literal `data-cy` value the component's source renders. */
const renderedTestIds = (dir: string): Set<string> => {
  const ids = new Set<string>();
  const files = fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.endsWith(".tsx") &&
        !file.endsWith(".stories.tsx") &&
        !file.endsWith(".spec.tsx")
    );
  for (const file of files) {
    const code = stripComments(fs.readFileSync(path.join(dir, file), "utf8"));
    for (const match of code.matchAll(/\bdata-cy=["']([^"']+)["']/g)) {
      ids.add(match[1]);
    }
  }
  return ids;
};

/** Every literal test id a page object looks up. */
const pomTestIds = (code: string): Set<string> =>
  new Set(
    [...code.matchAll(/getByTestId\(\s*["']([^"']+)["']\s*\)/g)].map(
      (match) => match[1]
    )
  );

/** Every problem with one component, empty when it is aligned. */
const problems = (name: string): string[] => {
  const dir = path.join(COMPONENTS_DIR, name);
  const out: string[] = [];
  const storiesFile = path.join(dir, `${name}.stories.tsx`);
  const pomFile = path.join(dir, `${name}.pom.ts`);
  const specFile = path.join(dir, `${name}.pom.spec.ts`);
  const props = ownProps(name, dir);

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
    const covered = storyArgs(storiesFile);
    const ignored = propsIgnore[name] ?? {};
    for (const prop of props) {
      if (!covered.has(prop) && !(prop in ignored)) {
        out.push(
          `prop \`${prop}\` appears in no story's args ` +
            "(add a story or list it in utils/component-props-ignore.json)"
        );
      }
    }
    for (const prop of Object.keys(ignored)) {
      if (covered.has(prop)) {
        out.push(
          `prop \`${prop}\` is covered by a story; remove it from utils/component-props-ignore.json`
        );
      }
    }
  }

  if (!fs.existsSync(pomFile)) {
    out.push(`missing ${name}.pom.ts`);
  } else {
    const pom = fs.readFileSync(pomFile, "utf8");
    const code = stripComments(pom);
    if (!new RegExp(`export class ${name}Pom\\b`).test(pom)) {
      out.push(`${name}.pom.ts does not export \`class ${name}Pom\``);
    }
    if (!new RegExp(`export class ${name}PomAsserter\\b`).test(pom)) {
      out.push(`${name}.pom.ts does not export \`class ${name}PomAsserter\``);
    }
    if (!/readonly assert:/.test(pom)) {
      out.push(`${name}Pom does not expose \`readonly assert\``);
    }
    for (const match of pom.matchAll(
      /^import (?!type\b)[^"']*["']([^"']+)["']/gm
    )) {
      if (!match[1].startsWith(".") && match[1] !== "@playwright/test") {
        out.push(
          `${name}.pom.ts imports ${match[1]} at runtime; only @playwright/test ` +
            "and relative imports are allowed"
        );
      }
    }
    for (const [pattern, label] of FORBIDDEN_IN_POM) {
      if (pattern.test(code)) {
        out.push(`${name}.pom.ts uses a ${label}`);
      }
    }
    if (/\bexpect\(/.test(stripComments(nonAsserterClassText(pomFile)))) {
      out.push(
        `${name}.pom.ts asserts outside its Asserter class; page objects act and read, asserters expect`
      );
    }
    const members = classMembers(pomFile);
    for (const member of members) {
      if (!member.documented) {
        out.push(`${member.className}.${member.name} has no doc comment`);
      }
      if (
        member.returnsLocator &&
        !member.isGetter &&
        !/^get[A-Z]/.test(member.name)
      ) {
        out.push(
          `${member.className}.${member.name} returns a Locator; make it a \`get\` accessor or prefix it with get`
        );
      }
    }
    const rendered = renderedTestIds(dir);
    const used = pomTestIds(code);
    for (const id of rendered) {
      if (!used.has(id)) {
        out.push(
          `${name}.pom.ts never uses data-cy "${id}", which the component renders`
        );
      }
    }
    for (const id of used) {
      if (!rendered.has(id)) {
        out.push(
          `${name}.pom.ts looks up data-cy "${id}", which no file in the component renders`
        );
      }
    }
    const memberNames = new Set(members.map((member) => member.name));
    for (const prop of props) {
      for (const [pattern, candidates] of PROP_METHODS) {
        if (
          pattern.test(prop) &&
          !candidates.some((candidate) => memberNames.has(candidate))
        ) {
          out.push(
            `${name}.pom.ts has none of ${candidates.join("/")} for prop \`${prop}\``
          );
        }
      }
    }
    const exportLine = `export * from "../components/${name}/${name}.pom";`;
    if (!e2eEntry.includes(exportLine)) {
      out.push(`src/e2e/index.ts is missing \`${exportLine}\``);
    }
  }

  if (!fs.existsSync(specFile)) {
    out.push(`missing ${name}.pom.spec.ts`);
  } else {
    const spec = stripComments(fs.readFileSync(specFile, "utf8"));
    if (!spec.includes("storiesOf(import.meta.url)")) {
      out.push(`${name}.pom.spec.ts does not enumerate stories via storiesOf`);
    }
    if (!spec.includes("gotoStory(")) {
      out.push(`${name}.pom.spec.ts does not navigate via gotoStory`);
    }
    if (!spec.includes("expectStoryIndexToMatch(")) {
      out.push(`${name}.pom.spec.ts does not call expectStoryIndexToMatch`);
    }
    if (!spec.includes("expectAriaSnapshot(")) {
      out.push(`${name}.pom.spec.ts records no aria snapshot`);
    }
    if (!spec.includes(`new ${name}Pom(`)) {
      out.push(`${name}.pom.spec.ts does not construct ${name}Pom`);
    }
    if (fs.existsSync(pomFile)) {
      for (const member of classMembers(pomFile)) {
        const used = member.isGetter
          ? new RegExp(`\\.${member.name}\\b(?!\\()`).test(spec)
          : spec.includes(`.${member.name}(`);
        if (!used) {
          out.push(
            `${name}.pom.spec.ts never calls ${member.className}.${member.name}`
          );
        }
      }
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
