import { getPageWindow } from "./pageWindow";

describe("getPageWindow", () => {
  it("lists every page when they fit", () => {
    expect(getPageWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the end", () => {
    expect(getPageWindow(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 20]);
  });

  it("collapses the start", () => {
    expect(getPageWindow(20, 20)).toEqual([
      1,
      "ellipsis-start",
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it("collapses both sides", () => {
    expect(getPageWindow(10, 20)).toEqual([
      1,
      "ellipsis-start",
      9,
      10,
      11,
      "ellipsis-end",
      20,
    ]);
  });

  it("shows a lone hidden page as a number", () => {
    expect(getPageWindow(4, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 20]);
  });
});
