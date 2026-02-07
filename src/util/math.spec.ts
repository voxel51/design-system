import { truncate } from "@/util/math";

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
  });
});
