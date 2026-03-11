import { cleanFloat, truncate } from "@/util/math";

describe("math", () => {
  describe("truncate", () => {
    it("should truncate to the specified precision", () => {
      expect(truncate(0.12345, 0.1)).toBe(0.1);
      expect(truncate(0.12345, 0.01)).toBe(0.12);
      expect(truncate(0.12345, 0.001)).toBe(0.123);
      expect(truncate(0.12345, 0.0001)).toBe(0.1234);

      expect(truncate(0.12345, 0.0002)).toBe(0.1234);
      expect(truncate(0.12345, 0.002)).toBe(0.122);
    });

    it("should round down when precision splits values", () => {
      expect(truncate(0.12345, 0.002)).toBe(0.122);
    });

    it("should return NaN if precision is 0", () => {
      expect(truncate(0.123, 0)).toBeNaN();
    });

    it("should return as many digits as possible when precision exceeds significant figures", () => {
      expect(truncate(0.1, 0.001)).toBe(0.1);
      expect(truncate(0.12, 0.001)).toBe(0.12);
    });

    it("should not retain trailing 0s", () => {
      expect(truncate(0.30000000000000004, 0.001)).toBe(0.3);
    });
  });

  describe("cleanFloat", () => {
    it("should clean floats which would otherwise have precision errors", () => {
      expect(cleanFloat(0.1 + 0.2)).toBe(0.3);
      expect(cleanFloat(1.1 + 0.2)).toBe(1.3);
      expect(cleanFloat(123.1 + 0.2)).toBe(123.3);
    });

    it("should respect maxDigits with rounding", () => {
      expect(cleanFloat(0.123456789, 3)).toBe(0.123);
      expect(cleanFloat(0.123456789, 5)).toBe(0.12346); // rounded up
      expect(cleanFloat(0.123456789, 7)).toBe(0.1234568); // rounded up
      expect(cleanFloat(123456.123456789, 3)).toBe(123456.123);
      expect(cleanFloat(123456.123456789, 5)).toBe(123456.12346); // rounded up
      expect(cleanFloat(123456.123456789, 7)).toBe(123456.1234568); // rounded up
    });
  });
});
