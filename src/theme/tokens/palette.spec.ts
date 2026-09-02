import { colors } from "./colors";
import { palettePool, paletteSlots } from "./palette";

describe("paletteSlots", () => {
  it("includes every numbered slot the tokens define", () => {
    const numbered = Object.keys(colors.dark.content.palette).filter((key) =>
      /^\d+$/.test(key)
    );

    expect(paletteSlots.dark).toHaveLength(numbered.length);
  });

  it("excludes the named aliases", () => {
    expect(paletteSlots.dark).not.toContain("orange");
    expect(paletteSlots.dark).not.toContain("teal");
  });

  it("orders slots numerically, not lexicographically", () => {
    // Object key order would put "10" before "2"; the pool must not
    const asNumbers = paletteSlots.dark.map(Number);

    expect(asNumbers).toEqual([...asNumbers].sort((a, b) => a - b));
  });
});

describe("palettePool", () => {
  it("resolves slots to their token values in order", () => {
    const palette: Record<string, string> = colors.dark.content.palette;

    expect(palettePool.dark).toEqual(
      paletteSlots.dark.map((slot) => palette[slot])
    );
  });

  it("covers both modes", () => {
    expect(palettePool.light).toEqual(
      paletteSlots.light.map(
        (slot) => (colors.light.content.palette as Record<string, string>)[slot]
      )
    );
  });

  it("holds only hex colors", () => {
    for (const color of [...palettePool.dark, ...palettePool.light]) {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});
