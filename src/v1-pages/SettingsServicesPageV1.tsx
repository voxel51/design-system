import { useMemo, useState } from "react";

import {
  Button,
  Icon,
  IconName,
  Orientation,
  Input,
  Size,
  Spacing,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  TextColor,
  TextVariant,
  Variant,
} from "@/index";
import type { Service, ServiceStatus } from "@/v2/components/patterns/services";
import { SERVICES } from "@/v2/pages/demoData";

import {
  AppShell,
  IconButton,
  Modal,
  Page,
  SettingsNav,
  StatusDot,
} from "./handRolled";

/**
 * Settings → Services, built with voodo 1.0.
 *
 * Same design, same data as the v2 page, so the comparison is about the
 * design system rather than the content. Everything voodo provides is used;
 * everything it does not is in `handRolled.tsx`.
 *
 * What voodo 1.0 supplied: Button, Input, Text, Icon, Stack, Table.
 * What had to be written: the app shell and header, the settings nav rail,
 * the page and section frames, the status chip, the icon button, the modal,
 * and the per-user instance rows.
 *
 * The two behavioral gaps worth naming, because they are not styling:
 *
 * - The row menu is a plain `<details>`. voodo's `Dropdown` is built for a
 *   `DropdownTrigger` button; driving it from a bare icon needs the trigger
 *   contract this page cannot satisfy, so the menu loses keyboard
 *   navigation, typeahead and focus return.
 * - The modal has no focus trap, no scroll lock and no `aria-modal`
 *   wiring — a hand-rolled overlay does not get those.
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
      { id: "orchestrators", label: "Orchestrators", icon: IconName.Orchestrator },
      { id: "plugins", label: "Plugins", icon: IconName.Puzzle },
      { id: "activity", label: "Activity", icon: IconName.Activity },
      { id: "billing", label: "Billing", icon: IconName.IdCard },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "users", label: "Users", icon: IconName.Users },
      { id: "roles", label: "Roles", icon: IconName.ShieldCheck },
    ],
  },
];

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: 6 },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

const toneFor = (s: ServiceStatus) =>
  s === "running"
    ? ("success" as const)
    : s === "error"
      ? ("error" as const)
      : s === "starting" || s === "stopping"
        ? ("info" as const)
        : ("muted" as const);

const labelFor = (s: ServiceStatus) => s[0].toUpperCase() + s.slice(1);

const since = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
};

export function SettingsServicesPageV1() {
  const [section, setSection] = useState("services");
  const [tab, setTab] = useState("settings");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "builtin" | "custom">("all");
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  const visible = useMemo(
    () =>
      services.filter((s) => {
        if (filter !== "all" && s.origin !== filter) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.kindGroup.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }),
    [services, filter, query],
  );

  const counts = {
    all: services.length,
    running: services.filter((s) => s.status === "running").length,
    builtin: services.filter((s) => s.origin === "builtin").length,
    custom: services.filter((s) => s.origin === "custom").length,
  };

  const toggleStatus = (id: string) =>
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "running" ? "stopped" : "running",
              since: new Date().toISOString(),
            }
          : s,
      ),
    );

  return (
    <AppShell tabs={TABS} activeTab={tab} onTabChange={setTab}>
      <SettingsNav groups={NAV} activeId={section} onSelect={setSection} />

      <main className="flex-1 overflow-hidden">
        <Page
          title="Services"
          description="Orchestrators and runtimes powering this workspace."
          actions={
            <Button variant={Variant.Primary} size={Size.Md} onClick={() => setCreating(true)}>
              <Icon name={IconName.Add} size={Size.Sm} />
              New service
            </Button>
          }
        >
          {/* Stat strip — no metric component in voodo, so it is Text pairs. */}
          <Stack orientation={Orientation.Row} spacing={Spacing.Lg}>
            {[
              ["Total", counts.all],
              ["Running", counts.running],
              ["Built-in", counts.builtin],
              ["Custom", counts.custom],
            ].map(([label, value]) => (
              <span key={String(label)} className="flex items-baseline gap-1.5">
                <Text variant={TextVariant.Lg}>{String(value)}</Text>
                <Text variant={TextVariant.Label} color={TextColor.Muted}>
                  {String(label)}
                </Text>
              </span>
            ))}
          </Stack>

          {/* Filter group — no segmented control or tabs in voodo. */}
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 divide-x-1 divide-content-border-default overflow-hidden rounded-lg border-1 border-content-border-default">
              {(["all", "builtin", "custom"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    "h-full px-4 text-sm transition-colors " +
                    (filter === f
                      ? "bg-content-bg-card-elevated text-content-text-primary"
                      : "text-content-text-secondary hover:text-content-text-primary")
                  }
                >
                  {f === "all" ? "All" : f === "builtin" ? "Built-in" : "Custom"}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <Input
                icon={IconName.Search}
                placeholder="Search services"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((svc) => {
                const isPerUser = svc.scope === "per-user";
                const isOpen = expanded.has(svc.id);
                return (
                  <>
                    <TableRow key={svc.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {isPerUser && (
                            <button
                              type="button"
                              aria-label={isOpen ? "Collapse" : "Expand"}
                              onClick={() =>
                                setExpanded((p) => {
                                  const n = new Set(p);
                                  if (n.has(svc.id)) n.delete(svc.id);
                                  else n.add(svc.id);
                                  return n;
                                })
                              }
                              className="text-content-icon-default"
                            >
                              <Icon
                                name={isOpen ? IconName.ChevronBottom : IconName.ChevronRight}
                              />
                            </button>
                          )}
                          <span className="min-w-0">
                            <div className="truncate font-mono">
                              <Text variant={TextVariant.Md}>{svc.name}</Text>
                            </div>
                            <div className="truncate">
                              <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
                                {svc.description}
                              </Text>
                            </div>
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Text variant={TextVariant.Sm}>{svc.kindGroup}</Text>
                        <div>
                          <Text variant={TextVariant.Xs} color={TextColor.Muted}>
                            {svc.kindDetail ?? (isPerUser ? "Per-user" : "Global")}
                          </Text>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusDot
                          label={labelFor(svc.status)}
                          tone={toneFor(svc.status)}
                          pulse={svc.status === "starting" || svc.status === "stopping"}
                        />
                      </TableCell>
                      <TableCell>
                        <Text variant={TextVariant.Sm} color={TextColor.Muted}>
                          {svc.status === "running"
                            ? `Up for ${since(svc.since)}`
                            : `Stopped ${since(svc.since)} ago`}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center justify-end gap-2">
                          <Button
                            variant={Variant.Secondary}
                            size={Size.Xs}
                            onClick={() => toggleStatus(svc.id)}
                          >
                            <Icon
                              name={svc.status === "running" ? IconName.Pause : IconName.Play}
                            />
                            {svc.status === "running" ? "Stop" : "Start"}
                          </Button>
                          {/* voodo's Dropdown expects its own trigger button, so
                              this falls back to a native disclosure. */}
                          <details className="relative">
                            <summary className="list-none">
                              <IconButton
                                icon={IconName.MoreHorizontal}
                                label="More actions"
                              />
                            </summary>
                            <div className="absolute right-0 z-10 mt-1 w-40 rounded border-1 border-content-border-default bg-content-bg-popover py-1">
                              {["View logs", "Edit", "Delete"].map((label) => (
                                <button
                                  key={label}
                                  type="button"
                                  className="block w-full px-3 py-1.5 text-left text-sm text-content-text-secondary hover:bg-content-bg-card-1 hover:text-content-text-primary"
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </details>
                        </span>
                      </TableCell>
                    </TableRow>

                    {isPerUser &&
                      isOpen &&
                      svc.instances?.map((inst) => (
                        <TableRow key={inst.id}>
                          <TableCell>
                            <span className="flex items-center gap-2 pl-8">
                              <Text variant={TextVariant.Sm}>{inst.userName}</Text>
                              <Text variant={TextVariant.Xs} color={TextColor.Muted}>
                                {inst.userEmail}
                              </Text>
                            </span>
                          </TableCell>
                          <TableCell> </TableCell>
                          <TableCell>
                            <StatusDot
                              label={labelFor(inst.status)}
                              tone={toneFor(inst.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Text variant={TextVariant.Sm} color={TextColor.Muted}>
                              {inst.status === "running"
                                ? `Up for ${since(inst.since)}`
                                : `Stopped ${since(inst.since)} ago`}
                            </Text>
                          </TableCell>
                          <TableCell> </TableCell>
                        </TableRow>
                      ))}
                  </>
                );
              })}
            </TableBody>
          </Table>

          {visible.length === 0 && (
            <div className="py-8">
              <Text variant={TextVariant.Md} color={TextColor.Muted}>
                No services match your filter.
              </Text>
            </div>
          )}
        </Page>
      </main>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New service"
        footer={
          <>
            <Button variant={Variant.Secondary} onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button variant={Variant.Primary} onClick={() => setCreating(false)}>
              Create service
            </Button>
          </>
        }
      >
        <Stack orientation={Orientation.Column} spacing={Spacing.Md}>
          <label className="block">
            <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
              Name
            </Text>
            <Input placeholder="argo-prod" />
          </label>
          <label className="block">
            <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
              Endpoint
            </Text>
            <Input placeholder="https://argo.internal:2746" />
          </label>
        </Stack>
      </Modal>
    </AppShell>
  );
}
