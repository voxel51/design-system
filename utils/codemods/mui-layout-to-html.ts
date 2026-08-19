/**
 * Replace MUI's four layout primitives with plain elements and utility
 * classes: `Box`, `Stack`, `Typography`, `Grid`.
 *
 * These are 753 of the 1,978 MUI uses in fiftyone-teams — 38% — and none of
 * them needs a design-system component. `Box` exists only to carry `sx`.
 * `Stack` is a flex row with a gap. `Typography` is a type-scale class on a
 * text element. Converting them removes the largest block of MUI without
 * changing a single rendered control.
 *
 * Runs after `sx-to-classname`, which has already turned most `sx` props into
 * `className`. Anything still carrying `sx` is left alone here.
 *
 * Same discipline as the sx codemod: convert only when every prop maps, skip
 * anything dynamic, and report every skip with a reason.
 *
 * STATUS: not safe to apply. Do not run with --write against a real tree.
 *
 * This is a regex transform over JSX, and JSX is not a regular language. Two
 * sweeps of fiftyone-teams produced source that would not compile:
 *
 *   1. Attribute values containing an arrow body (`onClick={() => { ... }}`)
 *      were mis-parsed. Guarding against them fixed those files.
 *   2. Opener/closer pairing still drifted on nested same-name elements,
 *      leaving `</Box>` next to `</div>`.
 *
 * The guards keep growing and the failures keep moving, which is the signal
 * that the tool is wrong rather than incomplete. Rewrite it on ts-morph or
 * babel, where the element tree is real and a closer is found by structure
 * instead of by counting. Kept here for its mapping tables — the
 * Typography-to-type-scale, spacing and alignment maps are correct and worth
 * carrying over.
 *
 * The related `sx-to-classname` codemod does not share this problem: it
 * rewrites a single attribute in place and never touches element structure.
 *
 * Usage (dry run only, to size the work):
 *   tsx utils/codemods/mui-layout-to-html.ts <path>...
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative, resolve } from "path";

/** MUI spacing unit is 8px, Tailwind's is 4px: `spacing={2}` is `gap-4`. */
const spacing = (raw: string): string | null => {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  const steps = n * 2;
  if (Number.isInteger(steps)) return String(steps);
  if ([0.5, 1.5, 2.5, 3.5].includes(steps)) return String(steps);
  return `[${n * 8}px]`;
};

/** MUI Typography variants onto the v2 type scale. */
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
  inherit: { cls: "", tag: "span" },
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
const TEXT_ALIGN: Record<string, string> = {
  left: "text-left", center: "text-center", right: "text-right",
};
const COLOR: Record<string, string> = {
  "text.primary": "text-foreground",
  "text.secondary": "text-secondary-foreground",
  "text.tertiary": "text-tertiary-foreground",
  "text.disabled": "text-muted-foreground",
  primary: "text-primary",
  error: "text-destructive",
  secondary: "text-secondary-foreground",
  inherit: "",
};
const WEIGHT: Record<string, string> = {
  light: "font-light", regular: "font-normal", normal: "font-normal",
  medium: "font-medium", semiBold: "font-semibold", semibold: "font-semibold",
  bold: "font-bold", "400": "font-normal", "500": "font-medium",
  "600": "font-semibold", "700": "font-bold",
};

interface Skip { file: string; reason: string; snippet: string }
const skips: Skip[] = [];
let converted = 0;
let filesChanged = 0;

/** Parse a JSX opening tag's attributes into [name, rawValue] pairs. */
function attrs(tag: string): [string, string][] {
  const out: [string, string][] = [];
  const re = /([a-zA-Z-]+)(?:=(?:"([^"]*)"|'([^']*)'|\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}))?/g;
  let m: RegExpExecArray | null;
  let first = true;
  while ((m = re.exec(tag))) {
    if (first) { first = false; continue } // the element name
    // Preserve the original delimiters: a value captured bare and re-emitted
    // bare produces `className=a b`, which is not valid JSX.
    const value =
      m[2] !== undefined ? `"${m[2]}"`
      : m[3] !== undefined ? `'${m[3]}'`
      : m[4] !== undefined ? `{${m[4]}}`
      : "true";
    out.push([m[1], value.trim()]);
  }
  return out;
}

