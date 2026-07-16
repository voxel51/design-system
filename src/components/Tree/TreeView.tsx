import { type FC, useCallback } from "react";

import { BackgroundColor, bgColorClass } from "@/types";
import { cn } from "@/util/classes";

import { TreeBody } from "./TreeBody";
import { fromInternalPath } from "./tree";
import type { TreePath, TreeViewProps } from "./types";
import { useTreeViewState } from "./useTreeViewState";

/**
 * A tree-shaped navigation or selection component. Drop it into a sidebar,
 * panel, or inline layout.
 *
 * Supports three modes via the `selectable` prop:
 * - **Navigate (default)**: clicking a leaf fires `onChange` with the
 *   path; clicking a branch toggles expansion. No selection state is
 *   tracked, no checkboxes, no "selected" highlight.
 * - **Single-select** (`selectable={true}`): same as TreeSelect's
 *   single-select but always visible.
 * - **Multi-select** (`selectable={true} multiSelect={true}`): same as
 *   TreeSelect's multi-select but always visible.
 *
 * @example
 * ```tsx
 * <TreeView root={tree} onChange={(path) => navigate(path)} />
 * ```
 *
 * @example
 * ```tsx
 * <TreeView
 *   root={tree}
 *   selectable
 *   value={selected}
 *   onChange={(path) => setSelected(path ?? undefined)}
 * />
 * ```
 */
export const TreeView: FC<TreeViewProps> = (props) => {
  const {
    root,
    leavesOnly: leavesOnlyProp,
    defaultExpanded,
    loadChildren,
    showSearch: showSearchProp,
    query: queryProp,
    onQueryChange: onQueryChangeProp,
    renderLabel,
    maxHeight,
    className,
    ...rest
  } = props;

  const isSelectable = props.selectable === true;
  const isMulti = isSelectable && props.multiSelect === true;

  const handleNavigate = useCallback(
    (internalPath: string) => {
      if (isSelectable) return;
      const onChange = props.onChange as ((p: TreePath) => void) | undefined;
      onChange?.(fromInternalPath(internalPath));
    },
    [isSelectable, props.onChange]
  );

  const state = useTreeViewState({
    root,
    value: isSelectable ? props.value : undefined,
    onChange: isSelectable
      ? (props.onChange as
          | ((p: TreePath | null) => void)
          | ((p: TreePath[]) => void)
          | undefined)
      : undefined,
    multiSelect: isMulti,
    leavesOnly: isSelectable ? (leavesOnlyProp ?? false) : true,
    defaultExpanded,
    loadChildren,
    query: queryProp,
    onQueryChange: onQueryChangeProp,
    onAfterSelect: !isSelectable ? handleNavigate : undefined,
    scrollActiveIntoView: true,
  });

  const effectiveShowSearch =
    queryProp !== undefined ? false : (showSearchProp ?? true);

  // Strip out props that are specific to the three mode variants so they
  // don't leak onto the DOM wrapper via `rest`.
  const {
    selectable: _selectable,
    multiSelect: _multiSelect,
    value: _value,
    onChange: _onChange,
    ...domProps
  } = rest as Record<string, unknown>;

  return (
    <div
      role="tree"
      aria-label="Tree view"
      style={{ maxHeight: maxHeight ?? "100%" }}
      className={cn(
        "flex flex-col overflow-hidden",
        bgColorClass(BackgroundColor.Card1),
        className
      )}
      {...domProps}
    >
      <TreeBody
        tree={state.tree}
        query={state.query}
        onQueryChange={state.setQuery}
        debouncedQuery={state.debouncedQuery}
        filteredTree={state.filteredTree}
        multiSelect={isMulti}
        onRetryLoad={state.onRetryLoad}
        searchInputRef={state.searchInputRef}
        showSearch={effectiveShowSearch}
        renderLabel={renderLabel}
      />
    </div>
  );
};

TreeView.displayName = "TreeView";
