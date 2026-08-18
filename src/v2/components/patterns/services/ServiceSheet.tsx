import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Lock, ShieldCheck, AlertTriangle, X } from "lucide-react";
import { IconAction } from "../../ui/icon-action";
import { ColorPicker } from "../../ui/color-picker";
import { DialogClose } from "@radix-ui/react-dialog";
import { accentClasses, kindGroups, kindIcon, type Service, type ServiceKindGroup } from "./types";
import { cn } from "../../../lib/utils";
import { toast } from "sonner";

export interface ServiceSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** When provided, the sheet runs in edit mode for this service. */
  service?: Service | null;
  /**
   * Receives the assembled service on submit. Persisting is the caller's job.
   *
   * The Lovable master has no such seam — it toasts "Demo only — not
   * persisted" and closes. Left unset, that demo behavior is preserved, so
   * the sheet still works standalone in Storybook.
   */
  onSave?: (service: Service) => void;
}

const accents: (keyof typeof accentClasses)[] = ["violet", "indigo", "cyan", "teal", "emerald", "amber", "rose", "slate"];

/** Input focus override: brighter gray ring instead of brand orange. */
const inputFocus =
  "focus:ring-1 focus:ring-foreground/40 focus:ring-offset-0 focus:border-foreground/30 " +
  "focus-visible:ring-1 focus-visible:ring-foreground/40 focus-visible:ring-offset-0 focus-visible:border-foreground/30";

/** Fields whose change requires a service restart. */
type RuntimeField = "endpoint" | "image" | "command" | "port" | "version";

