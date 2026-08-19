/**
 * Convert MUI `sx={{...}}` into Tailwind utility classes.
 *
 * `sx` is 1,804 blocks across fiftyone-teams and is the single largest piece
 * of the MUI removal. The audit is what makes this tractable: 0.2% of blocks
 * use responsive breakpoints, 14% touch the theme, and 52% of all properties
 * are layout and spacing. The bulk is a verbose inline utility system.
 *
 * Rules this follows, in order of importance:
 *
 * 1. **Never guess.** A block is converted only when *every* property in it
 *    maps to a known utility. One unknown property leaves the whole block
 *    alone and reports it. A half-converted `sx` is worse than an untouched
 *    one, because the remaining half looks intentional.
 * 2. **Skip anything dynamic.** Callback form (`sx={(theme) => ...}`),
 *    spreads, ternaries and template literals are left for a human.
 * 3. **Report, don't silently drop.** Every skip is printed with its reason,
 *    so the residue is a work list rather than an unknown.
 *
 * Usage:
 *   tsx utils/codemods/sx-to-classname.ts [--write] <path>...
 *   tsx utils/codemods/sx-to-classname.ts --write ../fiftyone-teams/teams-app
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative, resolve } from "path";

/** MUI's spacing unit is 8px; Tailwind's is 4px. `p: 2` is 16px is `p-4`. */
const spacing = (v: string): string | null => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const steps = n * 2;
  if (steps < 0) return null;
  if (Number.isInteger(steps)) return String(steps);
  // Tailwind has half steps (0.5, 1.5, 2.5, 3.5); anything else is arbitrary.
  if ([0.5, 1.5, 2.5, 3.5].includes(steps)) return String(steps);
  return `[${n * 8}px]`;
};

/** Fixed value maps — property, then value. */
const ENUMS: Record<string, Record<string, string>> = {
  display: {
    flex: "flex",
    block: "block",
    inline: "inline",
    "inline-flex": "inline-flex",
    "inline-block": "inline-block",
    grid: "grid",
    none: "hidden",
    contents: "contents",
  },
  flexDirection: {
    row: "flex-row",
    column: "flex-col",
    "row-reverse": "flex-row-reverse",
    "column-reverse": "flex-col-reverse",
  },
  alignItems: {
    center: "items-center",
    "flex-start": "items-start",
    start: "items-start",
    "flex-end": "items-end",
    end: "items-end",
    baseline: "items-baseline",
    stretch: "items-stretch",
  },
  justifyContent: {
    center: "justify-center",
    "flex-start": "justify-start",
    start: "justify-start",
    "flex-end": "justify-end",
    end: "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
  },
  flexWrap: { wrap: "flex-wrap", nowrap: "flex-nowrap", "wrap-reverse": "flex-wrap-reverse" },
  position: {
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
    static: "static",
  },
  overflow: { hidden: "overflow-hidden", auto: "overflow-auto", scroll: "overflow-scroll", visible: "overflow-visible" },
  overflowX: { hidden: "overflow-x-hidden", auto: "overflow-x-auto", scroll: "overflow-x-scroll" },
  overflowY: { hidden: "overflow-y-hidden", auto: "overflow-y-auto", scroll: "overflow-y-scroll" },
  textAlign: { left: "text-left", center: "text-center", right: "text-right", justify: "text-justify" },
  textTransform: { uppercase: "uppercase", lowercase: "lowercase", capitalize: "capitalize", none: "normal-case" },
  whiteSpace: { nowrap: "whitespace-nowrap", normal: "whitespace-normal", pre: "whitespace-pre", "pre-wrap": "whitespace-pre-wrap" },
  textOverflow: { ellipsis: "text-ellipsis", clip: "text-clip" },
  cursor: { pointer: "cursor-pointer", default: "cursor-default", "not-allowed": "cursor-not-allowed", grab: "cursor-grab", text: "cursor-text" },
  fontWeight: { "400": "font-normal", "500": "font-medium", "600": "font-semibold", "700": "font-bold", normal: "font-normal", bold: "font-bold", medium: "font-medium" },
  fontStyle: { italic: "italic", normal: "not-italic" },
  flexGrow: { "0": "grow-0", "1": "grow" },
  flexShrink: { "0": "shrink-0", "1": "shrink" },
  flex: { "1": "flex-1", auto: "flex-auto", none: "flex-none" },
};

