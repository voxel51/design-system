import { renderHook } from "@testing-library/react";

import { belowBreakpoint, useBelowBreakpoint } from "./breakpoints";

describe("breakpoints", () => {
  it("writes the query for widths below a breakpoint", () => {
    expect(belowBreakpoint("sm")).toBe("(max-width: 639.98px)");
    expect(belowBreakpoint("lg")).toBe("(max-width: 1023.98px)");
  });

  it("reports whether the window is below a breakpoint", () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === "(max-width: 639.98px)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    expect(renderHook(() => useBelowBreakpoint("sm")).result.current).toBe(
      true
    );
    expect(renderHook(() => useBelowBreakpoint("md")).result.current).toBe(
      false
    );
  });
});
