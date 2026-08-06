import type { HTMLAttributes, ReactNode } from "react";

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

// ---------------------------------------------------------------------------
// Shared prop mixins
// ---------------------------------------------------------------------------

/**
 * Data-layer props shared by all tree consumers (`TreeSelect` and `TreeView`).
 */
export interface TreeDataProps extends Omit<
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
   * Branches to expand when the component first renders (or when the
   * TreeSelect panel first opens). These paths are user-collapsible and
   * restored on panel re-open (TreeSelect) or component remount (TreeView).
   *
   * - `TreePath[]` — explicit branch paths (each a {@link TreePath} of
   *   raw node names) to start expanded.
   * - `true` — expand every branch in the tree.
   * - `false` / `undefined` — expand nothing (default).
   */
  defaultExpanded?: readonly TreePath[] | boolean;
}

/**
 * UI props specific to TreeSelect (trigger + floating panel).
 */
interface TreeSelectUIProps {
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
}

interface TreeSelectBaseProps extends TreeDataProps, TreeSelectUIProps {}

// ---------------------------------------------------------------------------
// Selection mixins
// ---------------------------------------------------------------------------

interface TreeSingleSelection {
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

interface TreeMultiSelection {
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

// ---------------------------------------------------------------------------
// TreeSelect props
// ---------------------------------------------------------------------------

/**
 * Props for {@link TreeSelect}.
 *
 * Discriminated on `multiSelect`:
 * - `multiSelect?: false` (default) — single-select; `value` is `TreePath`, `onChange` fires `TreePath | null`.
 * - `multiSelect: true` — multi-select; `value` is `readonly TreePath[]`, `onChange` fires `TreePath[]`.
 */
export type TreeSelectProps =
  | (TreeSelectBaseProps & TreeSingleSelection)
  | (TreeSelectBaseProps & TreeMultiSelection);

// ---------------------------------------------------------------------------
// TreeView props
// ---------------------------------------------------------------------------

/**
 * Custom renderer for a row's label content in {@link TreeView}.
 *
 * Receives the source node, its {@link TreePath}, and the default label
 * element (the node name with search-match highlighting applied). The
 * returned content replaces only the name text — chevron, checkbox, and
 * `description` rendering are unaffected. The custom content is wrapped in
 * a flex-1 container, so trailing content (e.g. a count) can be
 * right-aligned with `justify-between`.
 */
export type RenderTreeLabel = (
  node: TreeNode,
  path: TreePath,
  defaultLabel: ReactNode
) => ReactNode;

interface TreeViewSharedProps extends TreeDataProps {
  /**
   * Custom renderer for each row's label content. See
   * {@link RenderTreeLabel}. When omitted, the node name is rendered with
   * search-match highlighting.
   */
  renderLabel?: RenderTreeLabel;
  /** Show the built-in search input. @default true */
  showSearch?: boolean;
  /**
   * Controlled search query. When provided, `onQueryChange` is required
   * and the built-in search input is hidden — the consumer renders their
   * own search UI.
   */
  query?: string;
  /** Required when `query` is controlled. */
  onQueryChange?: (q: string) => void;
  maxHeight?: string;
  className?: string;
}

/**
 * Navigation mode (default). `onChange` fires per leaf click; no value is
 * tracked, no checkboxes, no "selected" highlight. Clicking a branch
 * toggles its expansion.
 */
interface TreeViewNavigateProps extends TreeViewSharedProps {
  selectable?: false;
  multiSelect?: never;
  value?: never;
  /** Fires when the user clicks a selectable node. */
  onChange?: (path: TreePath) => void;
}

/** Single-select mode. */
interface TreeViewSingleSelectProps extends TreeViewSharedProps {
  selectable: true;
  multiSelect?: false;
  value?: TreePath;
  onChange?: (path: TreePath | null) => void;
}

/** Multi-select mode. */
interface TreeViewMultiSelectProps extends TreeViewSharedProps {
  selectable: true;
  multiSelect: true;
  value?: readonly TreePath[];
  onChange?: (paths: TreePath[]) => void;
}

/**
 * Props for {@link TreeView}.
 *
 * Discriminated on `selectable` and `multiSelect`:
 * - `selectable?: false` (default) — navigation mode; `onChange` fires `TreePath` per click, no selection state tracked.
 * - `selectable: true, multiSelect?: false` — single-select; `value` is `TreePath`, `onChange` fires `TreePath | null`.
 * - `selectable: true, multiSelect: true` — multi-select; `value` is `readonly TreePath[]`, `onChange` fires `TreePath[]`.
 */
export type TreeViewProps =
  TreeViewNavigateProps | TreeViewSingleSelectProps | TreeViewMultiSelectProps;
