/**
 * Pure helpers for the `voodo` command (`bin/voodo.mjs`). They read the
 * package's shipped `.d.ts` files as plain text and turn them into short,
 * agent-friendly output.
 *
 * Built as its own entry (`dist/cli.js`) so the command can run from an
 * installed package without React. No dependencies and no TypeScript
 * compiler: the emitted declarations are regular enough to read with a few
 * regular expressions, and the spec pins down every shape this relies on.
 */

export interface ComponentEntry {
  name: string;
  /** Path of the declaring `.d.ts`, relative to the package root. */
  file: string;
  /** First sentence of the component's JSDoc. */
  summary: string;
  /** Whether its JSDoc carries at least one `@example`. */
  hasExample: boolean;
  deprecated: boolean;
  internal: boolean;
}

export interface DeclarationFile {
  /** `/`-separated, relative to the package root. */
  path: string;
  text: string;
}

/** Token string values, current ones apart from deprecated ones. */
export interface TokenValues {
  values: string[];
  deprecated: string[];
}

/** One token group's values, plus each member's value by member name. */
export interface TokenGroup extends TokenValues {
  members: Record<string, string>;
}

/** Token group name → its values. */
export type TokenGroups = Record<string, TokenGroup>;

/**
 * An optional JSDoc block followed by a top-level `declare const` or
 * `declare function` whose name starts upper-case. The JSDoc body may not
 * contain `*\/`, so a match never glues two comment blocks together.
 */
const DECLARATION =
  /(?:\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*)?^(?:export )?declare (const|function) ([A-Z][A-Za-z0-9]*)([^\n]*)/gm;

