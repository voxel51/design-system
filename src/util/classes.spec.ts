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

  it("should ignore null/undefined values", () => {
    const expectedClasses = ["px-4", "mb-2"];
    const badClasses = [undefined, null, false, true];

    const result = cn(...[...expectedClasses, ...badClasses]);

    expectedClasses.forEach((className) => expect(result).toContain(className));
    badClasses.forEach((className) =>
      expect(result).not.toContain(`${className}`)
    );
  });

  it("should allow for conditional syntax", () => {
    const included = "px-5";
    const excluded = "py-5";
    // eslint-disable-next-line no-constant-binary-expression
    const result = cn(true && included, false && excluded);

    expect(result).toContain(included);
    expect(result).not.toContain(excluded);
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
