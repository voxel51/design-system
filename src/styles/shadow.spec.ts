import { ElementState } from "@/types/element";
import Shadow from "@/types/shadow";

import shadowStyles, { SHADOW_STYLES } from "./shadow";

describe("shadowStyles", () => {
  it("returns null when shadow is falsy", () => {
    expect(shadowStyles(undefined)).toBeNull();
  });

  it("returns the plain class when elementState is None", () => {
    expect(shadowStyles(Shadow.Md, ElementState.None)).toBe(
      SHADOW_STYLES[Shadow.Md]
    );
  });

  it("returns the plain class when no elementState is provided", () => {
    expect(shadowStyles(Shadow.Sm)).toBe(SHADOW_STYLES[Shadow.Sm]);
  });

  it("prefixes the class with element state when state is not None", () => {
    const result = shadowStyles(Shadow.Lg, ElementState.Hover);
    expect(result).toContain(SHADOW_STYLES[Shadow.Lg]);
    expect(result).toContain(ElementState.Hover);
  });

  it.each(Object.values(Shadow))(
    "SHADOW_STYLES contains a class for %s",
    (shadow) => {
      expect(SHADOW_STYLES[shadow]).toBeTruthy();
    }
  );
});
