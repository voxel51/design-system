import { useVirtualizer } from "@tanstack/react-virtual";
import { type FC, type RefObject, useCallback, useEffect, useRef } from "react";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { Justify, TextColor, TextVariant } from "@/types";
import { cn } from "@/util/classes";

import { TreeItem } from "./TreeItem";
import { TreeSearchInput } from "./TreeSearchInput";
import type { UseTreeReturn } from "./useTree";

const ROW_HEIGHT_ESTIMATE = 36;
const VIRTUALIZER_OVERSCAN = 8;

export interface TreeBodyProps {
  tree: UseTreeReturn;
  query: string;
  onQueryChange: (q: string) => void;
  debouncedQuery: string;
  filteredTree: boolean;
  multiSelect?: boolean;
  onRetryLoad?: (path: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  /** When false, the search input is hidden and the wrapper becomes the keyboard focus target. */
  showSearch?: boolean;
  className?: string;
}

/**
 * Shared tree rendering body: virtualizer + optional search input + empty state.
 *
 * Owns no chrome (border, shadow, z-index, portal). The parent
 * (`TreeSelectPanel` or `TreeView`) provides that.
 *
 * @internal Shared by TreeSelectPanel and TreeView.
 */
export const TreeBody: FC<TreeBodyProps> = ({
  tree,
  query,
  onQueryChange,
  debouncedQuery,
  filteredTree,
  multiSelect,
  onRetryLoad,
  searchInputRef,
  showSearch = true,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tree.visibleNodes.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: VIRTUALIZER_OVERSCAN,
    getItemKey: (index) => tree.visibleNodes[index].path,
  });

  useEffect(() => {
    if (!tree.activePath) return;
    const idx = tree.visibleNodes.findIndex((n) => n.path === tree.activePath);
    if (idx >= 0) {
      rowVirtualizer.scrollToIndex(idx, { align: "auto" });
    }
  }, [tree.activePath, tree.visibleNodes, rowVirtualizer]);

  const noMatches = debouncedQuery && !filteredTree;

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (showSearch) {
      searchInputRef.current?.focus({ preventScroll: true });
    } else {
      wrapperRef.current?.focus({ preventScroll: true });
    }
  }, [showSearch, searchInputRef]);

  return (
    <div
      ref={wrapperRef}
      className={cn("flex flex-col overflow-hidden outline-none", className)}
      onMouseEnter={handleMouseEnter}
      {...(!showSearch && {
        tabIndex: 0,
        onKeyDown: tree.handleKeyDown,
        "aria-activedescendant": tree.activeDescendantId,
      })}
    >
      {showSearch && (
        <TreeSearchInput
          value={query}
          onChange={onQueryChange}
          onKeyDown={tree.handleKeyDown}
          inputRef={searchInputRef}
          activeDescendantId={tree.activeDescendantId}
        />
      )}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto">
        <div className={cn("p-1.5", showSearch && "pt-0")}>
          {noMatches ? (
            <Stack justify={Justify.Center}>
              <Text
                variant={TextVariant.Sm}
                color={TextColor.Tertiary}
                className="px-3 py-2"
              >
                No matches found
              </Text>
            </Stack>
          ) : (
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                minWidth: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const node = tree.visibleNodes[virtualRow.index];
                return (
                  <div
                    key={node.path}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      minWidth: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TreeItem
                      resolved={node}
                      tree={tree}
                      query={filteredTree ? query : undefined}
                      multiSelect={multiSelect}
                      onRetryLoad={onRetryLoad}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TreeBody.displayName = "TreeBody";
