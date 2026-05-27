import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { SelectAnchor } from "@/components/Select";
import { cn } from "@/util/classes";
import { useDebouncedCallback } from "@/util/useDebouncedCallback";
import { useTree } from "@/util/useTree";

import { TreeSelectPanel } from "./TreeSelectPanel";
import { TreeSelectTrigger } from "./TreeSelectTrigger";
import {
  buildResolvedTree,
  filterTreeForQuery,
  fromInternalPath,
  getNodeByInternalPath,
  toInternalPath,
} from "./tree";
import type { TreeNode, TreePath, TreeSelectProps } from "./types";

const ANCHOR_TO_PLACEMENT: Record<SelectAnchor, Placement> = {
  [SelectAnchor.Bottom]: "bottom",
  [SelectAnchor.BottomStart]: "bottom-start",
  [SelectAnchor.BottomEnd]: "bottom-end",
  [SelectAnchor.Top]: "top",
  [SelectAnchor.TopStart]: "top-start",
  [SelectAnchor.TopEnd]: "top-end",
};

/**
 * A tree-shaped selection control that renders nodes in a
 * searchable dropdown panel styled to match {@link Select}.
 *
 * Supports single-select with full keyboard navigation (ARIA treeview pattern).
 *
 * Paths are represented as {@link TreePath} — ordered arrays of raw node
 * names. No encoding is needed, even when names contain `/` or `%`.
 *
 * @example
 * ```tsx
 * const tree: TreeNode = {
 *   name: "vehicle_type",
 *   values: [
 *     { name: "car", values: [{ name: "Honda" }, { name: "Toyota" }] },
 *     { name: "motorcycle" },
 *   ],
 * };
 *
 * const [value, setValue] = useState<TreePath | undefined>();
 *
 * <TreeSelect
 *   root={tree}
 *   value={value}
 *   onChange={(path) => setValue(path ?? undefined)}
 *   placeholder="Select a vehicle…"
 * />
 * ```
 */
