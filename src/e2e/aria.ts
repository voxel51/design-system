/** One node of a given role in an aria snapshot. */
export interface AriaEntry {
  /** Accessible name, exactly as `getByRole(role, { name, exact: true })` matches it. */
  name: string;
  /** Whether the node carries `[selected]`. */
  selected: boolean;
}

/**
 * Reads every node of `role` out of a `locator.ariaSnapshot()` result, in
 * document order. Page objects use this instead of `textContent` or
 * `innerText`: neither reproduces the accessible name when a label spans
 * several block elements or is transformed by CSS, and the accessible name is
 * what role-based locators match.
 */
export const ariaEntries = (snapshot: string, role: string): AriaEntry[] => {
  const pattern = new RegExp(
    `^\\s*- ${role} "((?:[^"\\\\]|\\\\.)*)"(.*)$`,
    "gm"
  );
  return [...snapshot.matchAll(pattern)].map((match) => ({
    name: match[1].replace(/\\(.)/g, "$1"),
    selected: /\[selected\]/.test(match[2]),
  }));
};
