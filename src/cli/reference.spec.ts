import { execFileSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, sep } from "path";

import {
  findComponents,
  findTokenGroups,
  lookup,
  renderDocs,
  renderList,
  renderTokens,
  resolveExports,
  summarize,
} from "./reference";

/** Shapes copied from the emitted declarations. */
const BUTTON = `import { FC } from 'react';
import { Size, Variant } from '../../types';
type ButtonSize = \`\${Exclude<Size, Size.Lg | Size.Xl>}\`;
export interface ButtonProps {
    /**
     * Renders an anchor with the button's look.
     */
    href?: string;
    variant?: Variant;
}
/**
 * A basic button component. It has two sentences.
 *
 * @param variant The button variant. See {@link Variant}.
 */
export declare const Button: FC<ButtonProps>;
export {};
//# sourceMappingURL=Button.d.ts.map`;

const SHAPES = `/**
 * A drawer.
 *
 * @example
 * <Drawer maxSize={400} />
 */
declare const Drawer: React.FC<DrawerProps>;
export default Drawer;
/** A grid of images. */
export declare function ImageList<T = unknown>({ items }: ImageListProps<T>): import("react/jsx-runtime").JSX.Element;
/** Tabs.
 * @deprecated Use ToggleSwitch.
 */
export declare const Tabs: import('react').ForwardRefExoticComponent<TabsProps>;
/**
 * A floating toolbar.
 * @internal
 */
export declare const Toolbar: {
    ({ children }: ToolbarProps): JSX.Element | null;
    displayName: string;
};
export declare const ToastStack: import('react').Context<boolean>;
export declare const CardBackground: {
    readonly Primary: "primary";
    readonly Secondary: "secondary";
};
export declare const Undocumented: FC<Props>;`;

const TOKENS = `export declare const ZIndex: {
    /** No explicit stacking. */
    readonly Default: "default";
    readonly High: "high";
};
export declare const Numbers: {
    readonly One: 1;
};
export declare enum Legacy {
    /** A comment. */
    Sm = "sm",
    Md = "md"
}
export declare const Size: {
    readonly Sm: "sm";
    readonly Md: "md";
    readonly Lg: "lg";
    readonly Xl: "xl";
};
export declare const Variant: {
    readonly Primary: "primary";
};
export declare const Weight: {
    readonly Regular: "regular";
    /**
     * @deprecated Use Regular.
     */
    readonly Normal: "normal";
};`;

/** Every narrowing shape the components use, plus one the CLI leaves alone. */
const NARROWED = `import { FC } from 'react';
import { Size, Variant, Weight } from '../../types';
export type PickSize = \`\${Extract<Size, Size.Sm | Size.Md>}\`;
type ListSize = \`\${Size.Lg | Size.Sm}\`;
export type BareSize = Exclude<Size, Size.Sm>;
type OldWeight = \`\${Exclude<Weight, Weight.Regular>}\`;
type Unknown = \`\${(typeof Size)[keyof typeof Size]}\`;
export interface ThingProps {
    size?: PickSize;
}
/**
 * A thing. Its Variant is up to you. Stacks at a {@link ZIndex}.
 */
export declare const Thing: FC<ThingProps>;`;

describe("summarize", () => {
  it("skips the empty first line and keeps the first sentence", () => {
    expect(summarize("\n * A thing. More detail.\n *\n * @param x")).toBe(
      "A thing."
    );
  });

  it("joins a sentence that wraps and reduces links to names", () => {
    expect(summarize("\n * Wraps a {@link Text}\n * across lines.\n")).toBe(
      "Wraps a Text across lines."
    );
  });

  it("stops at the first tag", () => {
    expect(summarize("\n * No period here\n * @internal")).toBe(
      "No period here"
    );
  });
});

describe("findComponents", () => {
  const found = findComponents([{ path: "shapes.d.ts", text: SHAPES }]);
  const byName = new Map(found.map((entry) => [entry.name, entry]));

  it("recognizes every component shape and nothing else", () => {
    expect([...byName.keys()]).toEqual([
      "Drawer",
      "ImageList",
      "Tabs",
      "Toolbar",
      "Undocumented",
    ]);
  });

  it("reads flags from the JSDoc", () => {
    expect(byName.get("Tabs")?.deprecated).toBe(true);
    expect(byName.get("Toolbar")?.internal).toBe(true);
    expect(byName.get("Drawer")?.deprecated).toBe(false);
    expect(byName.get("Drawer")?.hasExample).toBe(true);
    expect(byName.get("Tabs")?.hasExample).toBe(false);
  });

  it("never borrows another declaration's JSDoc", () => {
    expect(byName.get("Undocumented")?.summary).toBe("");
  });

  it("does not take a prop's JSDoc as the component's", () => {
    const [button] = findComponents([{ path: "Button.d.ts", text: BUTTON }]);

    expect(button?.summary).toBe("A basic button component.");
  });
});