const COMPONENT_TYPE =
  /^(?:<[^>]*>)?\(|^: (?:React\.)?FC<|^: import\(['"]react['"]\)\.(?:ForwardRef|Memo|Named)ExoticComponent</;

/**
 * Whether a declaration's type describes a component. Object types count when
 * their first member is a call signature (`{ (props): JSX.Element; … }`, the
 * shape `displayName` assignments produce); token consts are object types too,
 * but their members are `readonly` string literals.
 */
const isComponent = (
  kind: string,
  rest: string,
  following: string
): boolean => {
  if (kind === "function") return true;
  if (COMPONENT_TYPE.test(rest)) return true;

  return rest === ": {" && /^\s*\(/.test(following);
};

const docLines = (doc: string): string[] =>
  doc.split("\n").map((line) => line.replace(/^\s*\* ?/, "").trimEnd());

const LINK = /\{@link\s+([^}\s]+)\s*\}/g;

const stripLinks = (text: string): string => text.replace(LINK, "$1");

/**
 * The first sentence of a JSDoc description: the text before the first blank
 * line or tag, with links reduced to their names.
 *
 * @param doc Raw JSDoc body, without the delimiters.
 */
export const summarize = (doc: string): string => {
  const paragraph: string[] = [];

  for (const line of docLines(doc)) {
    // The body starts with the rest of the `/**` line, usually empty.
    if (!line.trim() && !paragraph.length) continue;
    if (!line.trim() || line.trimStart().startsWith("@")) break;
    paragraph.push(line.trim());
  }

  const text = stripLinks(paragraph.join(" ")).replace(/\s+/g, " ").trim();
  const sentence = text.match(/^.*?[.!?](?=\s|$)/);

  return sentence ? sentence[0] : text;
};

/** Every component declared in the given files, sorted by name. */
export const findComponents = (files: DeclarationFile[]): ComponentEntry[] =>
  files
    .flatMap(({ path, text }) =>
      [...text.matchAll(DECLARATION)]
        .filter((match) =>
          isComponent(
            match[2] ?? "",
            match[4] ?? "",
            text.slice((match.index ?? 0) + match[0].length)
          )
        )
        .map((match) => {
          const doc = match[1] ?? "";

          return {
            name: match[3] ?? "",
            file: path,
            summary: summarize(doc),
            hasExample: /@example\b/.test(doc),
            deprecated: /@deprecated\b/.test(doc),
            internal: /@internal\b/.test(doc),
          };
        })
    )
    .sort((a, b) => a.name.localeCompare(b.name));

const directory = (path: string): string =>
  path.slice(0, path.lastIndexOf("/"));

/**
 * The declaration file a relative specifier points at: `./Button` is either
 * `Button.d.ts` or `Button/index.d.ts`.
 */
const resolveModule = (
  files: ReadonlyMap<string, string>,
  from: string,
  specifier: string
): string | undefined => {
  const parts: string[] = [];

  for (const segment of `${directory(from)}/${specifier}`.split("/")) {
    if (segment === "..") parts.pop();
    else if (segment !== ".") parts.push(segment);
  }

  const base = parts.join("/");

  return [`${base}.d.ts`, `${base}/index.d.ts`].find((path) => files.has(path));
};

/**
 * Every value a barrel exports, mapped to the file that declares it. Follows
 * `export * from` and `export { a, b as c } from` through other declaration
 * files; `export type` re-exports carry no values and are skipped.
 *
 * @param files Path → text, `/`-separated.
 * @param entry The barrel to start from.
 */
export const resolveExports = (
  files: ReadonlyMap<string, string>,
  entry: string
): Map<string, string> => {
  const exported = new Map<string, string>();
  const text = files.get(entry) ?? "";

  for (const [, name] of text.matchAll(
    /^export declare (?:const|function|enum) ([A-Za-z0-9_$]+)/gm
  )) {
    if (name) exported.set(name, entry);
  }

  for (const [, specifier] of text.matchAll(
    /^export \* from ['"]([^'"]+)['"];/gm
  )) {
    const target = specifier && resolveModule(files, entry, specifier);

    if (target) {
      for (const [name, file] of resolveExports(files, target)) {
        exported.set(name, file);
      }
    }
  }

  for (const [, list, specifier] of text.matchAll(
    /^export \{([^}]*)\} from ['"]([^'"]+)['"];/gm
  )) {
    const target = specifier && resolveModule(files, entry, specifier);

    if (!target || !list) continue;

    const inner = resolveExports(files, target);

    for (const spec of list.split(",").map((part) => part.trim())) {
      if (!spec) continue;

      const [local = spec, alias = local] = spec.split(/\s+as\s+/);
      // `default` re-exports name the file's own declaration.
      const file = local === "default" ? target : inner.get(local);

      if (file) exported.set(alias, file);
    }
  }

  return exported;
};

const CONST_GROUP =
  /^export declare const ([A-Z][A-Za-z0-9]*): \{\n([\s\S]*?)\n\};/gm;
const ENUM_GROUP =
  /^export declare enum ([A-Z][A-Za-z0-9]*) \{\n([\s\S]*?)\n\}/gm;

const isComment = (line: string): boolean =>
  line.startsWith("/") || line.startsWith("*");

/**
 * Reads a group body's members with `member`, which captures a member's name
 * and then its value, sorting each value into current or deprecated by
 * whether the JSDoc just above it says `@deprecated`. Returns `undefined`
 * when a non-comment line is not a string member, which means the body is
 * not a token group.
 */
const readMembers = (body: string, member: RegExp): TokenGroup | undefined => {
  const group: TokenGroup = { values: [], deprecated: [], members: {} };
  let deprecated = false;

  for (const line of body.split("\n").map((raw) => raw.trim())) {
    if (!line) continue;

    if (isComment(line)) {
      deprecated ||= line.includes("@deprecated");
      continue;
    }

    const [, name, value] = line.match(member) ?? [];

    if (name === undefined || value === undefined) return undefined;

    group.members[name] = value;

    const list = deprecated ? group.deprecated : group.values;

    if (!list.includes(value)) list.push(value);
    deprecated = false;
  }

  return group.values.length || group.deprecated.length ? group : undefined;
};

/**
 * String-valued token consts (`export declare const Size: { readonly Sm: "sm" … }`)
 * and string enums (`export declare enum X { A = "a" … }`), by name.
 */
export const findTokenGroups = (files: DeclarationFile[]): TokenGroups => {
  const groups: TokenGroups = {};

  for (const { text } of files) {
    for (const [, name, body] of text.matchAll(CONST_GROUP)) {
      const group =
        body === undefined
          ? undefined
          : readMembers(body, /^readonly ([A-Za-z0-9]+): "([^"]*)";$/);

      if (name && group) groups[name] = group;
    }

    for (const [, name, body] of text.matchAll(ENUM_GROUP)) {
      const group =
        body === undefined
          ? undefined
          : readMembers(body, /^([A-Za-z0-9]+) = "([^"]*)",?$/);

      if (name && group) groups[name] = group;
    }
  }

  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  );
};

/** A one-line type alias: its name, then its type. */
const ALIAS = /^(?:export )?type ([A-Z][A-Za-z0-9]*) = ([^\n]+);$/gm;
const NARROWING = /^(Exclude|Extract)<([A-Z][A-Za-z0-9]*), (.+)>$/;
const MEMBER = /^([A-Z][A-Za-z0-9]*)\.([A-Za-z0-9]+)$/;

/**
 * The values of a `|` list of members such as `Size.Sm | Size.Md`, each kept
 * current or deprecated as its own group has it. `undefined` when any part is
 * not a known member.
 */
const readMemberList = (
  list: string,
  tokens: TokenGroups
): TokenValues | undefined => {
  const result: TokenValues = { values: [], deprecated: [] };

  for (const part of list.split("|").map((raw) => raw.trim())) {
    const [, groupName = "", memberName = ""] = part.match(MEMBER) ?? [];
    const group: TokenGroup | undefined = tokens[groupName];
    const value: string | undefined = group?.members[memberName];

    if (!group || value === undefined) return undefined;

    const into = group.deprecated.includes(value)
      ? result.deprecated
      : result.values;

    into.push(value);
  }

  return result;
};

