import * as React from "react";

import { cn } from "../../lib/utils";
import { UnderlineTab, UnderlineTabs } from "../ui/underline-tabs";
import { VoxelIcon } from "./VoxelIcon";

/**
 * Workspace header — brand mark, product-area tabs, and a right-hand slot.
 * Single source of truth for top-level navigation.
 *
 * Ported from the Lovable master, which hard-coded four tabs, read counts
 * from a mocks module and navigated with react-router. All three are the
 * application's: tabs arrive as data, counts come on the tab, and selection
 * is reported through `onSelect` so any router works.
 */

export interface WorkspaceTab {
  /** Stable identifier, reported back by `onSelect`. */
  id: string;
  label: string;
  /** Optional count shown after the label. */
  count?: number;
}

export interface WorkspaceHeaderProps {
  tabs: WorkspaceTab[];
  /** Id of the active tab. Nothing is active when unset. */
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Product name beside the mark. */
  title?: string;
  /** Replaces the default brand mark and title. */
  brand?: React.ReactNode;
  /** Actions before the user menu — search, notifications. */
  right?: React.ReactNode;
  /** User menu or avatar, pinned to the far right. */
  user?: React.ReactNode;
  className?: string;
}

export function WorkspaceHeader({
  tabs,
  activeId,
  onSelect,
  title = "FiftyOne",
  brand,
  right,
  user,
  className,
}: WorkspaceHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-6 border-b border-border/40 px-5",
        className,
      )}
    >
      {brand ?? (
        <div className="flex shrink-0 items-center gap-2.5">
          <VoxelIcon size={20} />
          <span className="text-body font-medium text-foreground">{title}</span>
        </div>
      )}

      <UnderlineTabs className="h-full gap-1">
        {tabs.map((tab) => (
          <UnderlineTab
            key={tab.id}
            active={tab.id === activeId}
            onClick={() => tab.id !== activeId && onSelect?.(tab.id)}
            className="flex h-full items-center pb-0"
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-body-sm tabular-nums text-icon-subtle">
                {tab.count}
              </span>
            )}
          </UnderlineTab>
        ))}
      </UnderlineTabs>

      <div className="ml-auto flex items-center gap-1.5">
        {right}
        {user}
      </div>
    </header>
  );
}
