import { ReactNode, useEffect } from "react";
import clsx from "clsx";

import { Button, Icon, IconName, Size, Text, TextColor, TextVariant, Variant } from "@/index";

/**
 * Components voodo 1.0 does not provide, hand-rolled here so the v1 page
 * examples can exist at all.
 *
 * This file is the measurement, not a proposal. Each export below is
 * something a product engineer building these three pages against voodo 1.0
 * has to write themselves — which is what actually happens in fiftyone-teams,
 * where the equivalents are spread across `teams-components`, MUI imports and
 * per-page one-offs rather than collected in one place.
 *
 * Every one of these exists in v2 as a real component with a story.
 *
 * | Hand-rolled here | v2 equivalent |
 * |---|---|
 * | `Modal`         | `Dialog` / `Sheet` / `AppModal` |
 * | `Switch`        | `Switch` |
 * | `Progress`      | `Progress` |
 * | `Sparkline`     | `Chart` |
 * | `Avatar`        | `Avatar` / `UserBadge` |
 * | `Tabs`          | `Tabs` / `UnderlineTabs` |
 * | `StatusDot`     | `StatusPill` |
 * | `IconButton`    | `IconAction` |
 * | `AppShell`      | `WorkspaceHeader` + `SettingsShell` |
 * | `Section`       | `SettingsSection` / `SettingsRow` |
 *
 * Styling uses voodo's token classes where they exist. Several do not have a
 * v1 equivalent — there is no elevated-surface hover token, no tooltip
 * surface, no status-chip background — so those fall back to arbitrary
 * values, which is precisely the drift the token system is supposed to
 * prevent.
 */

/** No modal, dialog or sheet in voodo 1.0. `Drawer` exists but is a side panel. */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // No focus trap, no scroll lock, no aria-modal wiring — all of which the
  // radix-backed v2 Dialog gets for free.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.6)]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label={title}
        className="relative z-10 w-[32rem] rounded-lg border-1 border-content-border-default bg-content-bg-card-1 p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <Text variant={TextVariant.Lg}>{title}</Text>
          <IconButton icon={IconName.Close} label="Close" onClick={onClose} />
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/** No switch in voodo 1.0. `Toggle` is a checkbox-style control. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        checked
          ? "bg-action-primary-primary"
          : "bg-content-bg-card-elevated",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 h-4 w-4 rounded-full bg-content-text-primary transition-all",
          checked ? "left-[1.125rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

/** No progress bar in voodo 1.0. */
export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-content-bg-card-elevated">
      <div
        className="h-full rounded-full bg-action-primary-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/**
 * No charting in voodo 1.0 at any level — no wrapper, no tokens for series
 * colors. This is an inline SVG sparkline, which is as far as one can
 * reasonably go by hand; the real page would pull in a charting library and
 * pick its own colors.
 */
