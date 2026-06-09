import ZIndex, { zIndexStyles } from "./zIndex";

describe("zIndexStyles", () => {
  it("returns 'z-auto' for ZIndex.Default", () => {
    expect(zIndexStyles(ZIndex.Default)).toBe("z-auto");
  });

  it.each([ZIndex.Low, ZIndex.Medium, ZIndex.High, ZIndex.AboveModal])(
    "returns a CSS var class for %s",
    (zIndex) => {
      expect(zIndexStyles(zIndex)).toBe(`z-[var(--z-${zIndex})]`);
    }
  );
});
