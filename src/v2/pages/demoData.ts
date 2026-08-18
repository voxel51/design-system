import { Boxes, Database, NotebookPen, Workflow, Zap } from "lucide-react";

import type { ActivityDimension, SeriesPoint } from "../components/patterns/activity";
import type { Collection, DatasetSummary } from "../components/patterns/datasets";
import type { Service } from "../components/patterns/services";
import type { Person, UserGroup } from "../lib/directory";

/**
 * Seed data for the page examples.
 *
 * Lives beside the pages, not inside any pattern: the design system renders
 * data, it does not carry any. Everything here is deterministic — no
 * `Date.now()`, no randomness — so Storybook snapshots and Chromatic
 * diffs stay stable across runs.
 */

/** Fixed clock, so "up for 3h" does not drift between builds. */
const NOW = Date.UTC(2026, 7, 18, 12, 0, 0);
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

export const PEOPLE: Person[] = [
  { id: "u_you", name: "Sejal Kotak", initials: "SK", email: "sejal@voxel51.com" },
  { id: "u_ritchie", name: "Ritchie Martori", initials: "RM", email: "ritchie@voxel51.com" },
  { id: "u_tim", name: "Tim Mendoza", initials: "TM", email: "tim@voxel51.com" },
  { id: "u_mike", name: "Michael O'Brien", initials: "MO", email: "michael.obrien@voxel51.com" },
];

export const GROUPS: UserGroup[] = [
  { id: "g_eng", name: "Engineering", memberIds: ["u_ritchie", "u_tim", "u_mike"] },
  { id: "g_design", name: "Design", memberIds: ["u_you"] },
];

export const GROUP_MEMBERS: Record<string, string[]> = Object.fromEntries(
  GROUPS.map((g) => [g.id, g.memberIds]),
);

export const SERVICES: Service[] = [
  {
    id: "argo-prod",
    name: "argo-prod",
    kindGroup: "Orchestrator",
    kindDetail: "Argo on Kubernetes",
    description: "Runs delegated operations for this workspace.",
    endpoint: "https://argo.internal:2746",
    version: "v3.5.1",
    icon: Workflow,
    accent: "indigo",
    deployment: "kubernetes",
    backend: "argo",
    scope: "global",
    origin: "builtin",
    status: "running",
    since: ago(3 * HOUR + 12 * MINUTE),
  },
  {
    id: "qdrant",
    name: "qdrant",
    kindGroup: "Vector index",
    description: "Similarity search over sample embeddings.",
    version: "v1.9.0",
    icon: Database,
    accent: "teal",
    deployment: "docker",
    backend: "qdrant",
    scope: "global",
    origin: "builtin",
    status: "running",
    since: ago(26 * HOUR),
  },
  {
    id: "jupyter",
    name: "jupyter",
    kindGroup: "Notebook server",
    description: "One notebook server per member.",
    icon: NotebookPen,
    accent: "amber",
    backend: "jupyter",
    scope: "per-user",
    origin: "builtin",
    status: "running",
    since: ago(45 * MINUTE),
    instances: [
      {
        id: "i-1",
        userId: "u_ritchie",
        userName: "Ritchie Martori",
        userEmail: "ritchie@voxel51.com",
        status: "running",
        since: ago(45 * MINUTE),
      },
      {
        id: "i-2",
        userId: "u_you",
        userName: "Sejal Kotak",
        userEmail: "sejal@voxel51.com",
        status: "stopped",
        since: ago(4 * HOUR),
      },
      {
        id: "i-3",
        userId: "u_tim",
        userName: "Tim Mendoza",
        userEmail: "tim@voxel51.com",
        status: "running",
        since: ago(2 * HOUR),
      },
    ],
  },
  {
    id: "ray-head",
    name: "ray-head",
    kindGroup: "Compute pool",
    kindDetail: "Ray on Kubernetes",
    description: "Shared GPU capacity for training runs.",
    icon: Boxes,
    accent: "rose",
    deployment: "kubernetes",
    backend: "ray",
    scope: "global",
    origin: "custom",
    status: "error",
    since: ago(12 * MINUTE),
  },
  {
    id: "triton",
    name: "triton",
    kindGroup: "Inference endpoint",
    description: "Model predictions for auto-labeling.",
    version: "v2.44",
    icon: Zap,
    accent: "violet",
    deployment: "kubernetes",
    backend: "python",
    scope: "global",
    origin: "custom",
    status: "stopped",
    since: ago(2 * 24 * HOUR),
  },
];

