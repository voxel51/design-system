import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { type FC, useCallback, useEffect, useState } from "react";

import { SelectAnchor } from "@/components/Select";
import { cn } from "@/util/classes";

import { TreeSelectPanel } from "./TreeSelectPanel";
import { TreeSelectTrigger } from "./TreeSelectTrigger";
import {
  fromInternalPath,
  getNodeByInternalPath,
  toInternalPath,
} from "./tree";
import type { TreePath, TreeSelectProps } from "./types";
import { useTreeViewState } from "./useTreeViewState";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleEscape = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAfterSelect = useCallback(() => {
    if (!multiSelect) {
      setIsOpen(false);
    }
  }, [multiSelect]);

  const state = useTreeViewState({
    root,
    value,
    onChange,
    multiSelect,
    leavesOnly,
    defaultExpanded,
    loadChildren,
    onEscape: handleEscape,
    onAfterSelect: handleAfterSelect,
    scrollActiveIntoView: false,
  });

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

  const getDisplayValue = useCallback(
    (v: string | null): string => {
      if (!v) return "";

      const node = getNodeByInternalPath(root, v);
      if (!node) return v;

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
    state.setQuery("");
    toggleOpen();
  }, [toggleOpen, state]);

  const handleClear = useCallback(() => {
    setIsOpen(false);
    state.clearSelection();
  }, [state]);

  // Focus search input when panel opens; initialize active path
  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => state.searchInputRef.current?.focus());
      const singleValue = multiSelect ? undefined : value;
      const singleInternal = singleValue?.length
        ? toInternalPath(singleValue as TreePath)
        : undefined;
      const initial =
        singleInternal &&
        state.tree.visibleNodes.some((n) => n.path === singleInternal)
          ? singleInternal
          : (state.tree.visibleNodes[0]?.path ?? null);
      state.tree.setActivePath(initial);
    } else {
      state.tree.setActivePath(null);
      state.tree.resetExpansion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on isOpen toggle
  }, [isOpen]);

  // Reset active path when the filtered tree changes
  useEffect(() => {
    if (isOpen && state.debouncedQuery) {
      state.tree.setActivePath(state.tree.visibleNodes[0]?.path ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on query change only
  }, [state.debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent): void => {
      const target = e.target as Node;
      const reference = refs.reference.current as Element | null;
      const floating = refs.floating.current;
      if (reference?.contains(target) || floating?.contains(target)) {
        return;
      }
      setIsOpen(false);
      state.setQuery("");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, refs.reference, refs.floating, state]);

  const hasValue = !!value?.length;

  const removeOne = useCallback(
    (pathToRemove: string) => {
      if (!multiSelect) return;
      const multiOnChange = onChange as
        | ((paths: TreePath[]) => void)
        | undefined;
      const currentValue = value as readonly TreePath[] | undefined;
      const currentInternal = currentValue?.map(toInternalPath) ?? [];
      multiOnChange?.(
        currentInternal
          .filter((p) => p !== pathToRemove)
          .map(fromInternalPath)
      );
    },
    [multiSelect, value, onChange]
  );

  const panelId = state.tree.rowId("panel");

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
          query={state.query}
          onQueryChange={state.setQuery}
          debouncedQuery={state.debouncedQuery}
          searchInputRef={state.searchInputRef}
          tree={state.tree}
          filteredTree={state.filteredTree}
          multiSelect={multiSelect}
          onRetryLoad={state.onRetryLoad}
        />
      )}
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
