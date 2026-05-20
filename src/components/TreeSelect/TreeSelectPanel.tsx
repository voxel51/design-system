import { type CSSProperties, type FC, type ReactNode, type RefObject } from "react";

import { FloatingPortal } from "@floating-ui/react";

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
import type { ResolvedNode } from "./types";

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
  resolvedTree: ResolvedNode;
  filteredTree: ResolvedNode | null;
  multiple?: boolean;
}

/**
 * Floating panel for TreeSelect. Renders the dropdown shell containing
 * the search input and the tree body (or "No matches found").
 *
 * @internal For use by TreeSelect.
 */
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
  resolvedTree,
  filteredTree,
  multiple,
}) => {
  const displayTree = filteredTree ?? resolvedTree;

  return (
    <PortalWrapper portal={portal}>
      <div
        ref={floatingRef}
        id={panelId}
        role="tree"
        aria-label="Tree selection"
        style={floatingStyles}
        className={cn(
          "max-h-72 overflow-y-auto scroll-pt-12",
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

        <div className="p-1.5 pt-0">
          {debouncedQuery && !filteredTree ? (
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
            displayTree.children.map((child) => (
              <TreeSelectNode
                key={child.path}
                resolved={child}
                tree={tree}
                query={filteredTree ? query : undefined}
                multiple={multiple}
              />
            ))
          )}
        </div>
      </div>
    </PortalWrapper>
  );
};

TreeSelectPanel.displayName = "TreeSelectPanel";
