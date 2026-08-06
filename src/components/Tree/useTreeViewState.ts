import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebouncedCallback } from "@/util/useDebouncedCallback";

import {
  buildResolvedTree,
  filterTreeForQuery,
  fromInternalPath,
  getNodeByInternalPath,
  toInternalPath,
} from "./tree";
import type { TreeNode, TreePath } from "./types";
import { type UseTreeReturn, useTree } from "./useTree";

export interface UseTreeViewStateOptions {
  root: TreeNode;
  multiSelect?: boolean;
  leavesOnly?: boolean;
  defaultExpanded?: readonly TreePath[] | boolean;
  loadChildren?: (path: TreePath) => Promise<TreeNode[]>;
  value?: TreePath | readonly TreePath[];
  onChange?: ((p: TreePath | null) => void) | ((p: TreePath[]) => void);
  onEscape?: () => void;
  onAfterSelect?: (internalPath: string) => void;
  /**
   * When provided, the hook treats query as controlled and skips
   * internal query state. The consumer must also provide `onQueryChange`.
   */
  query?: string;
  /** Required when `query` is controlled. */
  onQueryChange?: (q: string) => void;
  scrollActiveIntoView?: boolean;
  /**
   * When `true`, single-select picks reset the search query. Correct for
   * TreeSelect, where selecting closes the panel and the query is stale on
   * re-open. Persistent consumers (TreeView) must leave this off: the tree
   * stays on screen, so wiping the filter — and firing `onQueryChange("")`
   * behind a controlled-query consumer's back — discards user state.
   * @default false
   */
  clearQueryOnSelect?: boolean;
}

