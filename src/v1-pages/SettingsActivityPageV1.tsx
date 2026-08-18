import { useMemo, useState } from "react";

import {
  IconName,
  Orientation,
  Spacing,
  Stack,
  Text,
  TextColor,
  TextVariant,
} from "@/index";
import { DIMENSIONS, seriesFor, totalFor } from "@/v2/pages/demoData";

import {
  AppShell,
  Page,
  Progress,
  Section,
  SettingsNav,
  Sparkline,
} from "./handRolled";

/**
 * Settings → Activity, built with voodo 1.0. Same design and data as the v2
 * page.
 *
 * The gap here is not styling, it is that voodo has no charting at any level
 * — no wrapper, no series-color tokens, no legend or tooltip. `Sparkline` in
 * `handRolled.tsx` is a hand-written SVG with an invented hue, which is as
 * far as one can reasonably go without pulling in a charting library and
 * making palette decisions per page.
 *
 * There is also no progress bar, no metric tile and no section frame, so the
 * meters, the numbers and the page structure are all hand-built.
 */

const NAV = [
  {
    label: "Personal",
    items: [
      { id: "account", label: "Account", icon: IconName.User },
      { id: "api-keys", label: "API keys", icon: IconName.Key },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "services", label: "Services", icon: IconName.Server },
      { id: "activity", label: "Activity", icon: IconName.Activity },
      { id: "billing", label: "Billing", icon: IconName.IdCard },
    ],
  },
];

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: 6 },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

const fmt = (n: number, unit: string) => {
  if (unit === "GB" || unit === "hours")
    return n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
};

export function SettingsActivityPageV1() {
  const [section, setSection] = useState("activity");
  const [tab, setTab] = useState("settings");

  const metered = useMemo(() => DIMENSIONS.filter((d) => d.metered), []);
  const capped = useMemo(() => DIMENSIONS.filter((d) => d.limit), []);
  const tokenDim = DIMENSIONS.find((d) => d.measure === "tokens");

  return (
    <AppShell tabs={TABS} activeTab={tab} onTabChange={setTab}>
      <SettingsNav groups={NAV} activeId={section} onSelect={setSection} />

      <main className="flex-1 overflow-hidden">
        <Page
          title="Activity"
          description="What this deployment has consumed, and how much of the plan is left."
        >
          <Section
            title="Plan headroom"
            description="Usage is throttled once a cap is reached."
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {capped.map((d) => {
                const used = totalFor(d, 30);
                const pct = Math.round((used / (d.limit ?? 1)) * 100);
                return (
                  <div key={d.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <Text variant={TextVariant.Sm}>{d.title ?? d.label}</Text>
                      <Text variant={TextVariant.Sm} color={TextColor.Muted}>
                        {pct}%
                      </Text>
                    </div>
                    <Progress value={pct} />
                    <Text variant={TextVariant.Xs} color={TextColor.Muted}>
                      {fmt(used, d.unit)} / {fmt(d.limit ?? 0, d.unit)} {d.unit}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Trend" description="Consumption over the selected period.">
            {tokenDim ? (
              <Sparkline points={seriesFor(tokenDim, 30).map((p) => p.value)} />
            ) : null}
          </Section>

          <Section
            title="Consumption"
            description="Every metered dimension for this period."
          >
            <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
              {metered.map((d) => (
                <div
                  key={d.id}
                  className="flex items-baseline justify-between gap-6 py-1"
                >
                  <Text variant={TextVariant.Md}>{d.title ?? d.label}</Text>
                  <Text variant={TextVariant.Sm} color={TextColor.Muted}>
                    {fmt(totalFor(d, 30), d.unit)} {d.unit}
                  </Text>
                </div>
              ))}
            </Stack>
          </Section>
        </Page>
      </main>
    </AppShell>
  );
}
