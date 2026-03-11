import { isNullish } from "./type-check";

describe("type-check", () => {
  describe("isNullish", () => {
    it("should return false for non-nullish values", () => {
      expect(isNullish("")).toBe(false);
      expect(isNullish(0)).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish([])).toBe(false);
      expect(isNullish({})).toBe(false);
    });

    it("should return true for nullish values", () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });
  });
});
