/**
 * Read the colours the Lovable master actually renders, and diff them against
 * the colours teams-app renders on the same surfaces.
 *
 * Screenshots are a poor instrument for this. A header one step too light
 * looks fine on its own and only reads as wrong beside the master, and by then
 * the question is which of a dozen ancestors is painting it. This walks up
 * from each surface to the element that actually paints its background, so the
 * output names the element to change rather than the symptom.
 *
 * It reports rendered pixels, not tokens. A surface can reference the right
 * token and still paint the wrong colour, because an ancestor painted first
 * and the surface is transparent — which is exactly how the dataset header
 * ended up on `--card` while every class on it was correct.
 *
 * Usage:
 *   node utils/theme-probe.mjs                    # both apps, all surfaces
 *   node utils/theme-probe.mjs --only header
 *   TEAMS_URL=http://localhost:3000 node utils/theme-probe.mjs
 *
 * Exits non-zero when any paired surface differs, so it can gate a build.
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve } from "path";

const TEAMS_URL = process.env.TEAMS_URL ?? "http://localhost:3000";
const LOVABLE_URL = process.env.LOVABLE_URL ?? "http://localhost:6098";
const TOKENS = resolve(
  process.env.TOKENS ?? "src/v2/styles/tokens.css",
);
const VIEWPORT = { width: 1440, height: 900 };

const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

/**
 * Surfaces to compare, with the route and selector to find them on in each
 * app. Selectors differ because the two apps are not the same markup — the
 * point is to compare what a user sees in the same place, not to assert the
 * DOM matches.
 */
const SURFACES = [
  {
    name: "header",
    lovable: { path: "/dataset/pest-detection-1k", selector: "header" },
    teams: { path: "/datasets/quickstart/samples", selector: "header" },
  },
  {
    name: "workspace-header",
    lovable: { path: "/", selector: "header" },
    teams: { path: "/datasets", selector: "header" },
  },
  {
    name: "body",
    lovable: { path: "/", selector: "body" },
    teams: { path: "/datasets", selector: "body" },
    // Body height is however long the page's content is — the two apps hold
    // different data, so a difference here says nothing about the theme.
    compareHeight: false,
  },
  {
    name: "dataset-nav",
    lovable: { path: "/dataset/pest-detection-1k", selector: "header nav" },
    teams: { path: "/datasets/quickstart/samples", selector: "header nav" },
  },
];

/** Parse `--name: H S% L%;` pairs out of the token stylesheet, per theme. */
function readTokens() {
  const css = readFileSync(TOKENS, "utf8");
  const darkAt = css.search(/^\.dark,?$/m);
  const blocks = { light: css.slice(0, darkAt), dark: css.slice(darkAt) };
  const out = {};
  for (const [theme, block] of Object.entries(blocks)) {
    out[theme] = {};
    for (const [, name, value] of block.matchAll(
      /--([a-z0-9-]+):\s*([\d.]+\s+[\d.]+%\s+[\d.]+%)\s*;/g,
    )) {
      out[theme][name] = value;
    }
  }
  return out;
}

/** hsl triplet string to rgb, so tokens can be matched against rendered px. */
function hslToRgb(triplet) {
  const [h, s, l] = triplet
    .split(/\s+/)
    .map((p) => parseFloat(p.replace("%", "")));
  const sN = s / 100;
  const lN = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n) =>
    lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

/** Nearest token to a rendered `rgb(...)`, so output names the token. */
function nameColour(resolved, tokens) {
  // `probeInPage` hands back "r,g,b,a".
  const parts = String(resolved).split(",").map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  const px = parts.slice(0, 3);
  let best = null;
  for (const [name, triplet] of Object.entries(tokens)) {
    const t = hslToRgb(triplet);
    const d =
      Math.abs(t[0] - px[0]) + Math.abs(t[1] - px[1]) + Math.abs(t[2] - px[2]);
    if (!best || d < best.d) best = { name, d };
  }
  if (!best) return null;
  return best.d === 0 ? best.name : `~${best.name} (off by ${best.d})`;
}

/**
 * In the page: find the element, then walk up to whichever ancestor actually
 * paints its background. Returns that colour and the ancestor's identity.
 */
