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

import { buildResolvedTree, filterTreeForQuery, getNodeByPath } from "./tree";
import { TreeSelectPanel } from "./TreeSelectPanel";
import { TreeSelectTrigger } from "./TreeSelectTrigger";
import type { TreeSelectProps } from "./types";

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
 * const [value, setValue] = useState<string | undefined>();
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
  displayValue: displayValueProp,
  defaultExpanded,
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    () => buildResolvedTree(root, { leavesOnly }),
    [root, leavesOnly]
  );

  const filtered = useMemo(
    () =>
      debouncedQuery ? filterTreeForQuery(resolved, debouncedQuery) : null,
    [resolved, debouncedQuery]
  );

  const handleSelect = useCallback(
    (selected: string) => {
      if (multiSelect) {
        const current = (value as string[] | undefined) ?? [];
        const next = current.includes(selected)
          ? current.filter((p) => p !== selected)
          : [...current, selected];
        (onChange as ((paths: string[]) => void) | undefined)?.(next);
      } else {
        setQuery("");
        setIsOpen(false);
        (onChange as ((path: string | null) => void) | undefined)?.(selected);
      }
    },
    [multiSelect, value, onChange]
  );

  const handleEscape = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const selection = useMemo<Set<string> | undefined>(() => {
    if (multiSelect) {
      const arr = value as string[] | undefined;
      return arr?.length ? new Set(arr) : undefined;
    }
    return value ? new Set([value as string]) : undefined;
  }, [multiSelect, value]);

  const tree = useTree({
    tree: filtered?.tree ?? resolved,
    selection,
    forceOpenPaths: filtered?.forceOpenPaths,
    defaultExpanded,
    scrollActiveIntoView: false,
    onSelect: handleSelect,
    onEscape: handleEscape,
  });

  const getDisplayValue = useCallback(
    (v: string | null): string => {
      if (!v) return "";

      const node = getNodeByPath(root, v);
      if (!node) return v;

      if (displayValueProp) {
        return displayValueProp(v, node);
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
      (onChange as ((paths: string[]) => void) | undefined)?.([]);
    } else {
      (onChange as ((path: string | null) => void) | undefined)?.(null);
    }
  }, [multiSelect, onChange]);

  // Focus search input when panel opens; initialize active path
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      const singleValue = multiSelect ? undefined : (value as string | undefined);
      const initial =
        singleValue &&
        tree.visibleNodes.some((n) => n.path === singleValue)
          ? singleValue
          : tree.visibleNodes[0]?.path ?? null;
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

    const handleClickOutside = (e: MouseEvent) => {
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
    ? !!((value as string[] | undefined)?.length)
    : !!value;

  const removeOne = useCallback(
    (pathToRemove: string) => {
      if (!multiSelect) return;
      const current = (value as string[] | undefined) ?? [];
      (onChange as ((paths: string[]) => void) | undefined)?.(
        current.filter((p) => p !== pathToRemove)
      );
    },
    [multiSelect, value, onChange]
  );

  const panelId = tree.rowId("panel");

  return (
    <div ref={refs.setReference} className={cn(className, "w-full")} {...props}>
      <TreeSelectTrigger
        multiSelect={multiSelect}
        value={value}
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
          panelId={panelId}
          query={query}
          onQueryChange={setQuery}
          debouncedQuery={debouncedQuery}
          searchInputRef={searchInputRef}
          tree={tree}
          filteredTree={!!filtered}
          multiSelect={multiSelect}
        />
      )}
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