describe("findTokenGroups", () => {
  const groups = findTokenGroups([{ path: "tokens.d.ts", text: TOKENS }]);

  it("reads string consts, skipping member comments", () => {
    expect(groups.ZIndex).toEqual({
      values: ["default", "high"],
      deprecated: [],
      members: { Default: "default", High: "high" },
    });
  });

  it("reads string enums", () => {
    expect(groups.Legacy).toEqual({
      values: ["sm", "md"],
      deprecated: [],
      members: { Sm: "sm", Md: "md" },
    });
  });

  it("sets deprecated members apart, whatever their comment's shape", () => {
    expect(groups.Weight).toEqual({
      values: ["regular"],
      deprecated: ["normal"],
      members: { Regular: "regular", Normal: "normal" },
    });
  });

  it("ignores consts that are not all strings, and component object types", () => {
    expect(groups.Numbers).toBeUndefined();
    expect(
      findTokenGroups([{ path: "shapes.d.ts", text: SHAPES }]).Toolbar
    ).toBeUndefined();
  });
});

describe("resolveExports", () => {
  const files = new Map([
    [
      "dist/components/index.d.ts",
      "export * from './Button';\nexport * from './Drawer';",
    ],
    ["dist/components/Button/index.d.ts", "export * from './Button';"],
    ["dist/components/Button/Button.d.ts", BUTTON],
    [
      "dist/components/Drawer/index.d.ts",
      "export { default as Drawer } from './Drawer';\nexport type { DrawerProps } from './Drawer';",
    ],
    ["dist/components/Drawer/Drawer.d.ts", SHAPES],
    [
      "dist/components/Hidden/Hidden.d.ts",
      "export declare const Hidden: FC<Props>;",
    ],
  ]);
  const exported = resolveExports(files, "dist/components/index.d.ts");

  it("follows star and default re-exports to the declaring file", () => {
    expect(exported.get("Button")).toBe("dist/components/Button/Button.d.ts");
    expect(exported.get("Drawer")).toBe("dist/components/Drawer/Drawer.d.ts");
  });

  it("skips type-only re-exports and unexported modules", () => {
    expect(exported.has("DrawerProps")).toBe(false);
    expect(exported.has("Hidden")).toBe(false);
  });
});

describe("renderDocs", () => {
  const tokens = findTokenGroups([{ path: "tokens.d.ts", text: TOKENS }]);
  const [button] = findComponents([{ path: "Button.d.ts", text: BUTTON }]);
  const docs = button ? renderDocs(button, BUTTON, tokens) : "";

  it("starts with the import and drops build noise", () => {
    expect(docs.startsWith('import { Button } from "@voxel51/voodo";')).toBe(
      true
    );
    expect(docs).not.toContain("sourceMappingURL");
    expect(docs).not.toContain("import { FC }");
    expect(docs).not.toContain("export {};");
  });

  it("writes out the token values the declaration mentions", () => {
    expect(docs).toContain('type Variant = "primary";');
    expect(docs).not.toContain("type ZIndex");
  });

  it("writes out a narrowed alias instead of the group it narrows", () => {
    expect(docs).toContain('type ButtonSize = "sm" | "md";');
    expect(docs).not.toContain("type Size =");
  });
});

