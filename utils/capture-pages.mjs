/**
 * Capture the same pages from teams-app and from the Lovable master, so the
 * two can be diffed side by side.
 *
 * Solves two problems at once: the local dev sign-in cannot be driven by hand
 * (it loops on a stale session), and a visual comparison needs both apps shot
 * under identical viewport and theme conditions.
 *
 * Produces, per page:
 *   <out>/teams/<name>.png      full-page screenshot
 *   <out>/lovable/<name>.png    the Lovable equivalent, where one exists
 *   <out>/video/*.webm          a recording of the teams run, for review
 *
 * Usage:
 *   node utils/capture-pages.mjs                     # both apps
 *   node utils/capture-pages.mjs --only teams
 *   TEAMS_URL=http://localhost:3000 node utils/capture-pages.mjs
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { resolve } from "path";

const TEAMS_URL = process.env.TEAMS_URL ?? "http://localhost:3000";
const LOVABLE_URL = process.env.LOVABLE_URL ?? "http://localhost:6098";
const OUT = resolve(process.env.OUT ?? "capture");
const VIEWPORT = { width: 1440, height: 900 };

const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

/**
 * Pages to shoot. `lovable` is the closest equivalent route in the master
 * project, or null where the surface only exists in one of the two.
 */
const PAGES = [
  // Derived from the master's route table, not hand-picked. See
  // `utils/route-coverage.ts`: curating this list by hand is what let the
  // dataset header go uncompared for a whole session.
  { name: "datasets", teams: "/datasets", lovable: "/" },
  { name: "dataset-samples", teams: "/datasets/quickstart/samples", lovable: "/dataset/pest-detection-1k" },
  { name: "dataset-annotate", teams: "/datasets/quickstart/annotate", lovable: "/annotation" },
  { name: "settings-account", teams: "/settings/account", lovable: "/settings/account" },
  { name: "settings-api-keys", teams: "/settings/api_keys", lovable: "/settings/api-keys" },
  { name: "settings-cloud-credentials", teams: "/settings/cloud_storage_credentials", lovable: "/settings/cloud-credentials" },
  { name: "settings-orchestrators", teams: "/settings/orchestrators", lovable: "/settings/orchestrators" },
  { name: "settings-services", teams: "/settings/services", lovable: "/settings/services" },
  { name: "settings-activity", teams: "/settings/activity", lovable: "/settings/activity" },
  { name: "settings-plugins", teams: "/settings/plugins", lovable: "/settings/plugins" },
  { name: "settings-secrets", teams: "/settings/secrets", lovable: "/settings/secrets" },
  { name: "settings-users", teams: "/settings/team/users", lovable: "/settings/users" },
  { name: "settings-service-accounts", teams: "/settings/team/service_accounts", lovable: "/settings/service-accounts" },
  { name: "settings-groups", teams: "/settings/team/groups", lovable: "/settings/groups" },
  { name: "settings-config", teams: "/settings/security/config", lovable: "/settings/config" },
  { name: "settings-roles", teams: "/settings/security/roles", lovable: "/settings/roles" },
  { name: "settings-metrics", teams: "/settings/observability/metrics", lovable: "/settings/metrics" },
];

/** Sign in through the lde dev-cas picker, which has no password. */
async function signIn(page) {
  await page.goto(`${TEAMS_URL}/datasets`, { waitUntil: "domcontentloaded" });
  const signInButton = page.locator('button[type="submit"]', { hasText: /sign in/i });
  if (await signInButton.count()) {
    await signInButton.first().click();
    await page.waitForLoadState("networkidle").catch(() => {});
  }
  // A second pass: the first submit sometimes lands back on the picker when a
  // stale session cookie is being replaced.
  if (await signInButton.count()) {
    await signInButton.first().click();
    await page.waitForLoadState("networkidle").catch(() => {});
  }
  return !(await signInButton.count());
}

async function shoot(page, url, file, label) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  } catch {
    // networkidle can never settle on a page with polling; a load is enough.
    await page.goto(url, { waitUntil: "load", timeout: 30_000 }).catch(() => {});
  }
  // Let fonts and any entrance animation settle before shooting.
  await page.waitForTimeout(1200);
  try {
    // `fullPage` re-lays-out the document and hangs on pages that virtualize
    // or grow while measuring — the samples grid does both. A viewport shot
    // still captures the chrome, which is what these comparisons are for.
    await page.screenshot({ path: file, fullPage: true, timeout: 15_000 });
  } catch {
    await page.screenshot({ path: file, timeout: 15_000 }).catch(() => {});
    console.log(`  ${label.padEnd(24)} ${url}  (viewport only)`);
    return;
  }
  console.log(`  ${label.padEnd(24)} ${url}`);
}

async function captureTeams() {
  mkdirSync(`${OUT}/teams`, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: `${OUT}/video`, size: VIEWPORT },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("teams-app:");
  const authed = await signIn(page);
  if (!authed) {
    console.log("  ! still on the sign-in page — captures will show it");
  }

  for (const p of PAGES) {
    await shoot(page, `${TEAMS_URL}${p.teams}`, `${OUT}/teams/${p.name}.png`, p.name);
  }

  await context.close();
  await browser.close();
  console.log(`  video → ${OUT}/video`);
}

async function captureLovable() {
  mkdirSync(`${OUT}/lovable`, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: "dark" });
  const page = await context.newPage();

  console.log("lovable:");
  for (const p of PAGES) {
    if (!p.lovable) continue;
    await shoot(page, `${LOVABLE_URL}${p.lovable}`, `${OUT}/lovable/${p.name}.png`, p.name);
  }

  await context.close();
  await browser.close();
}

if (only !== "lovable") await captureTeams();
if (only !== "teams") await captureLovable();
console.log(`\nwrote ${OUT}`);
