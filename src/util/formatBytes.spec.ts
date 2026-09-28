import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it.each([
    [512, "512 B"],
    [2048, "2 KB"],
    [5 * 1024 ** 2, "5.0 MB"],
    [3 * 1024 ** 3, "3.0 GB"],
  ])("formats %d as %s", (bytes, text) => {
    expect(formatBytes(bytes)).toBe(text);
  });
});
