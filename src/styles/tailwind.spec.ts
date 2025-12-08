import { BackgroundColor, TextColor } from "@/types";
import { bg, text } from "./tailwind";

describe("tailwind helper methods", () => {
  describe("text", () => {
    it("should return correct Tailwind text color class", () => {
      expect(text("#ffffff")).toBe("text-[#ffffff]");
    });

    it("should work with rgb colors", () => {
      expect(text("rgb(255, 255, 255)")).toBe("text-[rgb(255, 255, 255)]");
    });

    it("should work with named colors", () => {
      expect(text("red")).toBe("text-[red]");
    });

    it("should work with CSS variables", () => {
      expect(text("var(--color-primary)")).toBe("text-[var(--color-primary)]");
    });

    it("should return the color as-is when it is a valid Tailwind class", () => {
      expect(text(TextColor.Primary)).toBe(TextColor.Primary);
    });
  });

  describe("bg", () => {
    it("should return correct Tailwind background color class", () => {
      expect(bg("#ffffff")).toBe("bg-[#ffffff]");
    });

    it("should work with hex colors", () => {
      expect(bg("#000000")).toBe("bg-[#000000]");
    });

    it("should work with rgb colors", () => {
      expect(bg("rgb(255, 255, 255)")).toBe("bg-[rgb(255, 255, 255)]");
    });

    it("should work with named colors", () => {
      expect(bg("red")).toBe("bg-[red]");
    });

    it("should work with CSS variables", () => {
      expect(bg("var(--color-primary)")).toBe("bg-[var(--color-primary)]");
    });

    it("should return the color as-is when it is a valid Tailwind class", () => {
      expect(bg(BackgroundColor.Background)).toBe(BackgroundColor.Background);
    });
  });
});