describe("renderDocs with narrowed aliases", () => {
  const tokens = findTokenGroups([{ path: "tokens.d.ts", text: TOKENS }]);
  const [thing] = findComponents([{ path: "Thing.d.ts", text: NARROWED }]);
  const docs = thing ? renderDocs(thing, NARROWED, tokens) : "";

  it("resolves Extract, member lists and an unwrapped Exclude", () => {
    expect(docs).toContain('type PickSize = "sm" | "md";');
    expect(docs).toContain('type ListSize = "lg" | "sm";');
    expect(docs).toContain('type BareSize = "md" | "lg" | "xl";');
  });

  it("keeps a narrowed group's deprecated values apart", () => {
    expect(docs).toContain('type OldWeight = never; // deprecated: "normal"');
    expect(docs).not.toContain("type Weight =");
  });

  it("leaves other shapes as written, with the group they mention", () => {
    expect(docs).not.toMatch(/^type Unknown = "/m);
    expect(docs).toContain('type Size = "sm" | "md" | "lg" | "xl";');
  });

  it("counts a group the JSDoc links to, but not one it only names", () => {
    expect(docs).toContain('type ZIndex = "default" | "high";');
    expect(docs).not.toContain("type Variant =");
  });
});

describe("renderList", () => {
  const found = findComponents([{ path: "shapes.d.ts", text: SHAPES }]);
  const list = renderList(found, ["CheckIcon"], "9.9.9");

  it("hides internal components and marks deprecated ones", () => {
    expect(list).not.toContain("Toolbar");
    expect(list).toMatch(/^Tabs\s+Tabs\. \(deprecated\)$/m);
  });

  it("counts what it shows", () => {
    expect(
      list.startsWith("@voxel51/voodo 9.9.9: 4 components, plus 1 icons.")
    ).toBe(true);
  });
});

describe("renderTokens and lookup", () => {
  const tokens = findTokenGroups([{ path: "tokens.d.ts", text: TOKENS }]);
  const found = findComponents([{ path: "shapes.d.ts", text: SHAPES }]);

  it("prints one group, case-insensitively", () => {
    expect(renderTokens(tokens, "legacy")).toBe('type Legacy = "sm" | "md";');
  });

  it("names deprecated values in a comment, out of the union", () => {
    expect(renderTokens(tokens, "Weight")).toBe(
      'type Weight = "regular"; // deprecated: "normal"'
    );
  });

  it("finds components case-insensitively and suggests near names", () => {
    expect(lookup(found, "drawer").match?.name).toBe("Drawer");
    expect(lookup(found, "list").suggestions).toEqual(["ImageList"]);
  });
});

// Runs the real command against a build: `npm run build` locally; CI builds
// before it tests.
const root = process.cwd();
const built =
  existsSync(join(root, "dist", "cli.js")) &&
  existsSync(join(root, "dist", "components", "index.d.ts"));

(built ? describe : describe.skip)("voodo against the built package", () => {
  const run = (...args: string[]): string =>
    execFileSync(process.execPath, [join(root, "bin", "voodo.mjs"), ...args], {
      encoding: "utf8",
      // Capture stderr too, so the expected failure stays out of the output
      stdio: "pipe",
    });

  it("lists exported components, each with a summary", () => {
    const rows = run("list").trimEnd().split("\n").slice(3, -2);

    expect(rows.length).toBeGreaterThan(50);
    for (const row of rows) expect(row).toMatch(/^\S+\s{2,}\S/);
  });

  it("documents Button with its token values", () => {
    const docs = run("docs", "Button");

    expect(docs).toContain("export declare const Button");
    expect(docs).toContain('type Variant = "primary"');
  });

  it("documents narrowed sizes as the values they allow", () => {
    const button = run("docs", "Button");
    const toggle = run("docs", "Toggle");

    expect(button).toContain('type ButtonSize = "xs" | "sm" | "md";');
    expect(toggle).toContain('type ToggleSize = "sm" | "md";');
    expect(run("docs", "IconAction")).toContain(
      'type IconActionSize = "sm" | "md" | "lg";'
    );
    for (const docs of [button, toggle]) {
      expect(docs).not.toContain("type Size =");
    }
  });

  it("documents Modal's sizes as a const, not an enum", () => {
    const docs = run("docs", "Modal");

    expect(docs).toContain("export declare const ModalSize");
    expect(docs).not.toContain("enum ModalSize");
  });

  it("fails on an unknown component", () => {
    expect(() => run("docs", "NoSuchComponent")).toThrow();
  });

  it("prints token groups, one or all", () => {
    expect(run("tokens", "Size")).toBe(
      'type Size = "xs" | "sm" | "md" | "lg" | "xl";\n'
    );
    expect(run("tokens")).toContain("type TextColor = ");
  });

  it("keeps deprecated text variants out of the union", () => {
    const [union = "", comment = ""] = run("tokens", "TextVariant").split(
      " // deprecated: "
    );

    expect(union).toContain('"body-primary"');
    expect(union).not.toContain('"md"');
    expect(comment).toContain('"md"');
  });

  it("prints every icon name", () => {
    const icons = run("icons").trimEnd().split("\n");

    expect(icons.length).toBeGreaterThan(100);
    expect(icons).toContain("CheckIcon");
  });

  // What `voodo docs` shows is what agents learn from, so every public
  // component needs an example. `@internal` components are exempt.
  it("gives every exported component an @example", () => {
    const dir = join(root, "dist", "components");
    const files = readdirSync(dir, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith(".d.ts"))
      .map((file) => ({
        path: `dist/components/${file.split(sep).join("/")}`,
        text: readFileSync(join(dir, file), "utf8"),
      }));
    const exported = resolveExports(
      new Map(files.map((file) => [file.path, file.text])),
      "dist/components/index.d.ts"
    );
    const missing = findComponents(files)
      .filter((entry) => exported.get(entry.name) === entry.file)
      .filter((entry) => !entry.internal && !entry.file.endsWith("/icons.d.ts"))
      .filter((entry) => !entry.hasExample)
      .map((entry) => entry.name);

    expect(missing).toEqual([]);
  });
});
