import { colors } from "./colors";
import { chartPool, overlayPool, paletteSlots } from "./palette";

/**
 * Written out rather than derived from `paletteSlots`. Rebuilding the
 * expectation with the thing under test is how the old numbered-slot spec
 * passed vacuously on an empty array when Figma renamed the slots.
 */
const EXPECTED_ORDER = [
  "blue",
  "green",
  "purple",
  "pink",
  "yellow",
  "teal",
  "red",
  "lime",
  "magenta",
  "neutral",
];

describe("paletteSlots", () => {
  it("is the hue order, verbatim", () => {
    expect([...paletteSlots]).toEqual(EXPECTED_ORDER);
  });

  it("covers every hue both viz groups define, and no others", () => {
    const chart = Object.keys(colors.dark.content["viz-chart"]).sort();
    const overlay = Object.keys(colors.dark.content["viz-overlay"]).sort();

    expect(chart).toEqual([...EXPECTED_ORDER].sort());
    expect(overlay).toEqual([...EXPECTED_ORDER].sort());
  });
});

describe("chartPool", () => {
  it("resolves hues to their token values in order", () => {
    const chart: Record<string, string> = colors.dark.content["viz-chart"];

    expect(chartPool.dark).toEqual(EXPECTED_ORDER.map((hue) => chart[hue]));
  });

  it("differs between modes — chart colors sit on a themed surface", () => {
    expect(chartPool.light).not.toEqual(chartPool.dark);
  });

  it("holds only hex colors", () => {
    for (const color of [...chartPool.dark, ...chartPool.light]) {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe("overlayPool", () => {
  it("resolves hues to their token values in order", () => {
    const overlay: Record<string, string> = colors.dark.content["viz-overlay"];

    expect(overlayPool).toEqual(EXPECTED_ORDER.map((hue) => overlay[hue]));
  });

  it("is identical in both modes — overlays sit on media, not on the UI", () => {
    const light: Record<string, string> = colors.light.content["viz-overlay"];

    expect(overlayPool).toEqual(EXPECTED_ORDER.map((hue) => light[hue]));
  });
});
