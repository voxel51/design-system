import type { HTMLAttributes } from "react";

import type { SelectAnchor } from "@/components/Select";
import type { ZIndex } from "@/types";

/**
 * An ordered list of node names from root to the target node.
 *
 * Each element is the raw {@link TreeNode.name} — no encoding is needed.
 * For example, a path to an "AC/DC" node under "rock" under "music"
 * is simply `["music", "rock", "AC/DC"]`.
 */
export type TreePath = readonly string[];

/**
 * A node within a tree.
 *
 * `values` has three meaningful states:
 * - `TreeNode[]` (non-empty) — branch with known, loaded children.
 * - `[]` — branch whose children have not yet been loaded (truncated by
 *   the source). Renders with a chevron; expanding it triggers
 *   `loadChildren` (when wired up).
 * - `undefined` — leaf node; the field is omitted entirely.
 */
export interface TreeNode {
  name: string;
  description?: string;
  can_select?: boolean;
  deprecated?: boolean;
  values?: TreeNode[];
}

/**
 * Pre-computed representation of a {@link TreeNode} produced by
 * {@link buildResolvedTree}. Carries the original node plus derived metadata
 * so the renderer never needs to recompute selectability or paths.
 */
export interface ResolvedNode {
  /** Reference to the original input node. */
  node: TreeNode;
  /** Slash-delimited path from the root, e.g. `"car/Honda/model/Civic"`. */
  path: string;
  /** Zero-based depth in the tree (root children = 0). */
  depth: number;
  /** Whether this node can be selected given current mode flags. */
  selectable: boolean;
  /** `true` when the source node has `values: undefined` (a true leaf). */
  isLeaf: boolean;
  /**
   * `true` when the source node has `values: []` (truncated branch) and
   * no cached children have been loaded for this path yet. Renders as a
   * branch (chevron visible) with an empty `children` array.
   */
  isLazyBranch: boolean;
  /** Pre-resolved children, in source order. Empty array for leaves and lazy branches. */
  children: ResolvedNode[];
  /** 1-based position among siblings (for `aria-posinset`). */
  posinset: number;
  /** Total number of siblings including this node (for `aria-setsize`). */
  setsize: number;
}

/**
 * Props shared by single-select and multi-select modes.
 */
interface TreeSelectBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** The root node of the tree. */
  root: TreeNode;
  /**
   * When `true`, only leaf nodes (nodes with no children) are selectable.
   * Branch nodes still expand/collapse but cannot be picked as values.
   * @default false
   */
  leavesOnly?: boolean;
  /** If `true`, the entire component is disabled. */
  disabled?: boolean;
  /** Placeholder text shown in the input when no value is selected. */
  placeholder?: string;
  /**
   * Position of the dropdown panel relative to the trigger.
   * Reuses {@link SelectAnchor} for consistency with {@link Select}.
   */
  anchor?: SelectAnchor;
  /**
   * Renders the dropdown panel in a portal so it escapes overflow-hidden
   * ancestors. Defaults to `false`.
   */
  portal?: boolean;
  /** Explicit z-index for the dropdown panel. */
  zIndex?: ZIndex;
  /**
   * Maximum height of the dropdown panel. Accepts any valid CSS length value
   * (e.g. `"400px"`, `"50vh"`). Defaults to `"18rem"` (equivalent to
   * Tailwind's `max-h-72`).
   */
  panelMaxHeight?: string;
  /**
   * Custom formatter for the trigger display text when a value is selected.
   * Receives the selected path (as a {@link TreePath} of raw node names)
   * and the corresponding {@link TreeNode}.
   * When omitted, the node name is shown (e.g. `"Civic"`).
   */
  displayValue?: (path: TreePath, node: TreeNode) => string;
  /**
   * Fetches children for a lazy branch (a node whose `values` is an empty
   * array). Called exactly once per lazy branch on first user-initiated
   * expand. Receives a {@link TreePath} of raw node names.
   * The returned children are spliced into the tree and cached for
   * the lifetime of `root`. Errors set the branch to an "error" state with
   * an inline retry control.
   */
  loadChildren?: (path: TreePath) => Promise<TreeNode[]>;
  /**
   * Branches to expand when the panel first opens. Unlike `forceOpenPaths`
   * (which prevents collapsing), these paths are user-collapsible and
   * restored on panel re-open.
   *
   * - `TreePath[]` — explicit branch paths (each a {@link TreePath} of
   *   raw node names) to start expanded.
   * - `true` — expand every branch in the tree.
   * - `false` / `undefined` — expand nothing (default).
   */
  defaultExpanded?: readonly TreePath[] | boolean;
}

/**
 * Single-select mode (default). `value` is a {@link TreePath} and
 * `onChange` fires with the selected path or `null` on clear.
 */
interface TreeSelectSingleProps extends TreeSelectBaseProps {
  multiSelect?: false;
  /**
   * Currently selected node path as a {@link TreePath} — an ordered array
   * of raw node names from root to the selected node. No encoding needed.
   */
  value?: TreePath;
  /**
   * Fires when the user selects or clears a node. The path argument is a
   * {@link TreePath} of raw node names, or `null` when cleared.
   */
  onChange?: (path: TreePath | null) => void;
}

/**
 * Multi-select mode. `value` is an array of {@link TreePath} entries and
 * `onChange` fires with the full updated array on every toggle.
 */
interface TreeSelectMultiProps extends TreeSelectBaseProps {
  multiSelect: true;
  /**
   * Currently selected node paths. Each entry is a {@link TreePath} —
   * an ordered array of raw node names. No encoding needed.
   */
  value?: readonly TreePath[];
  /**
   * Fires with the updated array whenever a node is toggled. Each entry
   * is a {@link TreePath} of raw node names.
   */
  onChange?: (paths: TreePath[]) => void;
}

/**
 * Props for {@link TreeSelect}.
 *
 * Discriminated on `multiSelect`:
 * - `multiSelect?: false` (default) — single-select; `value` is `TreePath`, `onChange` fires `TreePath | null`.
 * - `multiSelect: true` — multi-select; `value` is `readonly TreePath[]`, `onChange` fires `TreePath[]`.
 */
export type TreeSelectProps = TreeSelectSingleProps | TreeSelectMultiProps;