export const TreeSelect: FC<TreeSelectProps> = ({
  root,
  value,
  onChange,
  multiSelect,
  leavesOnly = false,
  disabled,
  placeholder,
  anchor = SelectAnchor.BottomStart,
  portal,
  zIndex,
  panelMaxHeight,
  displayValue: displayValueProp,
  defaultExpanded,
  loadChildren,
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [loadedChildren, setLoadedChildren] = useState(
    () => new Map<string, TreeNode[]>()
  );
  const [loadState, setLoadState] = useState(
    () => new Map<string, "loading" | "error">()
  );

  // Reset the async cache whenever the root node reference changes.
  useEffect(() => {
    setLoadedChildren(new Map());
    setLoadState(new Map());
  }, [root]);

  const { refs, floatingStyles } = useFloating({
    placement: ANCHOR_TO_PLACEMENT[anchor],
    open: isOpen,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const debouncedSetQuery = useDebouncedCallback(setDebouncedQuery, 200);

  useEffect(() => {
    if (!query) {
      debouncedSetQuery.cancel();
      setDebouncedQuery("");
      return;
    }
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  const resolved = useMemo(
    () => buildResolvedTree(root, { leavesOnly }, loadedChildren),
    [root, leavesOnly, loadedChildren]
  );

  const filtered = useMemo(
    () =>
      debouncedQuery ? filterTreeForQuery(resolved, debouncedQuery) : null,
    [resolved, debouncedQuery]
  );

  const selection = useMemo<Set<string> | undefined>(() => {
    if (multiSelect) {
      const arr = value as readonly TreePath[] | undefined;
      return arr?.length
        ? new Set(arr.map((p) => toInternalPath(p)))
        : undefined;
    }
    const singleValue = value as TreePath | undefined;
    return singleValue?.length
      ? new Set([toInternalPath(singleValue)])
      : undefined;
  }, [multiSelect, value]);

  const handleSelect = useCallback(
    (selected: string) => {
      if (multiSelect) {
        const multiOnChange = onChange as
          | ((paths: TreePath[]) => void)
          | undefined;
        const currentInternal = selection
          ? [...selection]
          : [];
        const next = currentInternal.includes(selected)
          ? currentInternal.filter((p) => p !== selected)
          : [...currentInternal, selected];
        multiOnChange?.(next.map(fromInternalPath));
      } else {
        // Single-select: close the panel and clear search on pick.
        setQuery("");
        setIsOpen(false);
        const singleOnChange = onChange as
          | ((path: TreePath | null) => void)
          | undefined;
        singleOnChange?.(fromInternalPath(selected));
      }
    },
    [multiSelect, selection, onChange]
  );

  const handleEscape = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

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
      if (!loadChildren) return; // no async loader wired up; expand is purely visual
      if (loadedChildren.has(path)) return; // children already fetched; nothing to do
      if (loadState.get(path) === "loading") return; // fetch already in flight
      const sourceNode = getNodeByInternalPath(root, path);
      if (
        !sourceNode ||
        !Array.isArray(sourceNode.values) ||
        sourceNode.values.length > 0 // only lazy branches (values: []) need fetching
      )
        return;
      fetchChildren(path);
    },
    [fetchChildren, loadChildren, loadedChildren, loadState, root]
  );

  const handleRetryLoad = useCallback(
    (path: string) => {
      // Clear error state immediately so the node stops showing retry UI,
      // regardless of whether the re-fetch succeeds.
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

  const internalDefaultExpanded = useMemo<Set<string> | boolean>(() => {
    if (typeof defaultExpanded === "boolean" || defaultExpanded === undefined) {
      return defaultExpanded ?? false;
    }
    return new Set(defaultExpanded.map((p) => toInternalPath(p)));
  }, [defaultExpanded]);

  const tree = useTree({
    tree: filtered?.tree ?? resolved,
    selection,
    forceOpenPaths: filtered?.forceOpenPaths,
    defaultExpanded: internalDefaultExpanded,
    scrollActiveIntoView: false,
    onSelect: handleSelect,
    onEscape: handleEscape,
    onExpand: handleExpand,
    loadState,
  });

  const getDisplayValue = useCallback(
    (v: string | null): string => {
      if (!v) return "";

      const node = getNodeByInternalPath(root, v);
      if (!node) return v; // path not found in tree (e.g. stale value); fall back to raw path string

      if (displayValueProp) {
        return displayValueProp(fromInternalPath(v), node);
      }

      return node.name;
    },
    [root, displayValueProp]
  );

  const toggleOpen = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleToggle = useCallback(() => {
    setQuery("");
    toggleOpen();
  }, [toggleOpen]);

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    if (multiSelect) {
      const multiOnChange = onChange as
        | ((paths: TreePath[]) => void)
        | undefined;
      multiOnChange?.([]);
    } else {
      const singleOnChange = onChange as
        | ((path: TreePath | null) => void)
        | undefined;
      singleOnChange?.(null);
    }
  }, [multiSelect, onChange]);

  // Focus search input when panel opens; initialize active path
  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
      const singleValue = multiSelect
        ? undefined
        : (value as TreePath | undefined);
      const singleInternal = singleValue?.length
        ? toInternalPath(singleValue)
        : undefined;
      const initial =
        singleInternal &&
        tree.visibleNodes.some((n) => n.path === singleInternal)
          ? singleInternal
          : (tree.visibleNodes[0]?.path ?? null);
      tree.setActivePath(initial);
    } else {
      tree.setActivePath(null);
      tree.resetExpansion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on isOpen toggle
  }, [isOpen]);

  // Reset active path when the filtered tree changes
  useEffect(() => {
    if (isOpen && debouncedQuery) {
      tree.setActivePath(tree.visibleNodes[0]?.path ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on query change only
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as Node;
      const reference = refs.reference.current as HTMLElement | null;
      const floating = refs.floating.current;
      if (reference?.contains(target) || floating?.contains(target)) {
        return;
      }
      setIsOpen(false);
      setQuery("");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, refs.reference, refs.floating]);

  const hasValue = multiSelect
    ? !!(value as readonly TreePath[] | undefined)?.length
    : !!(value as TreePath | undefined)?.length;

  const removeOne = useCallback(
    (pathToRemove: string) => {
      if (!multiSelect) return; // should never be called in single-select, but guard defensively
      const multiOnChange = onChange as
        | ((paths: TreePath[]) => void)
        | undefined;
      const currentInternal = selection ? [...selection] : [];
      multiOnChange?.(
        currentInternal
          .filter((p) => p !== pathToRemove)
          .map(fromInternalPath)
      );
    },
    [multiSelect, selection, onChange]
  );

  const panelId = tree.rowId("panel");

  return (
    <div ref={refs.setReference} className={cn(className, "w-full")} {...props}>
      <TreeSelectTrigger
        multiSelect={multiSelect}
        value={
          multiSelect
            ? (value as readonly TreePath[] | undefined)?.map(toInternalPath)
            : (value as TreePath | undefined)?.length
              ? toInternalPath(value as TreePath)
              : undefined
        }
        disabled={disabled}
        placeholder={placeholder}
        isOpen={isOpen}
        panelId={panelId}
        hasValue={hasValue}
        getDisplayValue={getDisplayValue}
        onToggle={handleToggle}
        onClear={handleClear}
        onRemoveOne={removeOne}
      />

      {isOpen && (
        <TreeSelectPanel
          floatingRef={refs.setFloating}
          floatingStyles={floatingStyles}
          portal={portal}
          zIndex={zIndex}
          panelMaxHeight={panelMaxHeight}
          panelId={panelId}
          query={query}
          onQueryChange={setQuery}
          debouncedQuery={debouncedQuery}
          searchInputRef={searchInputRef}
          tree={tree}
          filteredTree={!!filtered}
          multiSelect={multiSelect}
          onRetryLoad={handleRetryLoad}
        />
      )}
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