export function Sparkline({
  points,
  height = 180,
}: {
  points: number[];
  height?: number;
}) {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = 600;
  const step = w / Math.max(1, points.length - 1);
  const y = (v: number) => height - 20 - ((v - min) / span) * (height - 40);
  const d = points.map((p, i) => `${i ? "L" : "M"}${i * step},${y(p)}`).join("");
  const area = `${d}L${w},${height - 20}L0,${height - 20}Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Usage over time"
    >
      {/* No palette token to reach for, so the hue is invented here. */}
      <path d={area} fill="rgba(255,109,4,0.12)" />
      <path d={d} fill="none" stroke="#FF6D04" strokeWidth={1.5} />
    </svg>
  );
}

/** No avatar in voodo 1.0. */
export function Avatar({ name, size = 20 }: { name: string; size?: number }) {
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-content-bg-card-elevated text-content-text-secondary"
      style={{ height: size, width: size, fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  );
}

/** Identity chip — avatar plus name. */
export function UserChip({ name }: { name: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Avatar name={name} />
      <Text variant={TextVariant.Sm} color={TextColor.Primary}>
        {name}
      </Text>
    </span>
  );
}

/**
 * No tabs in voodo 1.0. `ToggleSwitch` looks like a segmented control and
 * behaves like a tab group, but it is a pill, not an underline tab bar, so it
 * cannot produce this navigation.
 */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex h-full items-center gap-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={clsx(
            "flex h-full items-center gap-1.5 border-b-2 px-3 text-sm transition-colors",
            t.id === active
              ? "border-action-primary-primary text-content-text-primary"
              : "border-transparent text-content-text-secondary hover:text-content-text-primary",
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="tabular-nums text-content-icon-subtle">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * voodo `Pill` exists but has no status semantics — no state dot, no
 * per-status tokens beyond a few text colors, no pulse for in-flight work.
 */
export function StatusDot({
  label,
  tone,
  pulse,
}: {
  label: string;
  tone: "success" | "muted" | "info" | "error";
  pulse?: boolean;
}) {
  const color = {
    success: "text-content-text-success",
    muted: "text-content-text-secondary",
    info: "text-content-text-info",
    error: "text-content-text-destructive",
  }[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full bg-content-bg-card-2 px-2 py-0.5 text-sm font-medium",
        color,
      )}
    >
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full bg-current",
          pulse && "animate-pulse",
        )}
      />
      {label}
    </span>
  );
}

/**
 * voodo has `Variant.Icon` on Button, but no sized circular icon action and
 * no built-in tooltip pairing, so every call site re-specifies geometry.
 */
export function IconButton({
  icon,
  label,
  onClick,
  size = Size.Sm,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  size?: Size.Xs | Size.Sm | Size.Md;
}) {
  return (
    <Button
      variant={Variant.Icon}
      size={size}
      aria-label={label}
      onClick={onClick}
      className="!rounded-full !px-1.5 !py-1.5"
    >
      <Icon name={icon} size={Size.Sm} />
    </Button>
  );
}

/** No app shell, header or settings frame in voodo 1.0. */
export function AppShell({
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-content-bg-background">
      <header className="flex h-12 shrink-0 items-center gap-6 border-b-1 border-content-border-subtle px-5">
        <span className="flex shrink-0 items-center gap-2.5">
          <Icon name={IconName.Workspaces} size={Size.Sm} className="text-content-icon-brand" />
          <Text variant={TextVariant.Md}>FiftyOne</Text>
        </span>
        <Tabs tabs={tabs} active={activeTab} onChange={onTabChange} />
        <span className="ml-auto">
          <UserChip name="Sejal Kotak" />
        </span>
      </header>
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** No settings nav rail in voodo 1.0. */
export function SettingsNav({
  groups,
  activeId,
  onSelect,
}: {
  groups: { label: string; items: { id: string; label: string; icon: IconName }[] }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="w-60 shrink-0 overflow-y-auto border-r-1 border-content-border-subtle p-3">
      {groups.map((g, i) => (
        <div key={g.label} className={i > 0 ? "mt-4" : undefined}>
          <div className="px-3 py-1.5">
            <Text variant={TextVariant.Label} color={TextColor.Muted}>
              {g.label}
            </Text>
          </div>
          <nav className="space-y-0.5">
            {g.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={clsx(
                  "flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm transition-colors",
                  item.id === activeId
                    ? "bg-content-bg-card-elevated text-content-text-primary"
                    : "text-content-text-secondary hover:bg-content-bg-card-2 hover:text-content-text-primary",
                )}
              >
                <Icon name={item.icon} size={Size.Sm} className="text-content-icon-default" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
}

/** No settings page/section/row primitives in voodo 1.0. */
export function Page({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-8 py-8">
        <header className="flex items-start justify-between gap-6">
          <div className="space-y-1.5">
            <Text variant={TextVariant.Xl}>{title}</Text>
            {description && (
              <div>
                <Text variant={TextVariant.Md} color={TextColor.Muted}>
                  {description}
                </Text>
              </div>
            )}
          </div>
          {actions}
        </header>
        {children}
      </div>
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg bg-content-bg-card-1">
      <header className="border-b-1 border-content-border-subtle px-5 py-4">
        <Text variant={TextVariant.Md}>{title}</Text>
        {description && (
          <div>
            <Text variant={TextVariant.Sm} color={TextColor.Muted}>
              {description}
            </Text>
          </div>
        )}
      </header>
      <div className="space-y-4 px-5 py-4">{children}</div>
    </section>
  );
}
