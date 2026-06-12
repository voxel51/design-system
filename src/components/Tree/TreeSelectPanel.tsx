import { FloatingPortal } from "@floating-ui/react";
import {
  type CSSProperties,
  type FC,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Shadow,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";
import type { UseTreeReturn } from "@/util/useTree";

import { TreeBody } from "./TreeBody";

function getZIndexClass(zIndex?: ZIndex, portal?: boolean): string {
  if (portal) {
    return zIndexStyles(ZIndex.AboveModal);
  }
  if (zIndex) {
    return zIndexStyles(zIndex);
  }
  return zIndexStyles(ZIndex.High);
}

function PortalWrapper({
  portal,
  children,
}: {
  portal?: boolean;
  children: ReactNode;
}): ReactElement {
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
  onRetryLoad?: (path: string) => void;
  panelMaxHeight?: string;
}

/**
 * Floating panel for TreeSelect. Provides the dropdown shell (border,
 * shadow, z-index, portal, max-height) and delegates the tree body
 * rendering to {@link TreeBody}.
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
  filteredTree,
  multiSelect,
  onRetryLoad,
  panelMaxHeight,
}) => {
  return (
    <PortalWrapper portal={portal}>
      <div
        ref={floatingRef}
        id={panelId}
        role="tree"
        aria-label="Tree selection"
        style={{ ...floatingStyles, maxHeight: panelMaxHeight ?? "18rem" }}
        className={cn(
          "flex flex-col overflow-hidden",
          "border",
          borderColorClass(BorderColor.Default),
          bgColorClass(BackgroundColor.Card1),
          getZIndexClass(zIndex, portal),
          radiusStyles(Radius.Lg),
          shadowStyles(Shadow.Lg),
          "focus:outline-none"
        )}
      >
        <TreeBody
          tree={tree}
          query={query}
          onQueryChange={onQueryChange}
          debouncedQuery={debouncedQuery}
          filteredTree={filteredTree}
          multiSelect={multiSelect}
          onRetryLoad={onRetryLoad}
          searchInputRef={searchInputRef}
          showSearch
        />
      </div>
    </PortalWrapper>
  );
};

TreeSelectPanel.displayName = "TreeSelectPanel";