/**
 * The values a narrowed token type allows. Handles the shapes components
 * use: `Exclude<Size, Size.Lg | Size.Xl>`, `Extract<Size, Size.Sm | Size.Md>`
 * and `Size.Sm | Size.Md`, each with or without a `` `${…}` `` wrapper.
 * `undefined` for any other type, which is then left as written.
 */
const resolveAlias = (
  type: string,
  tokens: TokenGroups
): TokenValues | undefined => {
  const inner = type.match(/^`\$\{(.*)\}`$/)?.[1] ?? type;
  const [, kind, groupName = "", list = ""] = inner.match(NARROWING) ?? [];

  if (!kind) return readMemberList(inner, tokens);

  const group: TokenGroup | undefined = tokens[groupName];
  const named = readMemberList(list, tokens);

  if (!group || !named) return undefined;

  const listed = [...named.values, ...named.deprecated];
  const keep = (value: string): boolean =>
    listed.includes(value) === (kind === "Extract");

  return {
    values: group.values.filter(keep),
    deprecated: group.deprecated.filter(keep),
  };
};

const quote = (values: readonly string[]): string[] =>
  values.map((value) => JSON.stringify(value));

/** `type Size = "sm" | "md";`, plus a comment naming any deprecated values. */
const renderUnion = (
  name: string,
  { values, deprecated }: TokenValues
): string =>
  `type ${name} = ${quote(values).join(" | ") || "never"};` +
  (deprecated.length ? ` // deprecated: ${quote(deprecated).join(", ")}` : "");

export const renderList = (
  components: readonly ComponentEntry[],
  iconNames: readonly string[],
  version: string
): string => {
  const shown = components.filter((entry) => !entry.internal);
  const width = Math.max(0, ...shown.map((entry) => entry.name.length));
  const rows = shown.map((entry) => {
    const note = entry.deprecated ? " (deprecated)" : "";

    return `${entry.name.padEnd(width)}  ${entry.summary}${note}`;
  });

  return [
    `@voxel51/voodo ${version}: ${shown.length} components, plus ${iconNames.length} icons.`,
    "Run `voodo docs <Name>` for a component's props, docs and token values.",
    "",
    ...rows,
    "",
    `Icons are per-icon components such as ${iconNames.slice(0, 3).join(", ")}. Run \`voodo icons\` for every name.`,
  ].join("\n");
};

/**
 * The declaration file for one component, trimmed for reading, with the value
 * of every token type it mentions written out below it. A narrowed alias
 * (`type ButtonSize = Exclude<Size, …>`) is written out as the values it
 * allows, and the group it narrows only when the file uses that group
 * elsewhere.
 *
 * @param text The declaring file's contents.
 */
export const renderDocs = (
  entry: ComponentEntry,
  text: string,
  tokens: TokenGroups
): string => {
  const body = text
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("import ") &&
        !line.startsWith("//# sourceMappingURL") &&
        line !== "export {};"
    )
    .join("\n")
    .trim();
  const aliases = [...body.matchAll(ALIAS)].flatMap(([line, name, type]) => {
    const values = name && type ? resolveAlias(type, tokens) : undefined;

    return values ? [{ line, name, values }] : [];
  });
  // Types and `{@link}`s count as using a group. Prose does not ("Size of
  // the toggle"), and neither does the group a resolved alias narrows.
  const references = aliases
    .reduce((rest, { line }) => rest.replace(line, ""), body)
    .split("\n")
    .map((line) =>
      isComment(line.trim())
        ? [...line.matchAll(LINK)].map(([, target]) => target).join(" ")
        : line
    )
    .join("\n");
  // Groups declared in this file are already visible in `body`.
  const local = Object.keys(findTokenGroups([{ path: entry.file, text }]));
  const used = Object.entries(tokens).filter(
    ([name]) =>
      !local.includes(name) && new RegExp(`\\b${name}\\b`).test(references)
  );
  const unions = [
    ...aliases.map(({ name, values }) => renderUnion(name, values)),
    ...used.map(([name, group]) => renderUnion(name, group)),
  ];

  return [
    `import { ${entry.name} } from "@voxel51/voodo";`,
    `// ${entry.file}`,
    "",
    body,
    ...(unions.length ? ["", "// Token values used above", ...unions] : []),
  ].join("\n");
};

/** Every token group, or only the one named `only` (case-insensitive). */
export const renderTokens = (tokens: TokenGroups, only?: string): string =>
  Object.entries(tokens)
    .filter(([name]) => !only || name.toLowerCase() === only.toLowerCase())
    .map(([name, group]) => renderUnion(name, group))
    .join("\n");

/** Case-insensitive lookup, with near matches when there is no exact one. */
export const lookup = (
  components: readonly ComponentEntry[],
  query: string
): { match?: ComponentEntry; suggestions: string[] } => {
  const wanted = query.toLowerCase();
  const match = components.find((entry) => entry.name.toLowerCase() === wanted);
  const suggestions = match
    ? []
    : components
        .filter((entry) => entry.name.toLowerCase().includes(wanted))
        .map((entry) => entry.name);

  return { match, suggestions };
};
