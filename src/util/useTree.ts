import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ResolvedNode } from "@/components/TreeSelect/types";

import {
  collectBranchPaths,
  flattenVisible,
  getParentPath,
} from "@/components/TreeSelect/tree";

function encodeRowId(prefix: string, path: string): string {
  return `${prefix}-${path.replace(/\//g, "-")}`;
}

export interface UseTreeOptions {
  /** Pre-resolved (and optionally pre-filtered) tree. */
  tree: ResolvedNode;
  /**
   * Set of currently selected paths, used for `aria-selected` and `isSelected`.
   * For single-select, pass a Set with one element. For multi-select, pass
   * all selected paths. The hook is mode-agnostic.
   */
  selection?: Set<string>;
  /**
   * Paths that must be treated as expanded regardless of user expansion state
   * (e.g. ancestors of a search match).
   */
  forceOpenPaths?: Set<string>;
  /** Optional id prefix override; defaults to a `useId()` value. */
  idPrefix?: string;
  /** Scroll the active row into view on change. @default true */
  scrollActiveIntoView?: boolean;
  /** Fires on selectable row click and Enter on active selectable row. */
  onSelect?: (path: string) => void;
  /** Fires on Escape key. */
  onEscape?: () => void;
  /**
   * Branches to expand initially. User can still collapse them.
   * `resetExpansion()` restores this set rather than clearing to empty.
   *
   * - `Set<string>` — explicit branch paths.
   * - `true` — expand every branch in `tree`.
   * - `false` / `undefined` — expand nothing.
   */
  defaultExpanded?: Set<string> | boolean;
}

export interface TreeItemProps {
  id: string;
  role: "treeitem";
  "aria-selected": boolean | undefined;
  "aria-expanded": boolean | undefined;
  tabIndex: -1;
  "data-active": true | undefined;
  onClick: () => void;
  onMouseDown: (e: { preventDefault: () => void }) => void;
  onMouseEnter: () => void;
}

export interface TreeGroupProps {
  id: string;
  role: "group";
}

export interface TreeChevronProps {
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-label": string;
  onClick: (e: { stopPropagation: () => void; preventDefault: () => void }) => void;
  onPointerDown: (e: { stopPropagation: () => void; preventDefault: () => void }) => void;
  onPointerUp: (e: { stopPropagation: () => void; preventDefault: () => void }) => void;
}

export interface UseTreeReturn {
  /** Flat list of visible nodes in DOM render order. */
  visibleNodes: ResolvedNode[];

  /** Set of explicitly expanded paths (excludes forceOpenPaths). */
  expandedPaths: Set<string>;
  /** Path of the keyboard-active row, or `null`. */
  activePath: string | null;
  /** DOM id of the active row, for `aria-activedescendant`. */
  activeDescendantId: string | undefined;

  /** Toggle a branch open/closed. */
  toggleExpand: (path: string) => void;
  /** Expand a branch (no-op if already open). */
  expand: (path: string) => void;
  /** Collapse a branch (no-op if already closed). */
  collapse: (path: string) => void;
  /** Clear all user-expanded paths. */
  resetExpansion: () => void;
  /** Set the active (keyboard-highlighted) path. */
  setActivePath: (path: string | null) => void;

  /** Spread onto the outer `<div role="treeitem">` wrapper. */
  getItemProps: (node: ResolvedNode) => TreeItemProps;
  /** Spread onto the `<div role="group">` children wrapper. */
  getGroupProps: (node: ResolvedNode) => TreeGroupProps;
  /** Spread onto the chevron `<button>`. */
  getChevronProps: (node: ResolvedNode) => TreeChevronProps;

  /** `onKeyDown` handler for the element that holds virtual focus (e.g. search input). */
  handleKeyDown: (e: KeyboardEvent) => void;

  /** Get the DOM id for a given path. */
  rowId: (path: string) => string;
  /** Whether a path is effectively open (expanded or force-open). */
  isOpen: (path: string) => boolean;
  /** Whether a path is the keyboard-active row. */
  isActive: (path: string) => boolean;
  /** Whether a node is the selected value. */
  isSelected: (node: ResolvedNode) => boolean;
  /** Whether any descendant of a node is in the current selection. */
  hasSelectedDescendant: (node: ResolvedNode) => boolean;
}

/**
 * Headless hook that manages tree state: expansion, active (keyboard) path,
 * keyboard navigation per WAI-ARIA treeview semantics, ARIA prop generation,
 * and scroll-into-view. Owns no rendering or styling.
 *
 * Designed to be consumed by `TreeSelect` and `TreeSelectNode` but generic
 * enough for any component that renders a tree of `ResolvedNode`s.
 */
