/**
 * Rewrite a page copied out of the Lovable master project so it imports from
 * the design system instead of the project's local `components/ui` tree.
 *
 * This is step one of the intended workflow: copy a Lovable page, run this,
 * wire it to a real API. Everything the design system already covers is left
 * alone — no re-implementing, no re-styling, no "while I'm here". Whatever
 * cannot be mapped is reported rather than guessed at, so the gap is visible
 * instead of silently hand-rolled.
 *
 * Usage:
 *   tsx utils/lovable-to-voodo.ts <file-or-dir> [...more]
 *   tsx utils/lovable-to-voodo.ts --check <file-or-dir>   # report only
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative, resolve } from "path";

const PACKAGE = "@voxel51/voodo/v2";

/**
 * Barrel exports renamed to avoid collisions. Mirrors ALIASES in
 * generate-v2-index.ts — a page importing `Toaster` from `sonner` means
 * sonner's Toaster, which the barrel exposes under a distinct name.
 */
const ALIASES: Record<string, Record<string, string>> = {
  sonner: { Toaster: "SonnerToaster", toast: "sonnerToast" },
  "form-section": { FormField: "FormSectionField" },
};

/** Specifiers that resolve to the design system's flat barrel. */
const BARREL_SOURCES = [
  /^@\/components\/ui\/([a-z0-9-]+)$/,
  /^@\/lib\/utils$/,
  /^@\/lib\/vizPalette$/,
  /^@\/lib\/saveStatusStore$/,
  /^@\/hooks\/use-toast$/,
  /^@\/hooks\/use-mobile$/,
];

interface Unmapped {
  file: string;
  specifier: string;
  names: string;
}

const IMPORT_RE =
  /import\s+(type\s+)?\{([^}]*)\}\s*from\s*["']([^"']+)["'];?\n?/g;

const rewrite = (code: string, file: string, unmapped: Unmapped[]): string => {
  const value = new Set<string>();
  const types = new Set<string>();
  let matched = false;
  let firstIndex = -1;

  const stripped = code.replace(
    IMPORT_RE,
    (full, typeOnly: string | undefined, clause: string, source: string, offset: number) => {
      // Flag app-internal imports the design system does not provide. These
      // are the page's own patterns and data — the caller wires them up.
      if (source.startsWith("@/") && !BARREL_SOURCES.some((r) => r.test(source))) {
        unmapped.push({ file, specifier: source, names: clause.trim() });
        return full;
      }

      const uiModule = source.match(/^@\/components\/ui\/([a-z0-9-]+)$/)?.[1];
      if (!uiModule && !BARREL_SOURCES.some((r) => r.test(source))) return full;

      const alias = (uiModule && ALIASES[uiModule]) || {};
      for (const raw of clause.split(",")) {
        const name = raw.trim();
        if (!name) continue;
        const isType = typeOnly !== undefined || name.startsWith("type ");
        const bare = name.replace(/^type\s+/, "");
        // `X as Y` keeps the caller's local name; only the imported side moves.
        const [imported, local] = bare.split(/\s+as\s+/).map((s) => s.trim());
        const target = alias[imported] ?? imported;
        const clauseText = local
          ? `${target} as ${local}`
          : target !== imported
            ? `${target} as ${imported}`
            : target;
        (isType ? types : value).add(clauseText);
      }

      matched = true;
      if (firstIndex < 0) firstIndex = offset;
      return "";
    },
  );

  if (!matched) return code;

  const lines: string[] = [];
  if (value.size)
    lines.push(`import { ${[...value].sort().join(", ")} } from "${PACKAGE}";`);
  if (types.size)
    lines.push(
      `import type { ${[...types].sort().join(", ")} } from "${PACKAGE}";`,
    );

  // Re-insert where the first rewritten import stood, preserving import order
  // relative to the file's other imports.
  return stripped.slice(0, firstIndex) + lines.join("\n") + "\n" + stripped.slice(firstIndex);
};

const files = (target: string): string[] => {
  const stat = statSync(target);
  if (stat.isFile()) return [target];
  return readdirSync(target).flatMap((entry) => {
    const full = join(target, entry);
    if (statSync(full).isDirectory()) return files(full);
    return [".ts", ".tsx"].includes(extname(full)) ? [full] : [];
  });
};

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const targets = args.filter((a) => a !== "--check");

if (!targets.length) {
  console.error("Usage: tsx utils/lovable-to-voodo.ts [--check] <file-or-dir>...");
  process.exit(1);
}

const unmapped: Unmapped[] = [];
let changed = 0;

for (const target of targets.flatMap((t) => files(resolve(t)))) {
  const before = readFileSync(target, "utf8");
  const after = rewrite(before, relative(process.cwd(), target), unmapped);
  if (after !== before) {
    changed++;
    if (!checkOnly) writeFileSync(target, after);
  }
}

console.log(
  checkOnly
    ? `${changed} file(s) would be rewritten to import from ${PACKAGE}`
    : `Rewrote ${changed} file(s) to import from ${PACKAGE}`,
);

if (unmapped.length) {
  console.log(
    `\n${unmapped.length} import(s) are not design-system components — wire these up yourself:`,
  );
  for (const u of unmapped) {
    console.log(`  ${u.file}\n    ${u.specifier}  →  ${u.names}`);
  }
}
