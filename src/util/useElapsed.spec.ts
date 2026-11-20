import { act, renderHook } from "@testing-library/react";

import { formatElapsed, useElapsed } from "./useElapsed";

describe("formatElapsed", () => {
  it.each([
    [12_000, "12 s"],
    [125_000, "2 min 5 s"],
    [3_780_000, "1 h 3 min"],
    [-5, "0 s"],
  ])("should format %p as %s", (ms, expected) => {
    expect(formatElapsed(ms)).toBe(expected);
  });
});

describe("useElapsed", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:10Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be null without a start", () => {
    const { result } = renderHook(() => useElapsed(null));

    expect(result.current).toBeNull();
  });

  it("should tick each second", () => {
    const { result } = renderHook(() => useElapsed("2026-01-01T00:00:00Z"));
    expect(result.current).toBe("10 s");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toBe("12 s");
  });

  it("should stop at the end", () => {
    const { result } = renderHook(() =>
      useElapsed("2026-01-01T00:00:00Z", true, "2026-01-01T00:00:04Z")
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current).toBe("4 s");
  });
});
