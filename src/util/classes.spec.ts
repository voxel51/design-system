import { cn } from "./classes";

describe("cn", () => {
  it("should combine class lists", () => {
    const classes = ["px-4 py-5", "mb-2"];

    const result = cn(...classes);
    for (const arg of classes) {
      arg
        .split(" ")
        .forEach((className) => expect(result).toContain(className));
    }
  });

  describe("class deduplication", () => {
    it("should dedupe conflicting classes", () => {
      const result = cn("border-0", "border-1");
      expect(result).not.toContain("border-0");
      expect(result).toContain("border-1");
    });

    it("should respect left-to-right precedence", () => {
      const classA = "border-0";
      const classB = "border-1";

      expect(cn(classA, classB)).toContain(classB);
      expect(cn(classB, classA)).toContain(classA);
    });
  });
});
