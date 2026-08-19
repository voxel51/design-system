/**
 * Replace MUI's layout primitives with plain elements and utility classes,
 * using a real TypeScript/JSX parser.
 *
 * Supersedes `mui-layout-to-html.ts`, which did this with regex and produced
 * source that would not compile — twice. The failures were always structural:
 * an arrow body inside an attribute, a closing tag paired by counting rather
 * than by nesting. ts-morph removes that entire class of bug, because
 * renaming a `JsxElement` rewrites its opening *and* closing tag as one
 * operation and attribute values are already parsed.
 *
 * What it converts:
 *
 *   `Box`        → div (or the element `component=` names)
 *   `Stack`      → div with flex and a gap
 *   `Typography` → the semantic element for its variant, with a type class
 *   `Grid`       → div with `grid`; items get no class of their own
 *
 * These are 753 of the 1,978 MUI uses in fiftyone-teams and none of them
 * needs a design-system component: `Box` exists only to carry `sx`, `Stack`
 * is a flex row, `Typography` is a type-scale class on a text element.
 *
 * What it deliberately does NOT do: turn a `Box` that is standing in for a
 * surface into a `Card`. A card, a panel and a bordered region all look like
 * `<Box>` from here, and only a person can tell which is which. Those stay
 * for hand conversion rather than becoming a div with a border class.
 *
 * Convert only when every prop maps. One unknown prop leaves the element
 * alone and is reported, because a half-converted element looks deliberate.
 *
 * Usage:
 *   tsx utils/codemods/mui-layout.ts [--write] <path>...
 */
import { Node, Project, SyntaxKind, type JsxAttribute, type SourceFile } from "ts-morph";
import { readdirSync, statSync } from "fs";
import { extname, join, relative, resolve } from "path";

const TARGETS = new Set(["Box", "Stack", "Typography", "Grid"]);

/** MUI's spacing unit is 8px, Tailwind's is 4px: `spacing={2}` is `gap-4`. */
const spacing = (raw: string): string | null => {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  const steps = n * 2;
  if (Number.isInteger(steps)) return String(steps);
  if ([0.5, 1.5, 2.5, 3.5].includes(steps)) return String(steps);
  return `[${n * 8}px]`;
};

const TYPOGRAPHY: Record<string, { cls: string; tag: string }> = {
  h1: { cls: "text-display font-semibold", tag: "h1" },
  h2: { cls: "text-title font-semibold", tag: "h2" },
  h3: { cls: "text-title font-medium", tag: "h3" },
  h4: { cls: "text-heading font-medium", tag: "h4" },
  h5: { cls: "text-heading font-medium", tag: "h5" },
  h6: { cls: "text-subheading font-medium", tag: "h6" },
  subtitle1: { cls: "text-subheading font-medium", tag: "p" },
  subtitle2: { cls: "text-body-sm font-medium", tag: "p" },
  body1: { cls: "text-body", tag: "p" },
  body2: { cls: "text-body-sm", tag: "p" },
  caption: { cls: "text-caption", tag: "span" },
  overline: { cls: "text-caption uppercase tracking-wide", tag: "span" },
};

const ALIGN: Record<string, string> = {
  center: "items-center", "flex-start": "items-start", start: "items-start",
  "flex-end": "items-end", end: "items-end", baseline: "items-baseline",
  stretch: "items-stretch",
};
const JUSTIFY: Record<string, string> = {
  center: "justify-center", "flex-start": "justify-start", start: "justify-start",
  "flex-end": "justify-end", end: "justify-end", "space-between": "justify-between",
  "space-around": "justify-around", "space-evenly": "justify-evenly",
};
const COLOR: Record<string, string> = {
  "text.primary": "text-foreground",
  "text.secondary": "text-secondary-foreground",
  "text.tertiary": "text-tertiary-foreground",
  "text.disabled": "text-muted-foreground",
  primary: "text-primary",
  error: "text-destructive",
  secondary: "text-secondary-foreground",
};
const WEIGHT: Record<string, string> = {
  light: "font-light", regular: "font-normal", normal: "font-normal",
  medium: "font-medium", semiBold: "font-semibold", semibold: "font-semibold",
  bold: "font-bold", "400": "font-normal", "500": "font-medium",
  "600": "font-semibold", "700": "font-bold",
};

/** Props that are behavior or identity, passed through untouched. */
const PASSTHROUGH = /^(on[A-Z]|data-|aria-|id|key|ref|role|title|style|tabIndex|className)$/;

interface Skip { file: string; reason: string; tag: string }
const skips: Skip[] = [];
let converted = 0;
const changedFiles = new Set<string>();