export const DATASETS: DatasetSummary[] = [
  {
    id: "berkeley-drive-annotate",
    name: "berkeley-drive-annotate",
    mediaCount: 2056,
    mediaUnit: "images",
    fields: 22,
    createdDaysAgo: 7,
    owner: "Brian Moore",
    tags: ["automotive", "dashboard", "demo"],
    hiddenTagCount: 5,
  },
  {
    id: "mmptrack-annotation-frames",
    name: "mmptrack-annotation-frames",
    mediaCount: 16908,
    mediaUnit: "images",
    fields: 22,
    createdDaysAgo: 7,
    owner: "Stefanie Moses",
    tags: [],
  },
  {
    id: "usgs-washington",
    name: "USGS-Washington",
    mediaCount: 23,
    mediaUnit: "scenes",
    fields: 15,
    createdDaysAgo: 7,
    owner: "Brian Moore",
    tags: ["GeoINT"],
  },
  {
    id: "diux-xview",
    name: "DIUx-XView",
    mediaCount: 1136,
    mediaUnit: "images",
    fields: 29,
    createdDaysAgo: 10,
    owner: "Mike DeCarlo",
    tags: ["GeoINT", "eval-demo", "geolocation"],
    hiddenTagCount: 1,
  },
  {
    id: "quickstart",
    name: "quickstart",
    mediaCount: 200,
    mediaUnit: "samples",
    fields: 12,
    createdDaysAgo: 30,
    owner: "Sejal Kotak",
    tags: ["demo"],
  },
  {
    id: "city-cams-multimodal",
    name: "city-cams-multimodal",
    mediaCount: 48,
    mediaUnit: "scenes",
    fields: 18,
    createdDaysAgo: 3,
    owner: "Ritchie Martori",
    tags: ["automotive", "video"],
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Automotive",
    color: "230 75% 62%",
    datasetIds: ["berkeley-drive-annotate", "city-cams-multimodal"],
    createdAt: 0,
    ownerId: "u_you",
    sharedWithAll: false,
    sharedUserIds: ["u_ritchie"],
    sharedGroupIds: [],
  },
  {
    id: "col-2",
    name: "GeoINT",
    color: "172 70% 45%",
    datasetIds: ["usgs-washington", "diux-xview"],
    createdAt: 0,
    ownerId: "u_you",
    sharedWithAll: true,
    sharedUserIds: [],
    sharedGroupIds: ["g_eng"],
  },
  {
    id: "col-3",
    name: "Benchmarks",
    color: "38 92% 55%",
    datasetIds: ["quickstart"],
    createdAt: 0,
    ownerId: "u_ritchie",
    sharedWithAll: false,
    sharedUserIds: ["u_you"],
    sharedGroupIds: [],
  },
];

const dim = (over: Partial<ActivityDimension> & Pick<ActivityDimension, "id" | "label" | "unit">): ActivityDimension => ({
  title: over.label,
  metered: true,
  billed: true,
  mineShare: 0.35,
  daily: 1000,
  growth: 0.2,
  ...over,
});

export const DIMENSIONS: ActivityDimension[] = [
  dim({
    id: "agent_tokens",
    label: "Agent tokens",
    title: "AI agent usage",
    unit: "tokens",
    measure: "tokens",
    daily: 182_000,
    limit: 10_000_000,
  }),
  dim({
    id: "inference",
    label: "Inference",
    title: "Model predictions",
    unit: "predictions",
    measure: "requests",
    daily: 24_500,
    limit: 1_000_000,
  }),
  dim({
    id: "api_requests",
    label: "API requests",
    title: "SDK and API calls",
    unit: "requests",
    measure: "requests",
    daily: 4200,
  }),
  dim({
    id: "managed_media",
    label: "Managed media",
    title: "Managed storage",
    unit: "GB",
    measure: "storage",
    daily: 12.5,
    snapshot: true,
    limit: 500,
  }),
  dim({
    id: "annotations",
    label: "Annotation edits",
    title: "Annotation edits",
    unit: "edits",
    daily: 860,
    limit: 100_000,
  }),
  dim({
    id: "samples",
    label: "Stored samples",
    title: "Stored samples",
    unit: "samples",
    daily: 20_371,
    snapshot: true,
    tenantOnly: true,
    billed: false,
  }),
];

/**
 * Deterministic daily series. A sine keeps the shape readable without a
 * random seed, so every build renders the same chart.
 */
export function seriesFor(dimension: ActivityDimension, days = 30): SeriesPoint[] {
  const seed = dimension.id.length;
  return Array.from({ length: days }, (_, i) => ({
    day: new Date(NOW - (days - 1 - i) * 24 * HOUR).toISOString().slice(0, 10),
    value: Math.round(
      dimension.daily * (0.72 + 0.42 * Math.abs(Math.sin((i + seed) / 3.5))),
    ),
  }));
}

/** Period total for a dimension: snapshots are a level, rates accumulate. */
export function totalFor(dimension: ActivityDimension, days = 30): number {
  const series = seriesFor(dimension, days);
  if (dimension.snapshot) return series[series.length - 1].value;
  return series.reduce((sum, p) => sum + p.value, 0);
}