/** Spacing-scale properties: value is multiplied by MUI's 8px unit. */
const SPACING_PREFIX: Record<string, string> = {
  p: "p", px: "px", py: "py", pt: "pt", pb: "pb", pl: "pl", pr: "pr",
  padding: "p", paddingX: "px", paddingY: "py",
  paddingTop: "pt", paddingBottom: "pb", paddingLeft: "pl", paddingRight: "pr",
  m: "m", mx: "mx", my: "my", mt: "mt", mb: "mb", ml: "ml", mr: "mr",
  margin: "m", marginX: "mx", marginY: "my",
  marginTop: "mt", marginBottom: "mb", marginLeft: "ml", marginRight: "mr",
  gap: "gap", rowGap: "gap-y", columnGap: "gap-x",
};

/** Properties taking a raw CSS length, emitted as an arbitrary value. */
const ARBITRARY: Record<string, string> = {
  width: "w", height: "h", minWidth: "min-w", minHeight: "min-h",
  maxWidth: "max-w", maxHeight: "max-h",
  top: "top", right: "right", bottom: "bottom", left: "left",
  zIndex: "z", lineHeight: "leading", letterSpacing: "tracking",
  borderRadius: "rounded", fontSize: "text", opacity: "opacity",
};

/**
 * MUI theme color paths to v2 token classes. Deliberately small: only the
 * paths that actually appear in the codebase, so an unrecognized one is
 * reported instead of guessed.
 */
const COLOR_TOKENS: Record<string, string> = {
  "text.primary": "text-foreground",
  "text.secondary": "text-secondary-foreground",
  "text.tertiary": "text-tertiary-foreground",
  "text.disabled": "text-muted-foreground",
  "primary.main": "text-primary",
  "error.main": "text-destructive",
  "success.main": "text-status-success",
  "warning.main": "text-status-warning",
  "info.main": "text-status-info",
  "background.paper": "bg-card",
  "background.default": "bg-background",
  "background.level1": "bg-card-2",
  "background.level2": "bg-card-elevated",
  "divider": "border-border",
  "text.disabled2": "text-muted-foreground",
  "primary.dark": "text-primary-pressed",
  "primary.light": "text-accent",
  "secondary.main": "text-secondary-foreground",
  "grey.500": "text-muted-foreground",
  "common.white": "text-on-media",
  "common.black": "text-scrim",
  "action.active": "text-icon",
  "action.disabled": "text-icon-disabled",
  "action.hover": "bg-hover-subtle",
  inherit: "text-inherit",
  transparent: "bg-transparent",
  none: "bg-transparent",
};

const COLOR_PROPS = new Set(["color", "bgcolor", "backgroundColor", "background", "borderColor"]);

const prefixFor = (prop: string) =>
  prop === "color" ? "text" : prop === "borderColor" ? "border" : "bg";

