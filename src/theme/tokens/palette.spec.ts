import { colors } from "./colors";
import { palettePool, paletteSlots } from "./palette";

describe("paletteSlots", () => {
  it("includes every numbered slot the tokens define", () => {
    // pinned, not derived: computing the expectation with the same predicate
    // the implementation uses makes an empty pool pass. Bump when Figma adds
    // a slot.
    expect(paletteSlots.dark).toHaveLength(18);
    expect(paletteSlots.light).toHaveLength(18);
    expect(paletteSlots.dark[0]).toBe("1-brand");
  });

  it("orders by the numeric prefix, not lexicographically", () => {
    // "10-red" sorts before "2-blue" as a string; the pool must not
    expect(paletteSlots.dark.indexOf("2-blue")).toBeLessThan(
      paletteSlots.dark.indexOf("10-red")
    );
  });

  it("orders slots numerically across both modes", () => {
    const nums = (slots: readonly string[]) =>
      slots.map((slot) => Number(slot.split("-")[0]));

    for (const slots of [paletteSlots.dark, paletteSlots.light]) {
      const asNumbers = nums(slots);
      expect(asNumbers).toEqual([...asNumbers].sort((a, b) => a - b));
    }
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
