import type { HTMLAttributes } from "react";

import type { ZIndex } from "@/types";

import type { SelectAnchor } from "@/components/Select";

/**
 * A node within a tree.
 *
 * `values` has three meaningful states:
 * - `TreeNode[]` (non-empty) — branch with known children.
 * - `[]` — explicit leaf (rare; usually omit the field entirely).
 * - `undefined` — unknown / not yet loaded. In the current version this
 *   renders identically to a leaf. A future `loadChildren` prop will treat
 *   this as a lazy-loadable branch.
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
  /** `true` when the node has no children (or only empty `values`). */
  isLeaf: boolean;
  /** Pre-resolved children, in source order. Empty array for leaves. */
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
   * Custom formatter for the trigger display text when a value is selected.
   * Receives the selected path and the corresponding {@link TreeNode}.
   * When omitted, the node name is shown (e.g. `"Civic"`).
   */
  displayValue?: (path: string, node: TreeNode) => string;
  /**
   * Branches to expand when the panel first opens. Unlike `forceOpenPaths`
   * (which prevents collapsing), these paths are user-collapsible and
   * restored on panel re-open.
   *
   * - `Set<string>` — explicit branch paths to start expanded.
   * - `true` — expand every branch in the tree.
   * - `false` / `undefined` — expand nothing (default).
   */
  defaultExpanded?: Set<string> | boolean;
}

/**
 * Single-select mode (default). `value` is a single path string and
 * `onChange` fires with the selected path or `null` on clear.
 */
interface TreeSelectSingleProps extends TreeSelectBaseProps {
  multiple?: false;
  /** Currently selected node path (slash-delimited). */
  value?: string;
  /** Fires when the user selects or clears a node. */
  onChange?: (path: string | null) => void;
}

/**
 * Multi-select mode. `value` is an array of selected path strings and
 * `onChange` fires with the full updated array on every toggle.
 */
interface TreeSelectMultiProps extends TreeSelectBaseProps {
  multiple: true;
  /** Currently selected node paths (slash-delimited). */
  value?: string[];
  /** Fires with the updated array whenever a node is toggled. */
  onChange?: (paths: string[]) => void;
}

/**
 * Props for {@link TreeSelect}.
 *
 * Discriminated on `multiple`:
 * - `multiple?: false` (default) — single-select; `value` is `string`, `onChange` fires `string | null`.
 * - `multiple: true` — multi-select; `value` is `string[]`, `onChange` fires `string[]`.
 */
export type TreeSelectProps = TreeSelectSingleProps | TreeSelectMultiProps;
