import type { ResolvedNode, TreeNode } from "./types";

const PATH_SEPARATOR = "/";

/**
 * Whether a node counts as a leaf (has no children).
 * Both `undefined` and empty-array `values` are treated as leaves.
 */
function nodeIsLeaf(node: TreeNode): boolean {
  return !node.values || node.values.length === 0;
}

/**
 * Whether a node is selectable given the current mode flags.
 *
 * A node is selectable when:
 * 1. Its `can_select` is not explicitly `false` (defaults to `true`).
 * 2. If `leavesOnly` is enabled, the node must be a leaf.
 */
export function isSelectable(
  node: TreeNode,
  options: { leavesOnly?: boolean } = {}
): boolean {
  if (node.can_select === false) return false;
  if (options.leavesOnly && !nodeIsLeaf(node)) return false;
  return true;
}

/**
 * Recursively resolves a {@link TreeNode} subtree into a parallel
 * {@link ResolvedNode} tree with pre-computed paths, depths, and
 * selectability flags.
 *
 * @param root The root node of the taxonomy tree.
 * @param options.leavesOnly When `true`, branch nodes are marked non-selectable.
 * @returns The resolved root node (callers typically render its `children`).
 */
export function buildResolvedTree(
  root: TreeNode,
  options: { leavesOnly?: boolean } = {}
): ResolvedNode {
  function walk(
    node: TreeNode,
    parentPath: string,
    depth: number
  ): ResolvedNode {
    const path = parentPath
      ? `${parentPath}${PATH_SEPARATOR}${node.name}`
      : node.name;

    const isLeaf = nodeIsLeaf(node);

    const children = isLeaf
      ? []
      : node.values!.map((child) => walk(child, path, depth + 1));

    return {
      node,
      path,
      depth,
      selectable: isSelectable(node, options),
      isLeaf,
      children,
    };
  }

  return walk(root, "", 0);
}

/**
 * Flattens a resolved tree into a list of nodes whose names match the
 * given query (case-insensitive substring match). Only selectable nodes
 * are returned — non-selectable branch headers are skipped.
 *
 * Used to power the typeahead "flat search" mode: when the user types a
 * query, the tree view is replaced with a flat list of matching results.
 */
export function flattenForFilter(
  resolved: ResolvedNode,
  query: string
): ResolvedNode[] {
  const results: ResolvedNode[] = [];
  const lowerQuery = query.toLowerCase();

  function walk(node: ResolvedNode): void {
    if (
      node.selectable &&
      node.node.name.toLowerCase().includes(lowerQuery)
    ) {
      results.push(node);
    }
    for (const child of node.children) {
      walk(child);
    }
  }

  walk(resolved);
  return results;
}

/**
 * Resolves a slash-delimited path back to the corresponding
 * {@link TreeNode} in the original tree.
 *
 * @returns The matching node, or `undefined` if the path doesn't match.
 *
 * @example
 * ```ts
 * const node = getNodeByPath(root, "vehicle_type/car/make/Honda");
 * // node?.name === "Honda"
 * ```
 */
export function getNodeByPath(
  root: TreeNode,
  path: string
): TreeNode | undefined {
  const segments = splitPath(path);
  if (segments.length === 0) return undefined;

  if (segments[0] !== root.name) return undefined;

  let current: TreeNode = root;
  for (let i = 1; i < segments.length; i++) {
    const child = current.values?.find((v) => v.name === segments[i]);
    if (!child) return undefined;
    current = child;
  }

  return current;
}

/**
 * Splits a path string into its individual node-name segments.
 *
 * Useful for rendering breadcrumbs: each segment can be resolved to its
 * {@link TreeNode} by calling {@link getNodeByPath} with the prefix path.
 *
 * @example
 * ```ts
 * splitPath("vehicle_type/car/make/Honda");
 * // ["vehicle_type", "car", "make", "Honda"]
 * ```
 */
export function splitPath(path: string): string[] {
  if (!path) return [];
  return path.split(PATH_SEPARATOR);
}

/**
 * Formats a path as a human-readable breadcrumb string.
 *
 * @example
 * ```ts
 * formatBreadcrumb("vehicle_type/car/make/Honda");
 * // "vehicle_type / car / make / Honda"
 * ```
 */
export function formatBreadcrumb(path: string): string {
  return splitPath(path).join(" / ");
}
