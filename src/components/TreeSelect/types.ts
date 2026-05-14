import type { HTMLAttributes } from "react";

import type { ZIndex } from "@/types";

import type { SelectAnchor } from "@/components/Select";

/**
 * A node within a taxonomy tree.
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
}

/**
 * Props for {@link TreeSelect}.
 *
 * Phase 1 exposes single-select only. Multi-select props (`multiple`,
 * array-typed `value` / `onChange`) are added in Phase 3.
 */
export interface TreeSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The root node of the taxonomy tree. */
  root: TreeNode;
  /**
   * Currently selected node path (slash-delimited).
   * Pass `undefined` for no selection.
   */
  value?: string;
  /** Fires when the user selects or deselects a node. */
  onChange?: (path: string | null) => void;
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
   * When omitted, the full breadcrumb path is shown (e.g. `car / Honda / Civic`).
   */
  displayValue?: (path: string, node: TreeNode) => string;
}