/** Read an attribute's value as a plain string, or null when it is dynamic. */
function literal(attr: JsxAttribute): string | null {
  const init = attr.getInitializer();
  if (!init) return "true";
  if (Node.isStringLiteral(init)) return init.getLiteralValue();
  if (Node.isJsxExpression(init)) {
    const e = init.getExpression();
    if (!e) return null;
    if (Node.isStringLiteral(e)) return e.getLiteralValue();
    if (Node.isNumericLiteral(e)) return e.getText();
    if (e.getKind() === SyntaxKind.TrueKeyword) return "true";
    if (e.getKind() === SyntaxKind.FalseKeyword) return "false";
    return null;
  }
  return null;
}

interface Plan { tag: string; classes: string[]; drop: string[] }

function plan(name: string, attrs: JsxAttribute[]): Plan | null {
  const classes: string[] = [];
  const drop: string[] = [];
  let tag = "div";

  if (name === "Stack") classes.push("flex", "flex-col");
  if (name === "Grid") classes.push("grid");
  if (name === "Typography") { tag = "p"; classes.push("text-body") }

  for (const attr of attrs) {
    const prop = attr.getNameNode().getText();
    if (prop === "className") continue; // merged separately, kept as written
    if (PASSTHROUGH.test(prop)) continue;

    const v = literal(attr);
    if (v === null) return null;

    switch (prop) {
      case "direction": {
        if (name !== "Stack") return null;
        if (v === "row") {
          const i = classes.indexOf("flex-col");
          if (i >= 0) classes.splice(i, 1);
          classes.push("flex-row");
        } else if (v !== "column") return null;
        drop.push(prop);
        break;
      }
      case "spacing":
      case "gap": {
        const s = spacing(v);
        if (!s) return null;
        classes.push(`gap-${s}`);
        drop.push(prop);
        break;
      }
      case "alignItems":
        if (!ALIGN[v]) return null;
        classes.push(ALIGN[v]); drop.push(prop); break;
      case "justifyContent":
        if (!JUSTIFY[v]) return null;
        classes.push(JUSTIFY[v]); drop.push(prop); break;
      case "variant": {
        if (name !== "Typography") return null;
        const t = TYPOGRAPHY[v];
        if (!t) return null;
        const i = classes.indexOf("text-body");
        if (i >= 0) classes.splice(i, 1);
        if (t.cls) classes.push(...t.cls.split(" "));
        tag = t.tag;
        drop.push(prop);
        break;
      }
      case "color":
        if (v === "inherit") { drop.push(prop); break }
        if (!COLOR[v]) return null;
        classes.push(COLOR[v]); drop.push(prop); break;
      case "fontWeight":
        if (!WEIGHT[v]) return null;
        classes.push(WEIGHT[v]); drop.push(prop); break;
      case "noWrap":
        if (v !== "true") return null;
        classes.push("truncate"); drop.push(prop); break;
      case "component":
        if (!/^[a-z]+$/.test(v)) return null;
        tag = v; drop.push(prop); break;
      case "container":
        if (name !== "Grid") return null;
        drop.push(prop); break;
      case "item": {
        if (name !== "Grid") return null;
        const i = classes.indexOf("grid");
        if (i >= 0) classes.splice(i, 1);
        drop.push(prop);
        break;
      }
      default:
        return null;
    }
  }
  return { tag, classes, drop };
}

/** True when the identifier was imported from an @mui package. */
function fromMui(file: SourceFile, name: string): boolean {
  return file.getImportDeclarations().some(
    (d) =>
      d.getModuleSpecifierValue().startsWith("@mui/") &&
      (d.getDefaultImport()?.getText() === name ||
        d.getNamedImports().some((n) => (n.getAliasNode() ?? n.getNameNode()).getText() === name)),
  );
}