export function useTree(options: UseTreeOptions): UseTreeReturn {
  const {
    tree,
    selection,
    forceOpenPaths,
    idPrefix: idPrefixOption,
    scrollActiveIntoView = true,
    onSelect,
    onEscape,
    defaultExpanded,
  } = options;

  const generatedPrefix = useId();
  const idPrefix = idPrefixOption ?? generatedPrefix;

  const seedPaths = useMemo<Set<string>>(() => {
    if (defaultExpanded instanceof Set) return defaultExpanded;
    if (defaultExpanded === true) return collectBranchPaths(tree);
    return new Set();
  }, [defaultExpanded, tree]);

  const seedRef = useRef(seedPaths);
  seedRef.current = seedPaths;

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    () => new Set(seedPaths)
  );
  const [activePath, setActivePath] = useState<string | null>(null);

  const isOpen = useCallback(
    (path: string) =>
      expandedPaths.has(path) || (forceOpenPaths?.has(path) ?? false),
    [expandedPaths, forceOpenPaths]
  );

  const visibleNodes = useMemo(
    () => flattenVisible(tree, isOpen),
    [tree, isOpen]
  );

  const activeDescendantId = activePath
    ? encodeRowId(idPrefix, activePath)
    : undefined;

  // --- Expansion actions ---

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      return next;
    });
  }, []);

  const collapse = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      if (!prev.has(path)) return prev;
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const resetExpansion = useCallback(() => {
    setExpandedPaths(new Set(seedRef.current));
  }, []);

  // --- Scroll active into view ---

  useEffect(() => {
    if (!scrollActiveIntoView || !activePath) return;
    const el = document.getElementById(encodeRowId(idPrefix, activePath));
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activePath, idPrefix, scrollActiveIntoView]);

  // --- Per-node helpers ---

  const rowId = useCallback(
    (path: string) => encodeRowId(idPrefix, path),
    [idPrefix]
  );

  const isActive = useCallback(
    (path: string) => activePath === path,
    [activePath]
  );

  const isSelected = useCallback(
    (node: ResolvedNode) => selection?.has(node.path) ?? false,
    [selection]
  );

  const ancestorsOfSelected = useMemo<Set<string>>(() => {
    if (!selection) return new Set();
    const acc = new Set<string>();
    for (const path of selection) {
      let parent = getParentPath(path);
      while (parent) {
        acc.add(parent);
        parent = getParentPath(parent);
      }
    }
    return acc;
  }, [selection]);

  const hasSelectedDescendant = useCallback(
    (node: ResolvedNode) => ancestorsOfSelected.has(node.path),
    [ancestorsOfSelected]
  );

  // --- Prop getters ---

  const getItemProps = useCallback(
    (node: ResolvedNode): TreeItemProps => {
      const active = activePath === node.path;
      const selected = selection?.has(node.path) ?? false;
      const isBranch = !node.isLeaf;

      return {
        id: encodeRowId(idPrefix, node.path),
        role: "treeitem",
        "aria-selected": node.selectable ? selected : undefined,
        "aria-expanded": isBranch ? isOpen(node.path) : undefined,
        tabIndex: -1,
        "data-active": active || undefined,
        onClick: () => {
          if (node.selectable) {
            onSelect?.(node.path);
          } else if (isBranch) {
            toggleExpand(node.path);
          }
        },
        onMouseDown: (e) => {
          e.preventDefault();
        },
        onMouseEnter: () => {
          setActivePath(node.path);
        },
      };
    },
    [activePath, selection, idPrefix, isOpen, onSelect, toggleExpand]
  );

  const getGroupProps = useCallback(
    (node: ResolvedNode): TreeGroupProps => ({
      id: encodeRowId(idPrefix, node.path) + "-group",
      role: "group",
    }),
    [idPrefix]
  );

  const getChevronProps = useCallback(
    (node: ResolvedNode): TreeChevronProps => {
      const open = isOpen(node.path);
      const groupId = encodeRowId(idPrefix, node.path) + "-group";
      const stop = (e: {
        stopPropagation: () => void;
        preventDefault: () => void;
      }) => {
        e.stopPropagation();
        e.preventDefault();
      };

      return {
        "aria-expanded": open,
        "aria-controls": groupId,
        "aria-label": open
          ? `Collapse ${node.node.name}`
          : `Expand ${node.node.name}`,
        onClick: (e) => {
          stop(e);
          toggleExpand(node.path);
        },
        onPointerDown: stop,
        onPointerUp: stop,
      };
    },
    [idPrefix, isOpen, toggleExpand]
  );

  // --- Keyboard handler ---

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currentIdx = activePath
        ? visibleNodes.findIndex((n) => n.path === activePath)
        : -1;
      const activeNode = currentIdx >= 0 ? visibleNodes[currentIdx] : null;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (currentIdx < visibleNodes.length - 1) {
            setActivePath(visibleNodes[currentIdx + 1].path);
          } else if (currentIdx === -1 && visibleNodes.length > 0) {
            setActivePath(visibleNodes[0].path);
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          if (currentIdx > 0) {
            setActivePath(visibleNodes[currentIdx - 1].path);
          }
          break;
        }

        case "ArrowRight": {
          if (!activeNode || activeNode.isLeaf) break;
          e.preventDefault();
          if (!isOpen(activeNode.path)) {
            toggleExpand(activeNode.path);
          } else if (activeNode.children.length > 0) {
            setActivePath(activeNode.children[0].path);
          }
          break;
        }

        case "ArrowLeft": {
          if (!activeNode) break;
          e.preventDefault();
          if (!activeNode.isLeaf && isOpen(activeNode.path)) {
            toggleExpand(activeNode.path);
          } else {
            const parentPath = getParentPath(activeNode.path);
            if (parentPath) {
              const parentVisible = visibleNodes.some(
                (n) => n.path === parentPath
              );
              if (parentVisible) {
                setActivePath(parentPath);
              }
            }
          }
          break;
        }

        case "Enter": {
          if (!activeNode) break;
          e.preventDefault();
          if (activeNode.selectable) {
            onSelect?.(activeNode.path);
          }
          break;
        }

        case "Escape": {
          e.preventDefault();
          onEscape?.();
          break;
        }
      }
    },
    [activePath, visibleNodes, isOpen, toggleExpand, onSelect, onEscape]
  );

  return {
    visibleNodes,
    expandedPaths,
    activePath,
    activeDescendantId,

    toggleExpand,
    expand,
    collapse,
    resetExpansion,
    setActivePath,

    getItemProps,
    getGroupProps,
    getChevronProps,

    handleKeyDown,

    rowId,
    isOpen,
    isActive,
    isSelected,
    hasSelectedDescendant,
  };
}