/** Convert one element's props. Returns null when anything is unmappable. */
function convertProps(
  name: string,
  pairs: [string, string][],
): { tag: string; classes: string[]; keep: string[] } | null {
  const classes: string[] = [];
  const keep: string[] = [];
  let tag = "div";

  if (name === "Stack") classes.push("flex", "flex-col");
  if (name === "Grid") classes.push("grid");
  if (name === "Typography") {
    // MUI's default variant is body1.
    tag = "p";
    classes.push("text-body");
  }

  for (const [prop, raw] of pairs) {
    const v = raw.replace(/^["'](.*)["']$/, "$1");
    switch (prop) {
      case "className":
        classes.push(`__RAW__${raw}`);
        break;
      case "direction":
        if (name !== "Stack") return null;
        if (v === "row") { classes.splice(classes.indexOf("flex-col"), 1); classes.push("flex-row") }
        else if (v === "column") { /* already flex-col */ }
        else return null;
        break;
      case "spacing":
      case "gap": {
        const s = spacing(v);
        if (!s) return null;
        classes.push(`gap-${s}`);
        break;
      }
      case "alignItems":
        if (!ALIGN[v]) return null;
        classes.push(ALIGN[v]);
        break;
      case "justifyContent":
        if (!JUSTIFY[v]) return null;
        classes.push(JUSTIFY[v]);
        break;
      case "textAlign":
        if (!TEXT_ALIGN[v]) return null;
        classes.push(TEXT_ALIGN[v]);
        break;
      case "variant": {
        if (name !== "Typography") return null;
        const t = TYPOGRAPHY[v];
        if (!t) return null;
        const bodyDefault = classes.indexOf("text-body");
        if (bodyDefault >= 0) classes.splice(bodyDefault, 1);
        if (t.cls) classes.push(...t.cls.split(" "));
        tag = t.tag;
        break;
      }
      case "color": {
        if (COLOR[v] === undefined) return null;
        if (COLOR[v]) classes.push(COLOR[v]);
        break;
      }
      case "fontWeight":
        if (!WEIGHT[v]) return null;
        classes.push(WEIGHT[v]);
        break;
      case "noWrap":
        classes.push("truncate");
        break;
      case "component":
        if (!/^["']?[a-z]+["']?$/.test(v)) return null;
        tag = v.replace(/["']/g, "");
        break;
      case "container":
        if (name !== "Grid") return null;
        break; // the `grid` class is already applied
      case "item":
        if (name !== "Grid") return null;
        // A grid item needs no class of its own; the parent lays it out.
        {
          const i = classes.indexOf("grid");
          if (i >= 0) classes.splice(i, 1);
        }
        break;
      case "flex":
      case "flexGrow":
        classes.push(v === "1" ? "flex-1" : `grow-[${v}]`);
        break;
      case "width":
        classes.push(v === "100%" ? "w-full" : `w-[${v}]`);
        break;
      case "height":
        classes.push(v === "100%" ? "h-full" : `h-[${v}]`);
        break;
      default:
        // Event handlers, refs, data/aria attributes and ids pass through
        // untouched; anything else is a styling prop this codemod does not
        // understand, and guessing at it is how a layout silently shifts.
        if (/^(on[A-Z]|data-|aria-|id$|key$|ref$|role$|title$|style$|tabIndex$)/.test(prop)) {
          keep.push(`${prop}=${raw === "true" ? "" : raw}`);
        } else {
          return null;
        }
    }
  }
  return { tag, classes, keep };
}

function processFile(path: string, write: boolean) {
  const original = readFileSync(path, "utf8");
  if (!/<(Box|Stack|Typography|Grid)[\s/>]/.test(original)) return;
  // Only touch files whose layout primitives came from MUI.
  if (!/from ["']@mui\//.test(original)) return;

  let src = original;
  let changed = false;
  const rel = relative(process.cwd(), path);

  for (const name of ["Typography", "Stack", "Box", "Grid"]) {
    // Rewrite from the end of the file backwards so byte offsets stay valid,
    // and pair each opener with its own closer by tracking depth. A blanket
    // `</Box>` → `</div>` replace is wrong the moment two elements of the
    // same name map to different tags — which Typography does on every
    // variant, mapping to h1, p or span.
    const openRe = new RegExp(`<${name}(\\s[^>]*?)?(/)?>`, "g");
    const closeTag = `</${name}>`;
    const found: { start: number; end: number; text: string; selfClosing: boolean }[] = [];

    let m: RegExpExecArray | null;
    while ((m = openRe.exec(src))) {
      const snippet = m[0].slice(0, 90).replace(/\s+/g, " ");
      if (/\bsx=/.test(m[0])) { skips.push({ file: rel, reason: "still has sx", snippet }); continue }
      if (/\{\.\.\./.test(m[0])) { skips.push({ file: rel, reason: "prop spread", snippet }); continue }
      // An inline arrow body or any nested brace defeats the attribute
      // regex; a mis-parse here emits JSX that will not compile, so refuse.
      if (/=>|\bfunction\b/.test(m[0])) { skips.push({ file: rel, reason: "inline function prop", snippet }); continue }
      if (/\{[^{}]*\{/.test(m[0])) { skips.push({ file: rel, reason: "nested braces in prop", snippet }); continue }
      if (m[0].includes("\n")) { skips.push({ file: rel, reason: "multi-line tag", snippet }); continue }

      const parsed = convertProps(name, attrs(m[0]));
      if (!parsed) {
        const why = attrs(m[0]).map(([p]) => p).filter((p) => !/^(on[A-Z]|data-|aria-)/.test(p)).join(",");
        skips.push({ file: rel, reason: `unmapped prop (${why || "?"})`, snippet });
        continue;
      }

      const raw = parsed.classes.filter((c) => c.startsWith("__RAW__"));
      const plain = parsed.classes.filter((c) => !c.startsWith("__RAW__"));
      let classAttr = "";
      if (raw.length === 1 && plain.length) {
        const inner = raw[0].slice(7);
        classAttr = inner.startsWith('"') || inner.startsWith("'")
          ? ` className="${plain.join(" ")} ${inner.slice(1, -1)}"`
          : ` className={\`${plain.join(" ")} \${${inner.slice(1, -1)}}\`}`;
      } else if (raw.length === 1) {
        classAttr = ` className=${raw[0].slice(7)}`;
      } else if (plain.length) {
        classAttr = ` className="${plain.join(" ")}"`;
      }
      const keep = parsed.keep.length ? " " + parsed.keep.join(" ") : "";

      found.push({
        start: m.index,
        end: m.index + m[0].length,
        text: `<${parsed.tag}${classAttr}${keep}${m[2] ? " />" : ">"}`,
        selfClosing: !!m[2],
      });
    }

    for (const e of found.reverse()) {
      let closeStart = -1;
      let closeEnd = -1;
      if (!e.selfClosing) {
        // Walk forward from this opener counting same-name openers, so a
        // nested element claims its own closer rather than ours.
        let depth = 1;
        let i = e.end;
        const scan = new RegExp(`<${name}(\\s[^>]*?)?(/)?>|</${name}>`, "g");
        scan.lastIndex = i;
        let s2: RegExpExecArray | null;
        while ((s2 = scan.exec(src))) {
          if (s2[0] === closeTag) {
            depth--;
            if (depth === 0) { closeStart = s2.index; closeEnd = s2.index + closeTag.length; break }
          } else if (!s2[2]) depth++;
        }
        if (closeStart < 0) {
          skips.push({ file: rel, reason: "no matching close tag", snippet: e.text.slice(0, 60) });
          continue;
        }
        const tagName = e.text.match(/^<(\w+)/)?.[1] ?? "div";
        src = src.slice(0, closeStart) + `</${tagName}>` + src.slice(closeEnd);
      }
      src = src.slice(0, e.start) + e.text + src.slice(e.end);
      converted++;
      changed = true;
    }
  }

  if (changed && write) writeFileSync(path, src);
  if (changed) filesChanged++;
}

const walk = (t: string): string[] => {
  if (statSync(t).isFile()) return [t];
  return readdirSync(t).flatMap((e) => {
    if (/^(node_modules|dist|build|\.next|__generated__|coverage)$/.test(e)) return [];
    const full = join(t, e);
    return statSync(full).isDirectory() ? walk(full) : [".tsx"].includes(extname(full)) ? [full] : [];
  });
};

const argv = process.argv.slice(2);
const write = argv.includes("--write");
const targets = argv.filter((a) => a !== "--write");
if (!targets.length) {
  console.error("Usage: tsx utils/codemods/mui-layout-to-html.ts [--write] <path>...");
  process.exit(1);
}
for (const f of targets.flatMap((t) => walk(resolve(t)))) processFile(f, write);

const byReason = new Map<string, number>();
for (const s of skips) {
  const key = s.reason.startsWith("unmapped") ? "unmapped prop" : s.reason;
  byReason.set(key, (byReason.get(key) ?? 0) + 1);
}
console.log(`${write ? "Converted" : "Would convert"} ${converted} element(s) across ${filesChanged} file(s).`);
console.log(`Left alone: ${skips.length}`);
for (const [r, n] of [...byReason].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${r}`);
}
if (!write) console.log("\nDry run. Pass --write to apply.");
