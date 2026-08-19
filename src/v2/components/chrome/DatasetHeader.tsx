import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Dataset-detail header — breadcrumb, segmented view tabs, and actions.
 *
 * A different surface from `WorkspaceHeader`, not a variant of it. The
 * workspace header answers "which product area am I in" with underline tabs
 * across the top level; this one answers "which dataset, and which view of
 * it" with a breadcrumb and a segmented control. They also differ in height —
 * 56px here against 48px — which is why one component cannot serve both.
 *
 * Ported from the Lovable master's `AppShell` header.
 */

export interface DatasetHeaderTab {
  id: string;
  label: string;
}

export interface DatasetHeaderProps {
  /** Dataset name, the last breadcrumb segment. */
  datasetName: string;
  /** Label for the parent crumb. */
  parentLabel?: string;
  /** Called when the brand mark or parent crumb is clicked. */
  onNavigateUp?: () => void;
  /** View tabs. Hidden when empty — the master hides them in OSS builds. */
  tabs?: DatasetHeaderTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  /**
   * Replaces the built-in tab group. For apps whose tabs are routed links
   * rather than local state — passing real anchors keeps prefetch and
   * middle-click working, which `onTabChange` cannot.
   */
  nav?: React.ReactNode;
  /** Brand mark. Supply the app's own image or icon. */
  brand?: React.ReactNode;
  /** Icon actions and buttons, right-aligned before the user menu. */
  actions?: React.ReactNode;
  user?: React.ReactNode;
  className?: string;
}

export function DatasetHeader({
  datasetName,
  parentLabel = "Datasets",
  onNavigateUp,
  tabs = [],
  activeTabId,
  onTabChange,
  nav,
  brand,
  actions,
  user,
  className,
}: DatasetHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-6 border-b border-border/40 px-5",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2.5">
        {brand && (
          <button
            type="button"
            onClick={onNavigateUp}
            title={`All ${parentLabel.toLowerCase()}`}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            {brand}
          </button>
        )}
        <span className="text-muted-foreground">/</span>
        <button
          type="button"
          onClick={onNavigateUp}
          className="text-subheading text-muted-foreground transition-colors hover:text-foreground"
        >
          {parentLabel}
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-subheading font-medium text-foreground">
          {datasetName}
        </span>
      </div>

      {nav}

      {!nav && tabs.length > 0 && (
        <nav className="flex items-center gap-0.5 rounded bg-card-2 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              aria-current={tab.id === activeTabId ? "page" : undefined}
              className={cn(
                "rounded px-3.5 py-1 text-body-sm transition-colors duration-150",
                tab.id === activeTabId
                  ? "bg-card-elevated text-foreground"
                  : "bg-transparent text-secondary-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        {actions}
        {user}
      </div>
    </header>
  );
}
