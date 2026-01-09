import { finite, makeRangeValidator, nonNull } from "@/util/validators";

describe("validators", () => {
  describe("nonNull", () => {
    it("should return true for non-null values", () => {
      const nonNullValues = ["", 0, "test"];

      nonNullValues.forEach((value) => expect(nonNull(value)).toBeTruthy());
    });

    it("should return false for nullish values", () => {
      const nullValues = [null, undefined];

      nullValues.forEach((value) => expect(nonNull(value)).toBeFalsy());
    });
  });

  describe("finite", () => {
    it("should return true for finite values", () => {
      const finiteValues = [0, -1, 1e5, "6", 9.4, 1 / 3];

      finiteValues.forEach((value) => expect(finite(value)).toBeTruthy());
    });

    it("should return false for non-finite values", () => {
      const nonFiniteValues = ["inf", "-inf", null, undefined, NaN, ""];

      nonFiniteValues.forEach((value) => expect(finite(value)).toBeFalsy());
    });
  });

  describe("makeRangeValidator", () => {
    it("should return a validator", () => {
      const validator = makeRangeValidator(0, 5);
      expect(validator).not.toBeNull();
    });

    it("should enforce min and max bounds", () => {
      const min = 0;
      const max = 5;
      const validator = makeRangeValidator(min, max);

      const falsyValues = [
        min - 1,
        max + 1,
        "inf",
        "-inf",
        NaN,
        null,
        undefined,
      ];
      falsyValues.forEach((value) => expect(validator(value)).toBeFalsy());

      const truthyValues = [
        min,
        max,
        min + 1,
        max - 1,
        ((min + max) / 2).toString(),
      ];
      truthyValues.forEach((value) => expect(validator(value)).toBeTruthy());
    });
  });
});
