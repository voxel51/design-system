import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Search,
  ScrollText,
  ShieldAlert,
  Square,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { IconAction } from "../../ui/icon-action";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { BrandIcon, brandLabel } from "./BrandIcon";
import { ServiceSheet } from "./ServiceSheet";
import { accentClasses, formatSince, type Service, type ServiceStatus } from "./types";

/**
 * ServicesView — the admin Services page: filter/search header, stat strip,
 * and a table of services with per-user instances as expandable child rows.
 *
 * Ported from the Lovable master (`components/services/ServicesView.tsx`).
 * Markup and classes are unchanged; only the data seams moved:
 *
 * - services arrive as a prop instead of a mocks import
 * - status changes call `onStatusChange` instead of writing localStorage
 * - `focusId` is a prop instead of a `useSearchParams()` read, so the
 *   pattern does not depend on a router
 *
 * The component still owns its own list state so it stays usable
 * uncontrolled; pass `services` fresh to drive it from a server.
 */

type Filter = "all" | "builtin" | "custom";

const statusStyles: Record<ServiceStatus, { label: string; text: string }> = {
  running: { label: "Running", text: "text-status-success" },
  stopped: { label: "Stopped", text: "text-secondary-foreground" },
  starting: { label: "Starting", text: "text-status-info" },
  stopping: { label: "Stopping", text: "text-status-info" },
  error: { label: "Error", text: "text-status-failure" },
};

function StatusPill({ status }: { status: ServiceStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-card-2 px-2 py-0.5 text-body-sm font-medium",
        s.text,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          (status === "starting" || status === "stopping") && "animate-pulse",
        )}
      />
      {s.label}
    </span>
  );
}

export interface ServicesViewProps {
  /** Services to render. Treated as the initial list; edits are local. */
  services: Service[];
  /**
   * Called when an admin starts or stops a service. Persisting the change and
   * reconciling it back into `services` is the caller's job.
   */
  onStatusChange?: (id: string, status: ServiceStatus) => void;
  /** Called when an admin deletes a custom service. */
  onDelete?: (id: string) => void;
  /** Called when the create or edit sheet is saved. */
  onSave?: (service: Service) => void;
  /**
   * Scroll to this service, expand it if per-user, and open its detail sheet.
   * Supply from the route (`?focus=`) at the page level.
   */
  focusId?: string | null;
  /** Called when "View logs" is chosen. Renders a placeholder toast if unset. */
  onViewLogs?: (service: Service) => void;
}

