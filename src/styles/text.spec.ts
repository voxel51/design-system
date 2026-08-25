import { TextColor, TextVariant, Variant } from "@/types";

import { TEXT_STYLES, textColor, textStyles } from "./text";

describe("textStyles", () => {
  it("returns null when variant is falsy", () => {
    expect(textStyles(null as unknown as TextVariant)).toBeNull();
  });

  it.each(Object.values(TextVariant))(
    "returns correct class for %s",
    (variant) => {
      expect(textStyles(variant)).toBe(TEXT_STYLES[variant]);
    }
  );
});

describe("textColor", () => {
  it("returns undefined when variant is falsy", () => {
    expect(textColor(null as unknown as Variant)).toBeUndefined();
  });

  it("returns Primary for Variant.Primary", () => {
    expect(textColor(Variant.Primary)).toBe(TextColor.Primary);
  });

  it("returns Secondary for Variant.Secondary", () => {
    expect(textColor(Variant.Secondary)).toBe(TextColor.Secondary);
  });

  it("returns Success for Variant.Success", () => {
    expect(textColor(Variant.Success)).toBe(TextColor.Success);
  });

  it("returns Destructive for Variant.Danger", () => {
    expect(textColor(Variant.Danger)).toBe(TextColor.Failure);
  });

  it("returns Primary for Variant.Icon", () => {
    expect(textColor(Variant.Icon)).toBe(TextColor.Primary);
  });

  it("returns Primary for unmatched variant (default case)", () => {
    expect(textColor("unknown" as unknown as Variant)).toBe(TextColor.Primary);
  });
});