function processFile(file: SourceFile) {
  const path = relative(process.cwd(), file.getFilePath());
  let touched = false;

  // One conversion per pass, re-querying the tree each time.
  //
  // Any manipulation invalidates every node reference collected before it, so
  // a single collected list goes stale after the first edit — that is what
  // produced "no corresponding closing tag". Converting the *last* element in
  // the file first means each edit only shifts offsets after itself, so the
  // remaining work is untouched.
  //
  // Skipped elements would otherwise be re-examined forever, so their reasons
  // are recorded once and their tag positions remembered for the file.
  const refused = new Set<string>();

  for (let guard = 0; guard < 2000; guard++) {
    const elements = [
      ...file.getDescendantsOfKind(SyntaxKind.JsxElement),
      ...file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ].sort((a, b) => b.getStart() - a.getStart());

    let didWork = false;

    for (const el of elements) {
      const opening = Node.isJsxElement(el) ? el.getOpeningElement() : el;
      const name = opening.getTagNameNode().getText();
      if (!TARGETS.has(name)) continue;
      if (!fromMui(file, name)) continue;

      const key = `${name}@${el.getStart()}`;
      if (refused.has(key)) continue;

      const attrs = opening.getAttributes();
      if (attrs.some((a) => Node.isJsxSpreadAttribute(a))) {
        skips.push({ file: path, reason: "prop spread", tag: name });
        refused.add(key);
        continue;
      }
      const props = attrs.filter(Node.isJsxAttribute);
      if (props.some((x) => x.getNameNode().getText() === "sx")) {
        skips.push({ file: path, reason: "still has sx", tag: name });
        refused.add(key);
        continue;
      }

      const p = plan(name, props);
      if (!p) {
        skips.push({ file: path, reason: "unmapped prop", tag: name });
        refused.add(key);
        continue;
      }

      // Build the replacement and apply it as a single operation.
      //
      // Editing attributes and then renaming the tags is three manipulations
      // on one element, and each invalidates the node references taken before
      // it — which is what left an opening `Box` beside a closing `div`. One
      // `replaceWithText` cannot half-apply.
      const keptAttrs = props
        .filter((x) => !p.drop.includes(x.getNameNode().getText()))
        .filter((x) => x.getNameNode().getText() !== "className")
        .map((x) => x.getText());

      const existingClass = props.find(
        (x) => x.getNameNode().getText() === "className",
      );
      const added = p.classes.join(" ");
      let classAttr = "";
      if (existingClass) {
        const init = existingClass.getInitializer();
        if (init && Node.isStringLiteral(init)) {
          const merged = added ? `${added} ${init.getLiteralValue()}` : init.getLiteralValue();
          classAttr = `className="${merged}"`;
        } else if (init && Node.isJsxExpression(init)) {
          const inner = init.getExpression()?.getText() ?? '""';
          classAttr = added
            ? `className={\`${added} \${${inner}}\`}`
            : `className={${inner}}`;
        }
      } else if (added) {
        classAttr = `className="${added}"`;
      }

      const attrText = [classAttr, ...keptAttrs].filter(Boolean).join(" ");
      const openText = `<${p.tag}${attrText ? " " + attrText : ""}`;

      if (Node.isJsxElement(el)) {
        // Absolute offsets into the file. `getFullText()` carries leading
        // trivia, so mixing it with node-relative arithmetic silently trims
        // or duplicates children.
        const whole = el.getSourceFile().getFullText();
        const inner = whole.slice(
          el.getOpeningElement().getEnd(),
          el.getClosingElement().getStart(),
        );
        el.replaceWithText(`${openText}>${inner}</${p.tag}>`);
      } else {
        el.replaceWithText(`${openText} />`);
      }

      converted++;
      touched = true;
      didWork = true;
      break; // re-query; every reference above is now stale
    }

    if (!didWork) break;
  }

  if (touched) {
    changedFiles.add(path);
    for (const decl of file.getImportDeclarations()) {
      if (!decl.getModuleSpecifierValue().startsWith("@mui/")) continue;
      for (const spec of [...decl.getNamedImports()]) {
        const local = (spec.getAliasNode() ?? spec.getNameNode()).getText();
        if (!TARGETS.has(local)) continue;
        const stillUsed = file
          .getDescendantsOfKind(SyntaxKind.Identifier)
          .some((i) => i.getText() === local && !spec.getDescendants().includes(i as never));
        if (!stillUsed) spec.remove();
      }
      if (
        decl.getNamedImports().length === 0 &&
        !decl.getDefaultImport() &&
        !decl.getNamespaceImport()
      ) {
        decl.remove();
      }
    }
  }
}

const walk = (t: string): string[] => {
  if (statSync(t).isFile()) return [t];
  return readdirSync(t).flatMap((e) => {
    if (/^(node_modules|dist|build|\.next|__generated__|coverage)$/.test(e)) return [];
    const full = join(t, e);
    return statSync(full).isDirectory() ? walk(full) : extname(full) === ".tsx" ? [full] : [];
  });
};

const argv = process.argv.slice(2);
const write = argv.includes("--write");
const targets = argv.filter((a) => a !== "--write");
if (!targets.length) {
  console.error("Usage: tsx utils/codemods/mui-layout.ts [--write] <path>...");
  process.exit(1);
}

const project = new Project({
  useInMemoryFileSystem: false,
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { jsx: 4 /* preserve */, allowJs: true },
});

const files = targets.flatMap((t) => walk(resolve(t)));
for (const f of files) project.addSourceFileAtPath(f);
for (const sf of project.getSourceFiles()) processFile(sf);

if (write) project.saveSync();

const byReason = new Map<string, number>();
for (const s of skips) byReason.set(s.reason, (byReason.get(s.reason) ?? 0) + 1);

console.log(
  `${write ? "Converted" : "Would convert"} ${converted} element(s) across ${changedFiles.size} file(s).`,
);
console.log(`Left alone: ${skips.length}`);
for (const [r, n] of [...byReason].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${r}`);
}
if (!write) console.log("\nDry run. Pass --write to apply.");
