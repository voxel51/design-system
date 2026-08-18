import {
  Blocks,
  Boxes,
  CalendarClock,
  Database,
  HardDrive,
  Network,
  NotebookPen,
  ScanText,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * View-model for the Services pattern.
 *
 * These types come from the Lovable master's `mocks/services` module. The
 * mock *data* stays in the application; the shape does not — the pattern
 * renders it, so the pattern owns the contract. A caller maps its API
 * response onto `Service[]` and passes it in.
 */

export type ServiceScope = "global" | "per-user";
export type ServiceStatus =
  | "running"
  | "stopped"
  | "starting"
  | "stopping"
  | "error";
export type ServiceOrigin = "builtin" | "custom";

/** What kind of thing a service is. Fixed, small, chosen from a dropdown. */
export type ServiceKindGroup =
  | "Orchestrator"
  | "Scheduler"
  | "Plugin server"
  | "Notebook server"
  | "Vector index"
  | "Inference endpoint"
  | "Compute pool";

/** One user's instance of a `per-user` service. */
export interface ServiceInstance {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: ServiceStatus;
  /** ISO timestamp of the last status transition. */
  since: string;
}

export interface Service {
  /** Instance name typed by the admin — e.g. "argo-prod". Doubles as id. */
  id: string;
  name: string;
  kindGroup: ServiceKindGroup;
  /** Backend or flavor detail — e.g. "Argo on Kubernetes", "Qdrant". */
  kindDetail?: string;
  description: string;
  endpoint?: string;
  version?: string;
  icon: LucideIcon;
  accent: ServiceAccent;
  /** Where the service runs. Drives the deployment brand badge. */
  deployment?: "kubernetes" | "docker" | "process";
  /** Software powering the service. Drives the backend brand badge. */
  backend?: "argo" | "airflow" | "ray" | "dask" | "qdrant" | "jupyter" | "python";
  scope: ServiceScope;
  origin: ServiceOrigin;
  status: ServiceStatus;
  /** ISO timestamp of the last status transition. */
  since: string;
  /** Present on `per-user` services. Renders as expandable child rows. */
  instances?: ServiceInstance[];
  image?: string;
  command?: string;
  port?: number;
  autoStart?: boolean;
}

export type ServiceAccent =
  | "violet"
  | "indigo"
  | "cyan"
  | "teal"
  | "emerald"
  | "amber"
  | "rose"
  | "slate";

/**
 * Per-accent class sets for the service icon tile.
 *
 * Carried over from the Lovable master unchanged, arbitrary HSL values and
 * all. These predate the categorical `--palette-*` tokens and should move
 * onto them, but not in the same change as the port: swapping them here
 * would mean the ported page no longer matches the mock it was ported from,
 * which is exactly the drift this exercise is trying to remove.
 */
export const accentClasses: Record<
  ServiceAccent,
  { bg: string; fg: string; ring: string; solid: string; hsl: string }
> = {
  violet: {
    bg: "bg-[hsl(265_80%_65%_/_0.14)]",
    fg: "text-[hsl(265_85%_75%)]",
    ring: "ring-[hsl(265_85%_70%_/_0.3)]",
    solid: "bg-[hsl(265_80%_65%)]",
    hsl: "265 80% 65%",
  },
  indigo: {
    bg: "bg-[hsl(230_75%_65%_/_0.14)]",
    fg: "text-[hsl(230_85%_75%)]",
    ring: "ring-[hsl(230_85%_70%_/_0.3)]",
    solid: "bg-[hsl(230_75%_62%)]",
    hsl: "230 75% 62%",
  },
  cyan: {
    bg: "bg-[hsl(190_85%_55%_/_0.14)]",
    fg: "text-[hsl(190_85%_68%)]",
    ring: "ring-[hsl(190_85%_60%_/_0.3)]",
    solid: "bg-[hsl(190_85%_55%)]",
    hsl: "190 85% 55%",
  },
  teal: {
    bg: "bg-[hsl(172_70%_45%_/_0.14)]",
    fg: "text-[hsl(172_70%_60%)]",
    ring: "ring-[hsl(172_70%_50%_/_0.3)]",
    solid: "bg-[hsl(172_70%_45%)]",
    hsl: "172 70% 45%",
  },
  emerald: {
    bg: "bg-[hsl(150_60%_45%_/_0.14)]",
    fg: "text-[hsl(150_65%_60%)]",
    ring: "ring-[hsl(150_60%_50%_/_0.3)]",
    solid: "bg-[hsl(150_60%_50%)]",
    hsl: "150 60% 50%",
  },
  amber: {
    bg: "bg-[hsl(38_92%_55%_/_0.14)]",
    fg: "text-[hsl(38_92%_65%)]",
    ring: "ring-[hsl(38_92%_55%_/_0.3)]",
    solid: "bg-[hsl(38_92%_55%)]",
    hsl: "38 92% 55%",
  },
  rose: {
    bg: "bg-[hsl(340_82%_60%_/_0.14)]",
    fg: "text-[hsl(340_85%_72%)]",
    ring: "ring-[hsl(340_85%_60%_/_0.3)]",
    solid: "bg-[hsl(340_82%_60%)]",
    hsl: "340 82% 60%",
  },
  slate: {
    bg: "bg-[hsl(220_15%_55%_/_0.14)]",
    fg: "text-[hsl(220_15%_72%)]",
    ring: "ring-[hsl(220_15%_60%_/_0.3)]",
    solid: "bg-[hsl(220_15%_55%)]",
    hsl: "220 15% 55%",
  },
};

/** Selectable service kinds, in menu order. */
export const kindGroups: ServiceKindGroup[] = [
  "Orchestrator",
  "Scheduler",
  "Plugin server",
  "Notebook server",
  "Vector index",
  "Inference endpoint",
  "Compute pool",
];

/** Default icon per kind, used when a service does not carry its own. */
export const kindIcon: Record<ServiceKindGroup, LucideIcon> = {
  Orchestrator: Workflow,
  Scheduler: CalendarClock,
  "Plugin server": Blocks,
  "Notebook server": NotebookPen,
  "Vector index": Database,
  "Inference endpoint": Zap,
  "Compute pool": Boxes,
};

/** Icons for substrate badges not covered by `kindIcon`. */
export const substrateIcon = { Network, HardDrive, ScanText };

/**
 * Humanize the gap between `iso` and now: "just now", "8m", "3h 12m",
 * "2d 4h". Coarse by design — the row shows uptime, not a duration field.
 */
export function formatSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