export function ServiceSheet({
  open,
  onOpenChange,
  service,
  onSave,
}: ServiceSheetProps) {
  const isEdit = !!service;
  const isBuiltin = service?.origin === "builtin";

  // Form state — initialized from `service` in edit mode.
  const [name, setName] = useState("");
  const [kindGroup, setKindGroup] = useState<ServiceKindGroup>("Orchestrator");
  const [kindDetail, setKindDetail] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"global" | "per-user">("global");
  const [accent, setAccent] = useState<keyof typeof accentClasses>("indigo");
  const [autoStart, setAutoStart] = useState(true);
  const [endpoint, setEndpoint] = useState("");
  const [image, setImage] = useState("");
  const [version, setVersion] = useState("");

  // Snapshot of original runtime fields so we can detect "dirty runtime" edits.
  const [originalRuntime, setOriginalRuntime] = useState<Record<RuntimeField, string>>({
    endpoint: "",
    image: "",
    command: "",
    port: "",
    version: "",
  });

  useEffect(() => {
    if (!open) return;
    if (service) {
      setName(service.name);
      setKindGroup(service.kindGroup);
      setKindDetail(service.kindDetail ?? "");
      setDescription(service.description);
      setScope(service.scope);
      setAccent(service.accent);
      setAutoStart(service.autoStart ?? true);
      setEndpoint(service.endpoint ?? "");
      setImage(service.image ?? "");
      setVersion(service.version ?? "");
      setOriginalRuntime({
        endpoint: service.endpoint ?? "",
        image: service.image ?? "",
        command: service.command ?? "",
        port: service.port?.toString() ?? "",
        version: service.version ?? "",
      });
    } else {
      setName("");
      setKindGroup("Orchestrator");
      setKindDetail("");
      setDescription("");
      setScope("global");
      setAccent("indigo");
      setAutoStart(true);
      setEndpoint("");
      setImage("");
      setVersion("");
    }
  }, [open, service]);

  const PreviewIcon = isEdit ? service!.icon : kindIcon[kindGroup];
  const a = accentClasses[accent];

  /** Did any runtime-affecting field change? Only relevant in edit mode. */
  const runtimeDirty = useMemo(() => {
    if (!isEdit) return false;
    return (
      endpoint !== originalRuntime.endpoint ||
      image !== originalRuntime.image ||
      version !== originalRuntime.version
    );
  }, [isEdit, endpoint, image, version, originalRuntime]);

  const handleSubmit = () => {
    const restartNote =
      isEdit && runtimeDirty ? ` · Restarting ${service!.name}…` : "";

    if (onSave) {
      onSave({
        ...(service ?? {}),
        id: service?.id ?? name,
        name,
        kindGroup,
        kindDetail: kindDetail || undefined,
        description,
        scope,
        accent,
        autoStart,
        endpoint: endpoint || undefined,
        image: image || undefined,
        version: version || undefined,
        icon: service?.icon ?? kindIcon[kindGroup],
        origin: service?.origin ?? "custom",
        status: service?.status ?? "stopped",
        since: service?.since ?? new Date().toISOString(),
      } as Service);
      toast.success(isEdit ? "Service updated" : "Service created", {
        description: restartNote ? restartNote.replace(/^ · /, "") : undefined,
      });
    } else if (isEdit) {
      toast.success("Service updated", {
        description: `Demo only — not persisted.${restartNote}`,
      });
    } else {
      toast.success("Service created", {
        description: "Demo only — not persisted.",
      });
    }
    onOpenChange(false);
  };

  const title = isEdit ? `Edit ${service!.name}` : "New service";
  const subtitle = isEdit
    ? isBuiltin
      ? "Built-in service. Some fields are managed by FiftyOne."
      : "Update configuration. Runtime changes will restart the service."
    : "Register an orchestrator, runtime or endpoint. It'll appear in the services table once created.";

  // Field lock rules (applied in addition to id/name + kindGroup which are
  // ALWAYS locked in edit mode regardless of origin).
  const lockName = isEdit;
  const lockKind = isEdit;
  const lockRuntime = isEdit && isBuiltin; // built-in: endpoint/image locked
  const lockScope = isEdit; // scope is structural — never change post-create

  return (
    // modal={false} avoids the Radix body pointer-events lock that lingers
    // after Select closes (would otherwise break hover/focus on options).
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-scrim/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
          aria-hidden
        />
      )}
      <DialogContent
        className="max-w-[560px] gap-0 p-0 bg-background border border-border/30 z-50 [&>button.absolute]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/15 text-left space-y-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-title font-semibold leading-tight">{title}</DialogTitle>
            {isEdit && isBuiltin && (
              <span className="inline-flex items-center gap-1 text-meta text-muted-foreground bg-card-2 border border-border/20 rounded-full px-2 py-0.5 leading-none">
                <ShieldCheck className="h-3 w-3" />
                Managed by FiftyOne
              </span>
            )}
            <DialogClose asChild>
              <IconAction size="md" className="ml-auto shrink-0">
                <X />
                <span className="sr-only">Close</span>
              </IconAction>
            </DialogClose>
          </div>
          <DialogDescription className="text-body text-secondary-foreground mt-1.5">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Live preview — in create mode this is a pure styling preview;
              in edit mode it reflects the service's real runtime status. */}
          {(() => {
            const status = isEdit ? service!.status : null;
            const statusMeta: Record<string, { dot: string; verb: string }> = {
              running:  { dot: "bg-[hsl(140_55%_55%)]",  verb: "Running on" },
              stopped:  { dot: "bg-muted-foreground/50", verb: "Stopped ·" },
              starting: { dot: "bg-[hsl(38_92%_60%)]",   verb: "Starting" },
              stopping: { dot: "bg-[hsl(38_92%_60%)]",   verb: "Stopping" },
              error:    { dot: "bg-[hsl(0_75%_60%)]",    verb: "Error on" },
            };
            const meta = status ? statusMeta[status] : null;
            const eyebrow = isEdit ? "Preview · live status" : "Appears as";
            return (
              <div className="rounded-lg border border-border/20 bg-card-2 p-4">
                <div className="text-meta uppercase tracking-wider text-muted-foreground mb-3">{eyebrow}</div>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-border/20 bg-card-2 pl-1 pr-2 py-1 text-body-sm">
                  <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-[4px]", a.bg)}>
                    <PreviewIcon className={cn(a.fg, "h-3 w-3")} strokeWidth={2} />
                  </span>
                  {meta ? (
                    <>
                      <span className="text-secondary-foreground">{meta.verb}</span>
                      <span className="font-mono font-medium text-foreground/90">{name || "argo-staging"}</span>
                      <span className={cn("ml-0.5 inline-block h-2 w-2 rounded-full", meta.dot)} />
                    </>
                  ) : (
                    <span className="font-mono font-medium text-foreground/90">{name || "argo-staging"}</span>
                  )}
                </div>
                {!isEdit && (
                  <p className="mt-2 text-meta text-muted-foreground">
                    How this service will look in dataset and project chips. Status appears once it's running.
                  </p>
                )}
              </div>
            );
          })()}

          {/* Basics */}
          <div className="space-y-3">
            <div>
              <Label className="text-body-sm text-muted-foreground flex items-center gap-1.5">
                Name {lockName && <Lock className="h-3 w-3 opacity-60" />}
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. argo-staging"
                disabled={lockName}
                className={cn("mt-1.5 h-9 text-body font-mono", inputFocus, lockName && "opacity-70 cursor-not-allowed")}
              />
              <p className="mt-1 text-meta text-muted-foreground">
                {lockName
                  ? "Instance name is permanent. Delete and recreate to rename."
                  : "The instance name admins and chips will reference. Lowercase, hyphenated."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div>
                <Label className="text-body-sm text-muted-foreground flex items-center gap-1.5 h-4">
                  Type {lockKind && <Lock className="h-3 w-3 opacity-60" />}
                </Label>
                <Select value={kindGroup} onValueChange={(v) => setKindGroup(v as ServiceKindGroup)} disabled={lockKind}>
                  <SelectTrigger className={cn("mt-1.5 h-9 text-body", inputFocus, lockKind && "opacity-70 cursor-not-allowed")}>
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        {(() => {
                          const Icon = kindIcon[kindGroup];
                          return <Icon className="h-3.5 w-3.5 text-icon shrink-0" />;
                        })()}
                        {kindGroup}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {kindGroups.map((k) => {
                      const Icon = kindIcon[k];
                      return (
                        <SelectItem key={k} value={k} className="text-body">
                          <span className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-icon shrink-0" />
                            {k}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-body-sm text-muted-foreground flex items-center gap-1.5 h-4">Backend / flavor</Label>
                <Input
                  value={kindDetail}
                  onChange={(e) => setKindDetail(e.target.value)}
                  placeholder="e.g. Argo on K8s"
                  className={cn("mt-1.5 h-9 text-body", inputFocus)}
                />
              </div>
            </div>
            <div className="pt-4">
              <Label className="text-body-sm text-muted-foreground">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this service do?"
                className={cn("mt-1.5 text-body min-h-[64px]", inputFocus)}
              />
            </div>
          </div>

          {/* Accent */}
          <div className="space-y-2">
            <Label className="text-body-sm text-muted-foreground">Chip color</Label>
            <ColorPicker
              value={accent}
              onChange={(id) => setAccent(id as keyof typeof accentClasses)}
              options={accents.map((a) => ({ id: a, hsl: accentClasses[a].hsl }))}
              className="pt-1"
            />
          </div>

          <Separator className="bg-border/15" />

          {/* Scope */}
          <div className="space-y-2">
            <Label className="text-body-sm text-muted-foreground flex items-center gap-1.5">
              Scope {lockScope && <Lock className="h-3 w-3 opacity-60" />}
            </Label>
            <RadioGroup
              value={scope}
              onValueChange={(v) => !lockScope && setScope(v as "global" | "per-user")}
              className="grid grid-cols-2 gap-2"
            >
              {(["global", "per-user"] as const).map((opt) => {
                const selected = scope === opt;
                return (
                  <label
                    key={opt}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                      lockScope ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                      selected ? "border-primary/40 bg-primary/5" : "border-border/25 hover:border-border/40",
                    )}
                  >
                    <RadioGroupItem value={opt} className="mt-0.5" disabled={lockScope} />
                    <div className="flex-1">
                      <div className="text-body font-medium text-foreground capitalize">{opt === "per-user" ? "Per-user" : "Global"}</div>
                      <div className="text-body-sm text-secondary-foreground">
                        {opt === "global" ? "One shared instance per workspace." : "A dedicated instance per user."}
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator className="bg-border/15" />

          {/* Runtime */}
          <div className="space-y-3">
            <Label className="text-body-sm text-muted-foreground flex items-center gap-1.5">
              Runtime {lockRuntime && <Lock className="h-3 w-3 opacity-60" />}
            </Label>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              disabled={lockRuntime}
              placeholder="Endpoint (e.g. argo.prod.svc:2746)"
              className={cn("h-9 text-body-sm font-mono", inputFocus, lockRuntime && "opacity-70 cursor-not-allowed")}
            />
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={lockRuntime}
              placeholder="Container image (e.g. registry/internal/svc:1.0)"
              className={cn("h-9 text-body-sm font-mono", inputFocus, lockRuntime && "opacity-70 cursor-not-allowed")}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="Version (e.g. v2.4.1)"
                className={cn("h-9 text-body-sm font-mono", inputFocus)}
              />
              <div className="flex items-center justify-between rounded-md border border-border/25 px-3 h-9">
                <span className="text-body-sm text-foreground">Auto-start</span>
                <Switch checked={autoStart} onCheckedChange={setAutoStart} />
              </div>
            </div>
            {lockRuntime && (
              <p className="text-meta text-muted-foreground">
                Image and endpoint are vendor-owned for built-in services. Pin a version instead.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border/15 bg-background">
          {/* Restart-on-save banner */}
          {isEdit && runtimeDirty && (
            <div className="flex items-start gap-2 px-6 pt-3 pb-1 text-body-sm text-[hsl(38_92%_70%)]">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                Saving will restart <span className="font-mono">{service!.name}</span> (~10s downtime).
              </span>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="h-9 px-4">
              {isEdit ? (runtimeDirty ? "Save & restart" : "Save changes") : "Create service"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
