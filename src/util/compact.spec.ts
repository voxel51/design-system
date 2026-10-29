import { capLabels } from "./compact";

describe("capLabels", () => {
  it("cuts the widest label first", () => {
    expect(capLabels([100, 50, 40], 20, 30)).toBe(80);
  });

  it("evens out the widest labels once the widest reaches the next", () => {
    expect(capLabels([100, 80, 40], 40, 30)).toBe(70);
  });

  it("gives up below the minimum", () => {
    expect(capLabels([60, 50, 40], 100, 30)).toBeNull();
  });

  it("needs no cap when nothing is short", () => {
    expect(capLabels([60, 50], 0, 30)).toBeNull();
  });
});
