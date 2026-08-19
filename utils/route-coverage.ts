/**
 * Enumerate every route in the Lovable master and report which ones have been
 * compared against teams-app.
 *
 * This exists because of a specific mistake. teams-app has one header
 * component that renders on every route, so I looked for one header in the
 * master, found `WorkspaceHeader`, and ported it. The master has two: the
 * workspace header, and a dataset header inside `AppShell` with a breadcrumb
 * and a segmented control. I never opened `/dataset/:id`, and my capture list
 * was eight hand-picked routes out of thirty-five, so the diff I was checking
 * could not have shown the difference.
 *
 * The root error was letting the *target's* architecture define the
 * comparison. The source of truth decides how many surfaces there are; a
 * one-component-to-one-component mapping assumed the answer.
 *
 * So: derive the route list from the master rather than curating it, and make
 * every uncompared surface visible instead of silently absent.
 *
 * Usage:
 *   tsx utils/route-coverage.ts [path-to-lovable-checkout]
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const SOURCE = resolve(process.argv[2] ?? "../fiftyone-copilot-internal");
const APP = resolve(SOURCE, "src/App.tsx");

if (!existsSync(APP)) {
  console.error(`Lovable checkout not found at ${SOURCE}.`);
  process.exit(2);
}

/**
 * Routes in the master mapped to their teams-app counterpart.
 *
 * `null` means the surface genuinely has no equivalent — a product gap, not a
 * conversion gap. Anything absent from this table is unclassified, which is
 * the state that let the dataset header slip.
 */
const TEAMS_ROUTE: Record<string, string | null> = {
  "/": "/datasets",
  "/dataset/:id": "/datasets/quickstart/samples",
  "/annotation": "/datasets/quickstart/annotate",
  "/video-annotation": null,
  "/work": null,
  "/models": null,
  "/models/:id": null,
  "/design-system": null,
  "/settings": "/settings/account",
  account: "/settings/account",
  "api-keys": "/settings/api_keys",
  "cloud-credentials": "/settings/cloud_storage_credentials",
  orchestrators: "/settings/orchestrators",
  services: "/settings/services",
  activity: "/settings/activity",
  billing: null,
  plugins: "/settings/plugins",
  secrets: "/settings/secrets",
  users: "/settings/team/users",
  "service-accounts": "/settings/team/service_accounts",
  groups: "/settings/team/groups",
  config: "/settings/security/config",
  roles: "/settings/security/roles",
  metrics: "/settings/observability/metrics",
  logs: null,
  // Demo scaffolding in the master, not product surfaces.
  "/settings-old": null,
  "/deployment": null,
  "/deployment/services": null,
  "/infrastructure": null,
  "/infrastructure/services": null,
  "/personal": null,
  "/personal/*": null,
  "/org": null,
  "/org/*": null,
  "*": null,
};

const src = readFileSync(APP, "utf8");
const routes = [...src.matchAll(/path="([^"]*)"/g)].map((m) => m[1]);

const compared: [string, string][] = [];
const productGap: string[] = [];
const unclassified: string[] = [];

for (const r of routes) {
  if (!(r in TEAMS_ROUTE)) {
    unclassified.push(r);
    continue;
  }
  const teams = TEAMS_ROUTE[r];
  if (teams) compared.push([r, teams]);
  else productGap.push(r);
}

console.log(`Lovable routes: ${routes.length}\n`);

console.log(`Comparable surfaces (${compared.length}):`);
for (const [l, t] of compared) console.log(`  ${l.padEnd(22)} → ${t}`);

console.log(`\nNo teams-app equivalent (${productGap.length}) — product gap, not conversion:`);
console.log(`  ${productGap.join(", ")}`);

if (unclassified.length) {
  console.error(`\nUNCLASSIFIED (${unclassified.length}) — a surface nobody has looked at:`);
  for (const r of unclassified) console.error(`  ${r}`);
  console.error(
    "\nAdd each to TEAMS_ROUTE, with null when there is genuinely no counterpart.",
  );
  process.exit(1);
}

console.log("\nEvery master route is classified.");