export function ServicesView({
  services: initialServices,
  onStatusChange,
  onDelete,
  onSave,
  focusId,
  onViewLogs,
}: ServicesViewProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  useEffect(() => setServices(initialServices), [initialServices]);

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (svc: Service) => {
    setEditing(svc);
    setSheetOpen(true);
  };
  const handleSheetOpenChange = (v: boolean) => {
    setSheetOpen(v);
    if (!v) setEditing(null);
  };

  const handledFocusRef = useRef<string | null>(null);
  useEffect(() => {
    if (!focusId || handledFocusRef.current === focusId) return;
    const svc = services.find((s) => s.id === focusId);
    if (!svc) return;
    handledFocusRef.current = focusId;
    if (svc.scope === "per-user") setExpanded((p) => new Set(p).add(focusId));
    document
      .getElementById(`svc-row-${focusId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Open the detail sheet immediately so the user can review and start the
    // service without hunting through the list.
    openEdit(svc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, services]);

  const visible = useMemo(() => {
    return services.filter((s) => {
      if (filter === "builtin" && s.origin !== "builtin") return false;
      if (filter === "custom" && s.origin !== "custom") return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.kindGroup.toLowerCase().includes(q) &&
          !(s.kindDetail ?? "").toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [services, filter, query]);

  const counts = useMemo(
    () => ({
      all: services.length,
      builtin: services.filter((s) => s.origin === "builtin").length,
      custom: services.filter((s) => s.origin === "custom").length,
      running: services.filter((s) => s.status === "running").length,
    }),
    [services],
  );

  const toggle = (id: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const setStatus = (id: string, status: ServiceStatus) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status, since: new Date().toISOString() } : s,
      ),
    );
    onStatusChange?.(id, status);
    toast.success(status === "running" ? "Service started" : "Service stopped");
  };

  const remove = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    onDelete?.(id);
    toast.success("Service deleted");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-display font-semibold text-foreground tracking-tight">
              Services
            </h1>
            <p className="mt-1 text-body text-secondary-foreground max-w-xl">
              Orchestrators and runtimes powering this workspace.
            </p>
          </div>
          <Button onClick={openCreate} className="h-9 px-3.5 gap-1.5">
            <Plus className="h-4 w-4" />
            New service
          </Button>
        </div>

        {/* Stat strip */}
        <div className="mt-5 flex items-center gap-6 text-body-sm">
          <Stat label="Total" value={counts.all} />
          <Stat label="Running" value={counts.running} accent />
          <Stat label="Built-in" value={counts.builtin} />
          <Stat label="Custom" value={counts.custom} />
        </div>
      </div>

      {/* Filter + search bar */}
      <div className="px-8 pb-4 flex items-center gap-3">
        <div className="inline-flex h-10 border border-border rounded-lg overflow-hidden divide-x divide-border">
          {(["all", "builtin", "custom"] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "h-full px-4 text-body font-medium transition-colors",
                  active
                    ? "bg-card-elevated text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f === "all" ? "All" : f === "builtin" ? "Built-in" : "Custom"}
              </button>
            );
          })}
        </div>

        <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-input px-3 transition-colors hover:border-input-hover focus-within:border-input-focus">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services"
            className="w-full bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none"
          />
          <span className="shrink-0 text-body text-muted-foreground tabular-nums">
            {visible.length}/{services.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-3">
          <div className="rounded-lg bg-card overflow-hidden py-3">
            {/* Column headers */}
            <div className="grid grid-cols-[minmax(150px,1.6fr)_minmax(0,0.9fr)_124px] md:grid-cols-[minmax(180px,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_124px] items-center gap-4 px-3 pb-2 text-meta uppercase tracking-wider text-muted-foreground">
              <div>Service</div>
              <div className="hidden md:block">Type</div>
              <div>Status</div>
              <div className="hidden md:block">Activity</div>
              <div />
            </div>

            {visible.length === 0 && (
              <div className="py-16 text-center text-body text-muted-foreground">
                No services match your filter.
              </div>
            )}

            {visible.map((svc) => {
              const a = accentClasses[svc.accent];
              const Icon = svc.icon;
              const isPerUser = svc.scope === "per-user";
              const isExpanded = expanded.has(svc.id);

              return (
                <div
                  key={svc.id}
                  id={`svc-row-${svc.id}`}
                  className="border-b border-border/10 transition-colors"
                >
                  <div className="relative grid grid-cols-[minmax(150px,1.6fr)_minmax(0,0.9fr)_124px] md:grid-cols-[minmax(180px,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_124px] items-center gap-4 px-3 py-3 group hover:bg-card-2 rounded-md">
                    <div className="flex items-center gap-3 min-w-0">
                      {isPerUser && (
                        <IconAction
                          size="sm"
                          onClick={() => toggle(svc.id)}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full shrink-0"
                        >
                          <ChevronRight
                            className={cn(
                              "transition-transform",
                              isExpanded && "rotate-90",
                            )}
                          />
                        </IconAction>
                      )}
                      {/* Square icon tile — aspect-square enforces 1:1 */}
                      <span
                        className={cn(
                          "inline-flex aspect-square h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          a.bg,
                        )}
                      >
                        <Icon
                          className={cn(a.fg, "h-[18px] w-[18px]")}
                          strokeWidth={1.75}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body font-mono font-medium text-foreground truncate">
                            {svc.name}
                          </span>
                          {svc.origin === "custom" && (
                            <span className="text-meta px-2 py-0.5 rounded-full bg-card-2 text-secondary-foreground">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-body-sm text-secondary-foreground truncate">
                          {svc.description}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block min-w-0">
                      <div className="flex items-center gap-1.5 text-meta text-foreground/90">
                        <span className="truncate">{svc.kindGroup}</span>
                        {(svc.deployment && svc.deployment !== "process") ||
                        svc.backend ? (
                          <span className="flex items-center gap-1 ml-0.5">
                            {svc.deployment && svc.deployment !== "process" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-card-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <BrandIcon name={svc.deployment} size={11} />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-meta">
                                  Runs on {brandLabel[svc.deployment]}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {svc.backend && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-card-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <BrandIcon name={svc.backend} size={11} />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-meta">
                                  Powered by {brandLabel[svc.backend]}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1.5 text-caption text-muted-foreground mt-0.5 min-w-0">
                        <span className="truncate">
                          {svc.kindDetail ?? (isPerUser ? "Per-user" : "Global")}
                        </span>
                        {isPerUser && !svc.kindDetail && svc.instances && (
                          <>
                            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50 shrink-0" />
                            <span className="shrink-0">
                              {svc.instances.length}
                            </span>
                          </>
                        )}
                        {svc.version && (
                          <>
                            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50 shrink-0" />
                            <span className="shrink-0">{svc.version}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <StatusPill status={svc.status} />
                    </div>

                    <div className="hidden md:block text-body-sm text-muted-foreground truncate">
                      {svc.status === "running"
                        ? `Up for ${formatSince(svc.since)}`
                        : `Stopped ${formatSince(svc.since)} ago`}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2.5 text-body-sm [&_svg]:size-3"
                        onClick={() =>
                          setStatus(
                            svc.id,
                            svc.status === "running" ? "stopped" : "running",
                          )
                        }
                      >
                        {svc.status === "running" ? (
                          <>
                            <Square /> Stop
                          </>
                        ) : (
                          <>
                            <Play /> Start
                          </>
                        )}
                      </Button>

                      <span
                        className="h-4 w-px bg-border/30 mx-0.5"
                        aria-hidden
                      />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconAction aria-label="More actions">
                            <MoreHorizontal />
                          </IconAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-auto min-w-[10rem]"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              onViewLogs
                                ? onViewLogs(svc)
                                : toast.info("Logs panel coming soon")
                            }
                          >
                            <ScrollText className="h-3.5 w-3.5 mr-2" /> View logs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(svc)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                            {svc.origin === "builtin" && (
                              <span className="ml-auto pl-4 text-meta uppercase tracking-wider text-tertiary-foreground">
                                Limited
                              </span>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {svc.origin === "custom" ? (
                            <DropdownMenuItem
                              onClick={() => remove(svc.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              disabled
                              className="opacity-60 text-meta text-tertiary-foreground whitespace-nowrap"
                            >
                              <ShieldAlert className="h-3.5 w-3.5 mr-2" />{" "}
                              Built-in · cannot delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Instances — inline rows that align with the parent grid */}
                  {isPerUser && isExpanded && svc.instances && (
                    <div className="relative pb-2">
                      {/* nesting rail aligned with the chevron column */}
                      <span
                        aria-hidden
                        className="absolute top-0 bottom-3 left-[22px] w-px bg-border/20"
                      />
                      {svc.instances.map((inst) => (
                        <div
                          key={inst.id}
                          className="grid grid-cols-[minmax(150px,1.6fr)_minmax(0,0.9fr)_124px] md:grid-cols-[minmax(180px,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_124px] items-center gap-4 px-3 py-1.5 group/inst rounded-md hover:bg-card-2"
                        >
                          <div className="flex items-center gap-3 min-w-0 pl-[44px]">
                            <div className="h-7 w-7 shrink-0 rounded-full bg-card-2 flex items-center justify-center text-caption font-medium text-secondary-foreground">
                              {inst.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-meta text-foreground truncate">
                                {inst.userName}
                              </div>
                              <div className="text-caption text-secondary-foreground truncate">
                                {inst.userEmail}
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:block" />
                          <div>
                            <StatusPill status={inst.status} />
                          </div>
                          <div className="hidden md:block text-body-sm text-muted-foreground">
                            {inst.status === "running"
                              ? `Up for ${formatSince(inst.since)}`
                              : `Stopped ${formatSince(inst.since)} ago`}
                          </div>
                          <div className="flex justify-end">
                            <IconAction
                              size="sm"
                              aria-label={
                                inst.status === "running"
                                  ? "Stop instance"
                                  : "Start instance"
                              }
                              onClick={() =>
                                toast.success(
                                  inst.status === "running"
                                    ? "Instance stopped"
                                    : "Instance started",
                                )
                              }
                              className="opacity-0 group-hover/inst:opacity-100 transition-opacity"
                            >
                              {inst.status === "running" ? <Square /> : <Play />}
                            </IconAction>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ServiceSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        service={editing}
        onSave={onSave}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          "text-title font-semibold tabular-nums",
          accent ? "text-status-success" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-meta uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
