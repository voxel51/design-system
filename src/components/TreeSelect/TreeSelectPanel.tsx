import {
  type CSSProperties,
  type FC,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react";

import { FloatingPortal } from "@floating-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Justify,
  Radius,
  Shadow,
  TextColor,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";
import type { UseTreeReturn } from "@/util/useTree";

import { TreeSelectNode } from "./TreeSelectNode";
import { TreeSelectSearchInput } from "./TreeSelectSearchInput";

function getZIndexClass(zIndex?: ZIndex, portal?: boolean): string | undefined {
  if (zIndex) {
    return zIndexStyles(zIndex);
  }
  if (portal) {
    return zIndexStyles(ZIndex.AboveModal);
  }
  return undefined;
}

function PortalWrapper({
  portal,
  children,
}: {
  portal?: boolean;
  children: ReactNode;
}) {
  if (portal) {
    return <FloatingPortal>{children}</FloatingPortal>;
  }
  return <>{children}</>;
}

export interface TreeSelectPanelProps {
  floatingRef: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  portal?: boolean;
  zIndex?: ZIndex;
  panelId: string;
  query: string;
  onQueryChange: (q: string) => void;
  debouncedQuery: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  tree: UseTreeReturn;
  filteredTree: boolean;
  multiSelect?: boolean;
}

/**
 * Floating panel for TreeSelect. Renders the dropdown shell containing
 * the search input and the tree body (or "No matches found").
 *
 * The search input sits outside the scroll container so the virtualizer's
 * coordinate system aligns with the scrollable area without needing
 * scrollMargin adjustments.
 *
 * @internal For use by TreeSelect.
 */
const ROW_HEIGHT_ESTIMATE = 36;
const VIRTUALIZER_OVERSCAN = 8;

export const TreeSelectPanel: FC<TreeSelectPanelProps> = ({
  floatingRef,
  floatingStyles,
  portal,
  zIndex,
  panelId,
  query,
  onQueryChange,
  debouncedQuery,
  searchInputRef,
  tree,
  filteredTree,
  multiSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tree.visibleNodes.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE,
    overscan: VIRTUALIZER_OVERSCAN,
  });

  useEffect(() => {
    if (!tree.activePath) return;
    const idx = tree.visibleNodes.findIndex((n) => n.path === tree.activePath);
    if (idx >= 0) {
      rowVirtualizer.scrollToIndex(idx, { align: "auto" });
    }
  }, [tree.activePath, tree.visibleNodes, rowVirtualizer]);

  const noMatches = debouncedQuery && !filteredTree;

  return (
    <PortalWrapper portal={portal}>
      <div
        ref={floatingRef}
        id={panelId}
        role="tree"
        aria-label="Tree selection"
        style={floatingStyles}
        className={cn(
          "max-h-72 flex flex-col overflow-hidden",
          "border",
          borderColorClass(BorderColor.Default),
          bgColorClass(BackgroundColor.Card1),
          getZIndexClass(zIndex, portal),
          radiusStyles(Radius.Lg),
          shadowStyles(Shadow.Lg),
          "focus:outline-none"
        )}
      >
        <TreeSelectSearchInput
          value={query}
          onChange={onQueryChange}
          onKeyDown={tree.handleKeyDown}
          inputRef={searchInputRef}
          activeDescendantId={tree.activeDescendantId}
        />

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto"
        >
          <div className="p-1.5 pt-0">
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
                        right: 0,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <TreeSelectNode
                        resolved={node}
                        tree={tree}
                        query={filteredTree ? query : undefined}
                        multiSelect={multiSelect}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalWrapper>
  );
};

TreeSelectPanel.displayName = "TreeSelectPanel";