function probeInPage(selector) {
  const el = document.querySelector(selector);
  if (!el) return { missing: true };

  /**
   * Resolve any colour string to `r,g,b,a` by painting it.
   *
   * Tailwind 4 emits `oklab(...)` for alpha-modified colours where the
   * master's older build emits `rgba(...)`. The two are the same colour and
   * compare as different strings, so a naive diff cries wolf on every
   * `border-border/40` in the app.
   */
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const resolve = (value) => {
    if (!value) return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `${r},${g},${b},${(a / 255).toFixed(2)}`;
  };

  const own = getComputedStyle(el);
  let painter = el;
  let paint = own.backgroundColor;
  while (
    painter &&
    (!paint || paint === "rgba(0, 0, 0, 0)" || paint === "transparent")
  ) {
    painter = painter.parentElement;
    if (!painter) break;
    paint = getComputedStyle(painter).backgroundColor;
  }

  const id = (n) =>
    n
      ? `${n.tagName.toLowerCase()}${
          n.className ? "." + n.className.toString().trim().split(/\s+/).join(".").slice(0, 60) : ""
        }`
      : "(none)";

  return {
    background: resolve(paint),
    paintedBy: painter === el ? "self" : id(painter),
    color: resolve(own.color),
    borderBottomColor: resolve(own.borderBottomColor),
    // Width decides whether the colour means anything: with no border, the
    // computed colour is just inherited `currentColor` and comparing it is
    // noise.
    borderBottomWidth: parseFloat(own.borderBottomWidth) || 0,
    height: Math.round(el.getBoundingClientRect().height),
  };
}

async function signIn(page) {
  const button = page.locator('button[type="submit"]', {
    hasText: /sign in/i,
  });
  for (let i = 0; i < 2; i++) {
    if (await button.count()) {
      await button.first().click({ timeout: 30_000 }).catch(() => {});
      await page.waitForTimeout(8_000);
    }
  }
}

async function collect(page, baseUrl, surfaces, key, { authed = false } = {}) {
  const results = {};

  // Authenticate once, before probing anything. Signing in mid-loop redirects
  // away from the surface being measured, and every probe on that page then
  // reports "not found" — a tool failure that reads exactly like a real one.
  if (authed) {
    await page
      .goto(`${baseUrl}/datasets`, {
        waitUntil: "domcontentloaded",
        timeout: 180_000,
      })
      .catch(() => {});
    await signIn(page);
  }

  let current = null;
  for (const surface of surfaces) {
    const { path, selector } = surface[key];
    if (path !== current) {
      await page
        .goto(`${baseUrl}${path}`, {
          waitUntil: "domcontentloaded",
          timeout: 180_000,
        })
        .catch(() => {});
      current = path;
    }

    // Wait for the element rather than a fixed delay. A dev server recompiling
    // can take longer than any timeout worth hard-coding, and the failure mode
    // of guessing is a "not found" that reads as a missing component.
    const found = await page
      .waitForSelector(selector, { state: "attached", timeout: 120_000 })
      .then(() => true)
      .catch(() => false);

    if (!found) {
      results[surface.name] = { missing: true };
      continue;
    }

    // Then let layout settle — Relay and the samples grid resize after mount.
    await page.waitForTimeout(2_500);
    results[surface.name] = await page.evaluate(probeInPage, selector);
  }
  return results;
}

const tokens = readTokens();
const surfaces = only ? SURFACES.filter((s) => s.name === only) : SURFACES;
if (!surfaces.length) {
  console.error(`No surface named "${only}".`);
  process.exit(2);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  colorScheme: "dark",
});
const page = await context.newPage();

const lovable = await collect(page, LOVABLE_URL, surfaces, "lovable");
const teams = await collect(page, TEAMS_URL, surfaces, "teams", {
  authed: true,
});

await browser.close();

let mismatches = 0;
for (const surface of surfaces) {
  const l = lovable[surface.name];
  const t = teams[surface.name];
  console.log(`\n${surface.name}`);

  if (l.missing || t.missing) {
    console.log(
      `  not found in ${l.missing ? "the master" : ""}${
        l.missing && t.missing ? " and " : ""
      }${t.missing ? "teams-app" : ""}`,
    );
    mismatches++;
    continue;
  }

  const rows = [
    ["background", l.background, t.background, true],
    ["color", l.color, t.color, true],
  ];

  if (surface.compareHeight !== false) {
    rows.push(["height", `${l.height}px`, `${t.height}px`, false]);
  }

  if (l.borderBottomWidth || t.borderBottomWidth) {
    rows.push([
      "border-bottom",
      `${l.borderBottomWidth}px ${l.borderBottomColor}`,
      `${t.borderBottomWidth}px ${t.borderBottomColor}`,
      false,
    ]);
  }

  for (const [label, lv, tv, named] of rows) {
    const same = lv === tv;
    if (!same) mismatches++;
    const suffix = named
      ? `   [${nameColour(lv, tokens.dark)} vs ${nameColour(tv, tokens.dark)}]`
      : "";
    console.log(
      `  ${same ? "ok  " : "DIFF"} ${label.padEnd(14)} ${String(lv).padEnd(26)} ${String(tv).padEnd(26)}${suffix}`,
    );
  }

  if (l.paintedBy !== t.paintedBy) {
    console.log(`       painted by     ${l.paintedBy}`);
    console.log(`                      ${t.paintedBy}`);
  }
}

console.log(
  `\n${mismatches === 0 ? "Every probed surface matches." : `${mismatches} difference(s).`}`,
);
process.exit(mismatches === 0 ? 0 : 1);
