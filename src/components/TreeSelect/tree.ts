import type { ResolvedNode, TreeNode } from "./types";

const PATH_SEPARATOR = "/";

/**
 * Encode a single node name for use as a path segment. Only `/` and `%`
 * are encoded — the two characters that would break path parsing.
 * All other characters pass through unchanged, keeping paths readable.
 */
function encodeSegment(name: string): string {
  return name.replace(/%/g, "%25").replace(/\//g, "%2F");
}

/**
 * Decode a single encoded path segment back to the original node name.
 * Decoding order is the reverse of encoding: `%2F` first, then `%25`.
 */
function decodeSegment(seg: string): string {
  return seg.replace(/%2F/gi, "/").replace(/%25/gi, "%");
}

/**
 * Join an array of (raw, unencoded) node names into a safe path string.
 * Each segment is encoded before joining so slashes in names cannot be
 * mistaken for path separators.
 */
function joinPath(segments: string[]): string {
  return segments.map(encodeSegment).join(PATH_SEPARATOR);
}

/**
 * Constructs a path string from an ordered array of raw node names.
 *
 * Node names that contain `/` or `%` are encoded automatically, so the
 * resulting path is always safe to pass to {@link getNodeByPath},
 * {@link TreeSelectProps.value}, {@link TreeSelectProps.defaultExpanded}, etc.
 *
 * Use this when building a path programmatically rather than by selecting
 * a node in the UI (which produces an already-encoded path via `onChange`).
 *
 * @example
 * ```ts
 * encodePath(["bands", "AC/DC"]);
 * // "bands/AC%2FDC"
 *
 * encodePath(["root", "50% off", "deal"]);
 * // "root/50%25 off/deal"
 * ```
 */
export function encodePath(segments: string[]): string {
  return joinPath(segments);
}

/**
 * Whether a node counts as a leaf (has no children).
 *
 * Only `values: undefined` indicates a leaf. `values: []` represents a
 * branch whose children have not yet been loaded (truncated by the
 * source) and is therefore *not* a leaf — it should still render with
 * a chevron.
 */
function nodeIsLeaf(node: TreeNode): boolean {
  return node.values === undefined;
}

/**
 * Whether a node is selectable given the current mode flags.
 *
 * A node is selectable when:
 * 1. Its `can_select` is not explicitly `false` (defaults to `true`).
 * 2. If `leavesOnly` is enabled, the node must be a leaf.
 */
export function isSelectable(node: TreeNode, leavesOnly = false): boolean {
  if (node.can_select === false) return false;
  if (leavesOnly && !nodeIsLeaf(node)) return false;
  return true;
}

/**
 * Recursively resolves a {@link TreeNode} subtree into a parallel
 * {@link ResolvedNode} tree with pre-computed paths, depths, and
 * selectability flags.
 *
 * @param root The root node of the tree.
 * @param options.leavesOnly When `true`, branch nodes are marked non-selectable.
 * @param loadedChildren Cache of asynchronously fetched children, keyed by
 *   slash-delimited path. When a node has `values: []` and a cache entry
 *   exists, the cached children are used in place of the empty array.
 * @returns The resolved root node (callers typically render its `children`).
 */
export function buildResolvedTree(
  root: TreeNode,
  options: { leavesOnly?: boolean } = {},
  loadedChildren?: Map<string, TreeNode[]>
): ResolvedNode {
  function walk(
    node: TreeNode,
    parentPath: string,
    depth: number,
    index: number,
    siblingCount: number
  ): ResolvedNode {
    const path = parentPath
      ? `${parentPath}${PATH_SEPARATOR}${encodeSegment(node.name)}`
      : encodeSegment(node.name);

    const isLeaf = nodeIsLeaf(node);
    const cached = loadedChildren?.get(path);
    const sourceIsTruncatedBranch =
      Array.isArray(node.values) && node.values.length === 0;
    const isLazyBranch = sourceIsTruncatedBranch && !cached?.length;

    const childValues = isLeaf
      ? []
      : node.values?.length
        ? node.values
        : (cached ?? []);
    const children = childValues.map((child, i) =>
      walk(child, path, depth + 1, i, childValues.length)
    );

    return {
      node,
      path,
      depth,
      selectable: isSelectable(node, options.leavesOnly),
      isLeaf,
      isLazyBranch,
      children,
      posinset: index + 1,
      setsize: siblingCount,
    };
  }

  return walk(root, "", 0, 0, 1);
}

/**
 * Filters a resolved tree for a search query, returning a pruned copy of the
 * tree that contains only:
 * - Matched nodes (case-insensitive name substring match, any node)
 * - Every ancestor of a match (force-expanded so the match is visible)
 * - Siblings of each match (rendered but subtrees pruned)
 * - Direct children of each match (rendered collapsed)
 *
 * Returns `null` when no nodes match the query.
 */
export function filterTreeForQuery(
  resolved: ResolvedNode,
  query: string
): { tree: ResolvedNode; forceOpenPaths: Set<string> } | null {
  const lowerQuery = query.toLowerCase();

  const matchedPaths = new Set<string>();

  function collectMatches(node: ResolvedNode): void {
    if (node.node.name.toLowerCase().includes(lowerQuery)) {
      matchedPaths.add(node.path);
    }
    for (const child of node.children) {
      collectMatches(child);
    }
  }

  collectMatches(resolved);

  if (matchedPaths.size === 0) return null;

  const includedPaths = new Set<string>();
  const forceOpenPaths = new Set<string>();

  function addAncestors(path: string): void {
    const segments = splitPath(path);
    for (let i = 0; i < segments.length - 1; i++) {
      const current = joinPath(segments.slice(0, i + 1));
      includedPaths.add(current);
      forceOpenPaths.add(current);
    }
  }

  for (const matchPath of matchedPaths) {
    includedPaths.add(matchPath);
    addAncestors(matchPath);
  }

  function addSubtree(node: ResolvedNode): void {
    includedPaths.add(node.path);
    for (const child of node.children) {
      addSubtree(child);
    }
  }

  function findNode(
    root: ResolvedNode,
    path: string
  ): ResolvedNode | undefined {
    if (root.path === path) return root;
    for (const child of root.children) {
      const found = findNode(child, path);
      if (found) return found;
    }
    return undefined;
  }

  for (const matchPath of matchedPaths) {
    const matchNode = findNode(resolved, matchPath);
    if (matchNode) {
      addSubtree(matchNode);
    }
  }

  function pruneTree(node: ResolvedNode): ResolvedNode {
    const filteredChildren = node.children
      .filter((child) => includedPaths.has(child.path))
      .map((child, i, arr) => {
        const pruned = pruneTree(child);
        return { ...pruned, posinset: i + 1, setsize: arr.length };
      });

    return { ...node, children: filteredChildren };
  }

  return { tree: pruneTree(resolved), forceOpenPaths };
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
 * Segments are returned in their original (decoded) form — any `/` or `%`
 * characters that were encoded during path construction are restored here.
 *
 * Useful for rendering breadcrumbs: each segment can be resolved to its
 * {@link TreeNode} by calling {@link getNodeByPath} with the prefix path.
 *
 * @example
 * ```ts
 * splitPath("vehicle_type/car/make/Honda");
 * // ["vehicle_type", "car", "make", "Honda"]
 *
 * splitPath("bands/AC%2FDC");
 * // ["bands", "AC/DC"]
 * ```
 */
export function splitPath(path: string): string[] {
  if (!path) return [];
  return path.split(PATH_SEPARATOR).map(decodeSegment);
}

/**
 * Returns the parent path by stripping the last segment, or `undefined`
 * for root-level paths (single segment).
 */
export function getParentPath(path: string): string | undefined {
  const idx = path.lastIndexOf(PATH_SEPARATOR);
  return idx === -1 ? undefined : path.slice(0, idx);
}

/**
 * Depth-first walk of a resolved tree returning nodes in DOM render order.
 * Skips the root itself (callers render `root.children`). For each child,
 * includes the child, then if `isOpen(child.path)` returns true, recurses
 * into its children. This mirrors exactly what `TreeSelectNode` renders.
 */
export function flattenVisible(
  root: ResolvedNode,
  isOpen: (path: string) => boolean
): ResolvedNode[] {
  const result: ResolvedNode[] = [];

  function walk(node: ResolvedNode): void {
    result.push(node);
    if (!node.isLeaf && isOpen(node.path)) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  for (const child of root.children) {
    walk(child);
  }

  return result;
}

/**
 * Collects the paths of every non-leaf (branch) node in a resolved tree.
 * Useful for resolving `defaultExpanded: true` into a concrete set of paths.
 */
export function collectBranchPaths(root: ResolvedNode): Set<string> {
  const paths = new Set<string>();

  function walk(node: ResolvedNode): void {
    if (!node.isLeaf) {
      paths.add(node.path);
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  for (const child of root.children) {
    walk(child);
  }

  return paths;
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
