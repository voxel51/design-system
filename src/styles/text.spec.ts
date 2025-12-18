import { TextVariant } from "@/types";
import { textStyles, textStylesStep } from "./text";

describe("textStylesStep", () => {
  describe("normal stepping", () => {
    it("should step forward by 1", () => {
      expect(textStylesStep(TextVariant.Sm, 1)).toBe(
        textStyles(TextVariant.Md)
      );
      expect(textStylesStep(TextVariant.Md, 1)).toBe(
        textStyles(TextVariant.Lg)
      );
      expect(textStylesStep(TextVariant.Xs, 1)).toBe(
        textStyles(TextVariant.Sm)
      );
    });

    it("should step backward by 1", () => {
      expect(textStylesStep(TextVariant.Md, -1)).toBe(
        textStyles(TextVariant.Sm)
      );
      expect(textStylesStep(TextVariant.Lg, -1)).toBe(
        textStyles(TextVariant.Md)
      );
      expect(textStylesStep(TextVariant.Xl, -1)).toBe(
        textStyles(TextVariant.Lg)
      );
    });
  });

  describe("boundary conditions", () => {
    it("should stick to first variant when stepping backward beyond bounds", () => {
      expect(textStylesStep(TextVariant.Xs, -10)).toBe(
        textStyles(TextVariant.Xxs)
      );
    });

    it("should stick to last variant when stepping forward beyond bounds", () => {
      const variants = Object.values(TextVariant);
      const lastVariant = variants[variants.length - 1];
      expect(textStylesStep(TextVariant.Md, 100)).toBe(textStyles(lastVariant));
    });
  });

  describe("edge cases", () => {
    it("should handle all variants", () => {
      const variants = Object.values(TextVariant);

      variants.forEach((variant) => {
        expect(textStylesStep(variant, 0)).toBe(textStyles(variant));
      });
    });
  });
});
