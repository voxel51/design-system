import * as React from "react";

import { cn } from "../../lib/utils";
import { MetaChip } from "../ui/meta-chip";
import { TextBadge } from "../ui/text-badge";

/**
 * Settings shell and its content primitives, so every settings surface reads
 * as one system: a grouped nav rail beside a scrolling page, sections that
 * look alike, and label/hint/control rows that line up.
 *
 * Ported from the Lovable master, which used react-router `NavLink` and
 * `Outlet`. Both are the application's: items report selection through
 * `onSelect` and the content is `children`, so this works under any router or
 * none at all.
 */

export interface SettingsNavItem {
  /** Stable identifier, reported back by `onSelect`. */
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Short marker after the label — "Beta", "New". */
  badge?: string;
  /** Renders muted and non-navigating. */
  disabled?: boolean;
}

export interface SettingsNavGroup {
  label: string;
  items: SettingsNavItem[];
}

export interface SettingsShellProps {
  groups: SettingsNavGroup[];
  /** Id of the active nav item. */
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Rendered above the rail — typically a `WorkspaceHeader`. */
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsShell({
  groups,
  activeId,
  onSelect,
  header,
  children,
}: SettingsShellProps) {
  const rowClass =
    "flex items-center gap-2.5 rounded-md px-3 py-2 text-body transition-colors w-full text-left";

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      {header}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 shrink-0 overflow-y-auto border-r border-border/20 p-3">
          {groups.map((group, gi) => (
            <div key={group.label} className={cn(gi > 0 && "mt-4")}>
              <div className="px-3 py-1.5 text-meta uppercase tracking-wider text-muted-foreground">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.disabled}
                      onClick={() => !item.disabled && onSelect?.(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        rowClass,
                        active
                          ? "bg-card-elevated text-foreground"
                          : "text-muted-foreground hover:bg-card-2 hover:text-foreground",
                        item.disabled && "opacity-60",
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5 text-icon" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && <TextBadge>{item.badge}</TextBadge>}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export interface SettingsPageProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** Wider column for multi-column content — plan comparisons, tables. */
  wide?: boolean;
  children: React.ReactNode;
}

export function SettingsPage({
  title,
  description,
  actions,
  wide,
  children,
}: SettingsPageProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div
        className={cn(
          "mx-auto space-y-8 px-8 py-8",
          wide ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        <header className="flex items-start justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-title font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-body text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}

export interface SettingsSectionProps {
  title: string;
  description?: string;
  /** Right-aligned chip marking who the section applies to. */
  scope?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  scope,
  children,
}: SettingsSectionProps) {
  return (
    <section className="rounded-lg bg-card">
      <header className="flex items-start justify-between gap-4 border-b border-border/20 px-5 py-4">
        <div className="space-y-0.5">
          <h2 className="text-body font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-body-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {scope && <MetaChip className="shrink-0">{scope}</MetaChip>}
      </header>
      <div className="space-y-4 px-5 py-4">{children}</div>
    </section>
  );
}

export interface SettingsRowProps {
  label: string;
  hint?: string;
  control: React.ReactNode;
}

export function SettingsRow({ label, hint, control }: SettingsRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-2">
      <div className="min-w-0 space-y-0.5">
        <div className="text-body text-foreground">{label}</div>
        {hint && <div className="text-body-sm text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
