import * as React from "react";
import {
  Activity,
  CreditCard,
  KeyRound,
  Plug,
  Server,
  Shield,
  User,
  Users,
  Workflow,
} from "lucide-react";

import {
  SettingsPage,
  SettingsSection,
  SettingsShell,
  WorkspaceHeader,
  type SettingsNavGroup,
} from "../components/chrome";
import {
  DimensionRow,
  PlanHeadroom,
  UsageTrendChart,
  type Measure,
} from "../components/patterns/activity";
import { MetaChip } from "../components/ui/meta-chip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { UserBadge } from "../components/ui/user-badge";
import { DIMENSIONS, seriesFor, totalFor } from "./demoData";

/**
 * Settings → Activity, assembled end to end.
 *
 * Reads as "how much of my plan is left" first and telemetry second: plan
 * headroom, then a trend, then consumption in plain language. Admins can
 * switch between workspace-wide and personal usage; members see only their
 * own.
 *
 * Aggregation lives here rather than in the pattern. `UsageTrendChart` takes
 * `series` as data and `DimensionRow` takes a total — deciding what a period
 * total means for a snapshot dimension is the application's business rule,
 * not a rendering concern.
 */

const NAV: SettingsNavGroup[] = [
  {
    label: "Personal",
    items: [
      { id: "account", label: "Account", icon: User },
      { id: "api-keys", label: "API keys", icon: KeyRound },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "services", label: "Services", icon: Server },
      { id: "orchestrators", label: "Orchestrators", icon: Workflow },
      { id: "plugins", label: "Plugins", icon: Plug, badge: "Beta" },
      { id: "activity", label: "Activity", icon: Activity },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: Users },
      { id: "roles", label: "Roles", icon: Shield, disabled: true },
    ],
  },
];

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: 6 },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

const PERIODS = [7, 30, 90] as const;
const MEASURES: { id: Measure; label: string }[] = [
  { id: "tokens", label: "Tokens" },
  { id: "requests", label: "Requests" },
  { id: "storage", label: "Storage" },
];

export interface SettingsActivityPageProps {
  /** Members see only their own usage and get no scope switch. */
  isAdmin?: boolean;
}

export function SettingsActivityPage({
  isAdmin = true,
}: SettingsActivityPageProps) {
  const [section, setSection] = React.useState("activity");
  const [scope, setScope] = React.useState<"tenant" | "me">(
    isAdmin ? "tenant" : "me",
  );
  const [days, setDays] = React.useState<(typeof PERIODS)[number]>(30);
  const [measure, setMeasure] = React.useState<Measure>("tokens");

  const mine = !isAdmin || scope === "me";

  // Tenant-only dimensions are meaningless in a member's own view.
  const dims = React.useMemo(
    () => DIMENSIONS.filter((d) => (mine ? !d.tenantOnly : true)),
    [mine],
  );

  const share = mine ? 0.35 : 1;

  const rows = React.useMemo(
    () =>
      dims
        .filter((d) => d.metered)
        .map((dim) => ({
          dim,
          total: Math.round(totalFor(dim, days) * share),
          delta: null as number | null,
        })),
    [dims, days, share],
  );

  const meters = React.useMemo(
    () =>
      dims
        .filter((d) => d.limit)
        .map((dim) => ({ dim, used: Math.round(totalFor(dim, days) * share) })),
    [dims, days, share],
  );

  const trendDims = dims.filter((d) => d.measure === measure);
  const trendSeries = trendDims.map((d) =>
    seriesFor(d, days).map((p) => ({ ...p, value: Math.round(p.value * share) })),
  );

  return (
    <SettingsShell
      groups={NAV}
      activeId={section}
      onSelect={setSection}
      header={
        <WorkspaceHeader
          tabs={TABS}
          activeId="settings"
          user={<UserBadge name="Sejal Kotak" />}
        />
      }
    >
      <SettingsPage
        title="Activity"
        description="What this deployment has consumed, and how much of the plan is left."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MetaChip>Enterprise plan</MetaChip>
            <span className="text-body-sm text-muted-foreground">
              Billing period ends Sep 1 · 14 days left
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <ToggleGroup
                type="single"
                size="md"
                value={scope}
                onValueChange={(v) => v && setScope(v as "tenant" | "me")}
              >
                <ToggleGroupItem value="tenant">Workspace</ToggleGroupItem>
                <ToggleGroupItem value="me">You</ToggleGroupItem>
              </ToggleGroup>
            )}
            <Select
              value={String(days)}
              onValueChange={(v) =>
                setDays(Number(v) as (typeof PERIODS)[number])
              }
            >
              <SelectTrigger className="h-8 w-[140px] text-body-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    Last {p} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SettingsSection
          title="Plan headroom"
          description="Usage is throttled once a cap is reached."
          scope={mine ? "You" : "Workspace"}
        >
          <PlanHeadroom meters={meters} />
        </SettingsSection>

        <SettingsSection
          title="Trend"
          description="Consumption over the selected period."
          scope={mine ? "You" : "Workspace"}
        >
          <div className="mb-4 flex items-center gap-2">
            <ToggleGroup
              type="single"
              size="sm"
              value={measure}
              onValueChange={(v) => v && setMeasure(v as Measure)}
            >
              {MEASURES.map((m) => (
                <ToggleGroupItem key={m.id} value={m.id}>
                  {m.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {trendDims.length ? (
            <UsageTrendChart
              dims={trendDims}
              series={trendSeries}
              measure={measure}
              unit={trendDims[0]?.unit ?? ""}
            />
          ) : (
            <p className="py-8 text-center text-body-sm text-muted-foreground">
              Nothing metered against {measure} yet.
            </p>
          )}
        </SettingsSection>

        <SettingsSection
          title="Consumption"
          description="Every metered dimension for this period."
          scope={mine ? "You" : "Workspace"}
        >
          <div className="flex flex-col gap-4">
            {rows.map((r) => (
              <DimensionRow
                key={r.dim.id}
                dim={r.dim}
                total={r.total}
                delta={r.delta}
              />
            ))}
          </div>
        </SettingsSection>
      </SettingsPage>
    </SettingsShell>
  );
}