export interface UseTreeViewStateReturn {
  tree: UseTreeReturn;
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  filteredTree: boolean;
  onRetryLoad: (path: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  clearSelection: () => void;
}

/**
 * **Data layer** — sits above {@link useTree} in the stack.
 *
 * Shared data-layer hook for tree components. Manages:
 * - Search query (internal or controlled) + 200ms debounce
 * - Async `loadChildren` with loading/error state and retry
 * - `buildResolvedTree` / `filterTreeForQuery` memoization
 * - Selection logic (single/multi) with `toInternalPath` encoding
 * - Wiring into {@link useTree} (the UI mechanics layer below)
 *
 * Consumed by both `TreeSelect` and `TreeView`. Each consumer composes
 * its own UI around the returned `tree` and query state. Neither component
 * calls `useTree` directly — they receive its return value via `state.tree`.
 *
 * @internal
 */
export function useTreeViewState(
  options: UseTreeViewStateOptions
): UseTreeViewStateReturn {
  const {
    root,
    multiSelect,
    leavesOnly = false,
    defaultExpanded,
    loadChildren,
    value,
    onChange,
    onEscape,
    onAfterSelect,
    query: controlledQuery,
    onQueryChange: controlledOnQueryChange,
    scrollActiveIntoView = false,
    clearQueryOnSelect = false,
  } = options;

  const isControlledQuery = controlledQuery !== undefined;

  const [internalQuery, setInternalQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const query = isControlledQuery ? controlledQuery : internalQuery;

  const setQuery = useCallback(
    (q: string) => {
      if (isControlledQuery) {
        controlledOnQueryChange?.(q);
      } else {
        setInternalQuery(q);
      }
    },
    [isControlledQuery, controlledOnQueryChange]
  );

  // --- Async children loading ---

  const [loadedChildren, setLoadedChildren] = useState(
    () => new Map<string, TreeNode[]>()
  );
  const [loadState, setLoadState] = useState(
    () => new Map<string, "loading" | "error">()
  );

  useEffect(() => {
    setLoadedChildren(new Map());
    setLoadState(new Map());
  }, [root]);

  // --- Debounce ---

  const debouncedSetQuery = useDebouncedCallback(setDebouncedQuery, 200);

  useEffect(() => {
    if (!query) {
      debouncedSetQuery.cancel();
      setDebouncedQuery("");
      return;
    }
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  // --- Resolved + filtered trees ---

  const resolved = useMemo(
    () => buildResolvedTree(root, { leavesOnly }, loadedChildren),
    [root, leavesOnly, loadedChildren]
  );

  const filtered = useMemo(
    () =>
      debouncedQuery ? filterTreeForQuery(resolved, debouncedQuery) : null,
    [resolved, debouncedQuery]
  );

  // --- Selection ---

  const selection = useMemo<Set<string> | undefined>(() => {
    if (multiSelect) {
      const paths = value as readonly TreePath[] | undefined;
      return paths?.length
        ? new Set(paths.map((p) => toInternalPath(p)))
        : undefined;
    }
    const path = value as TreePath | undefined;
    return path?.length ? new Set([toInternalPath(path)]) : undefined;
  }, [multiSelect, value]);

  const handleSelect = useCallback(
    (selected: string) => {
      if (multiSelect) {
        const multiOnChange = onChange as
          ((paths: TreePath[]) => void) | undefined;
        const currentInternal = selection ? [...selection] : [];
        const next = currentInternal.includes(selected)
          ? currentInternal.filter((p) => p !== selected)
          : [...currentInternal, selected];
        multiOnChange?.(next.map(fromInternalPath));
      } else {
        if (clearQueryOnSelect) {
          setQuery("");
        }
        const singleOnChange = onChange as
          ((path: TreePath | null) => void) | undefined;
        singleOnChange?.(fromInternalPath(selected));
      }
      onAfterSelect?.(selected);
    },
    [
      multiSelect,
      selection,
      onChange,
      onAfterSelect,
      setQuery,
      clearQueryOnSelect,
    ]
  );

  const clearSelection = useCallback(() => {
    setQuery("");
    if (multiSelect) {
      const multiOnChange = onChange as
        ((paths: TreePath[]) => void) | undefined;
      multiOnChange?.([]);
    } else {
      const singleOnChange = onChange as
        ((path: TreePath | null) => void) | undefined;
      singleOnChange?.(null);
    }
  }, [multiSelect, onChange, setQuery]);

  // --- Async children handlers ---

  const fetchChildren = useCallback(
    (path: string) => {
      setLoadState((prev) => new Map(prev).set(path, "loading"));
      loadChildren!(fromInternalPath(path)).then(
        (children) => {
          setLoadedChildren((prev) => new Map(prev).set(path, children));
          setLoadState((prev) => {
            const next = new Map(prev);
            next.delete(path);
            return next;
          });
        },
        () => {
          setLoadState((prev) => new Map(prev).set(path, "error"));
        }
      );
    },
    [loadChildren]
  );

  const handleExpand = useCallback(
    (path: string) => {
      if (!loadChildren) return;
      if (loadedChildren.has(path)) return;
      if (loadState.get(path) === "loading") return;
      const sourceNode = getNodeByInternalPath(root, path);
      if (
        !sourceNode ||
        !Array.isArray(sourceNode.values) ||
        sourceNode.values.length > 0
      )
        return;
      fetchChildren(path);
    },
    [fetchChildren, loadChildren, loadedChildren, loadState, root]
  );

  const handleRetryLoad = useCallback(
    (path: string) => {
      setLoadState((prev) => {
        const next = new Map(prev);
        next.delete(path);
        return next;
      });
      if (!loadChildren) return;
      const sourceNode = getNodeByInternalPath(root, path);
      if (
        !sourceNode ||
        !Array.isArray(sourceNode.values) ||
        sourceNode.values.length > 0
      )
        return;
      fetchChildren(path);
    },
    [fetchChildren, loadChildren, root]
  );

  // --- Default expansion ---

  const internalDefaultExpanded = useMemo<Set<string> | boolean>(() => {
    if (typeof defaultExpanded === "boolean" || defaultExpanded === undefined) {
      return defaultExpanded ?? false;
    }
    return new Set(defaultExpanded.map((p) => toInternalPath(p)));
  }, [defaultExpanded]);

  // --- useTree ---

  const tree = useTree({
    tree: filtered?.tree ?? resolved,
    selection,
    forceOpenPaths: filtered?.forceOpenPaths,
    defaultExpanded: internalDefaultExpanded,
    scrollActiveIntoView,
    onSelect: handleSelect,
    onEscape,
    onExpand: handleExpand,
    loadState,
  });

  return {
    tree,
    query,
    setQuery,
    debouncedQuery,
    filteredTree: !!filtered,
    onRetryLoad: handleRetryLoad,
    searchInputRef,
    clearSelection,
  };
}