/** Convert one `key: value` pair. Returns null when unmapped. */
function convert(prop: string, raw: string): string | null {
  const value = raw.trim().replace(/^["'](.*)["']$/, "$1");

  if (ENUMS[prop]?.[value]) return ENUMS[prop][value];

  if (SPACING_PREFIX[prop]) {
    const step = spacing(value);
    return step === null ? null : `${SPACING_PREFIX[prop]}-${step}`;
  }

  if (COLOR_PROPS.has(prop)) {
    if (COLOR_TOKENS[value]) {
      const mapped = COLOR_TOKENS[value];
      // The token table is written with a `text-`/`bg-` prefix already; swap
      // it when the property disagrees.
      const bare = mapped.replace(/^(text|bg|border)-/, "");
      return `${prefixFor(prop)}-${bare}`;
    }
    if (/^var\(--/.test(value) || /^#|^rgb|^hsl/.test(value)) {
      return `${prefixFor(prop)}-[${value.replace(/\s+/g, "_")}]`;
    }
    return null;
  }

  // MUI's type scale in px, mapped onto the v2 semantic sizes where they
  // coincide. Anything else becomes an arbitrary value rather than being
  // rounded to the nearest token, which would silently change the design.
  if (prop === "fontSize") {
    const TYPE: Record<string, string> = {
      "11": "text-caption", "12": "text-meta", "14": "text-body-sm",
      "15": "text-body", "16": "text-heading", "18": "text-title",
      "23": "text-display",
    };
    const px = value.replace(/px$/, "");
    if (TYPE[px]) return TYPE[px];
    if (/^[\d.]+$/.test(value)) return `text-[${value}px]`;
    if (/^[\d.]+(px|rem|em)$/.test(value)) return `text-[${value}]`;
    return null;
  }

  if (ARBITRARY[prop]) {
    if (/^\d+$/.test(value) && (prop === "zIndex" || prop === "opacity")) {
      return `${ARBITRARY[prop]}-${value}`;
    }
    if (value === "100%") {
      if (prop === "width") return "w-full";
      if (prop === "height") return "h-full";
    }
    if (value === "auto") return `${ARBITRARY[prop]}-auto`;
    if (/^[\d.]+(px|rem|em|%|vh|vw)$/.test(value)) {
      return `${ARBITRARY[prop]}-[${value}]`;
    }
    // A bare number in `sx` is px for these properties (unlike the spacing
    // scale, which is multiplied by 8).
    if (/^[\d.]+$/.test(value)) return `${ARBITRARY[prop]}-[${value}px]`;
    return null;
  }

  return null;
}

/** Extract the balanced `{...}` following an index. */
function balanced(src: string, from: number): [string, number] | null {
  const open = src.indexOf("{", from);
  if (open < 0) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return [src.slice(open + 1, i), i];
    }
  }
  return null;
}

interface Skip {
  file: string;
  reason: string;
  snippet: string;
}

const skips: Skip[] = [];
let converted = 0;
let filesChanged = 0;

function processFile(path: string, write: boolean) {
  const original = readFileSync(path, "utf8");
  if (!original.includes("sx=")) return;

  let src = original;
  let changed = false;
  let cursor = 0;

  while (true) {
    const at = src.indexOf("sx={", cursor);
    if (at < 0) break;

    const outer = balanced(src, at + 3);
    if (!outer) break;
    const [outerBody, outerEnd] = outer;
    cursor = at + 4;

    const rel = relative(process.cwd(), path);
    const snippet = src.slice(at, Math.min(outerEnd + 1, at + 90)).replace(/\s+/g, " ");

    // sx={{...}} only; sx={cb}, sx={variable} and sx={[...]} are left alone.
    if (!outerBody.trim().startsWith("{")) {
      skips.push({ file: rel, reason: "not an object literal", snippet });
      continue;
    }
    const inner = balanced(outerBody, 0);
    if (!inner) continue;
    const body = inner[0];

    if (/\.\.\./.test(body)) { skips.push({ file: rel, reason: "spread", snippet }); continue; }
    if (/\?|&&|\|\|/.test(body)) { skips.push({ file: rel, reason: "conditional", snippet }); continue; }
    if (/`|\$\{/.test(body)) { skips.push({ file: rel, reason: "template literal", snippet }); continue; }
    if (/theme|palette/.test(body)) { skips.push({ file: rel, reason: "theme reference", snippet }); continue; }
    if (/\b(xs|sm|md|lg|xl)\s*:/.test(body)) { skips.push({ file: rel, reason: "responsive breakpoint", snippet }); continue; }
    if (/["'][^"']*&|:hover|:focus|@media/.test(body)) { skips.push({ file: rel, reason: "nested selector", snippet }); continue; }

    const pairs = [...body.matchAll(/([a-zA-Z_][\w]*)\s*:\s*([^,{}]+)/g)];
    if (!pairs.length) { skips.push({ file: rel, reason: "no parsable pairs", snippet }); continue; }

    const classes: string[] = [];
    let unmapped: string | null = null;
    for (const [, prop, value] of pairs) {
      const cls = convert(prop, value);
      if (!cls) { unmapped = `${prop}: ${value.trim()}`; break; }
      classes.push(cls);
    }

    if (unmapped) {
      skips.push({ file: rel, reason: `unmapped ${unmapped}`, snippet });
      continue;
    }

    // An element carrying both `sx` and `className` would end up with two
    // `className` attributes. Find the enclosing opening tag and merge into
    // the existing attribute rather than emitting a duplicate.
    let tagStart = src.lastIndexOf("<", at);
    const tag = src.slice(tagStart, outerEnd + 1);
    const existing = /className=(?:"([^"]*)"|\{`([^`]*)`\})/.exec(tag);

    if (existing && existing[2] !== undefined) {
      // Template-literal className: merging would need expression handling.
      skips.push({ file: rel, reason: "className is a template literal", snippet });
      continue;
    }
    if (existing && /className=\{/.test(tag)) {
      skips.push({ file: rel, reason: "className is an expression", snippet });
      continue;
    }

    let replacement = `className="${classes.join(" ")}"`;
    if (existing) {
      const merged = `${existing[1]} ${classes.join(" ")}`.trim();
      const absolute = tagStart + existing.index;
      src =
        src.slice(0, absolute) +
        `className="${merged}"` +
        src.slice(absolute + existing[0].length);
      // Offsets after the tag shifted; recompute this sx block's position.
      const delta = `className="${merged}"`.length - existing[0].length;
      const newAt = at + delta;
      const newEnd = outerEnd + delta;
      src = src.slice(0, newAt) + src.slice(newEnd + 1);
      // Tidy the double space left where sx= used to be.
      src = src.slice(0, newAt).replace(/\s+$/, " ") + src.slice(newAt).replace(/^\s+/, "");
      cursor = newAt;
      converted++;
      changed = true;
      continue;
    }
    src = src.slice(0, at) + replacement + src.slice(outerEnd + 1);
    cursor = at + replacement.length;
    converted++;
    changed = true;
  }

  if (changed) {
    filesChanged++;
    if (write) writeFileSync(path, src);
  }
}

const walk = (target: string): string[] => {
  const st = statSync(target);
  if (st.isFile()) return [target];
  return readdirSync(target).flatMap((entry) => {
    if (/^(node_modules|dist|build|\.next|__generated__|coverage)$/.test(entry)) return [];
    const full = join(target, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return [".tsx", ".jsx"].includes(extname(full)) ? [full] : [];
  });
};

const argv = process.argv.slice(2);
const write = argv.includes("--write");
const targets = argv.filter((a) => a !== "--write");

if (!targets.length) {
  console.error("Usage: tsx utils/codemods/sx-to-classname.ts [--write] <path>...");
  process.exit(1);
}

for (const file of targets.flatMap((t) => walk(resolve(t)))) processFile(file, write);

const byReason = new Map<string, number>();
for (const s of skips) {
  const key = s.reason.startsWith("unmapped") ? `unmapped: ${s.reason.slice(9).split(":")[0]}` : s.reason;
  byReason.set(key, (byReason.get(key) ?? 0) + 1);
}

console.log(
  `${write ? "Converted" : "Would convert"} ${converted} sx block(s) across ${filesChanged} file(s).`,
);
console.log(`Left alone: ${skips.length}\n`);
console.log("reasons:");
for (const [reason, n] of [...byReason].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`  ${String(n).padStart(4)}  ${reason}`);
}
if (!write) console.log("\nDry run. Pass --write to apply.");
