import { act, renderHook } from "@testing-library/react";

import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  let matches: boolean;
  let listeners: Set<() => void>;

  beforeEach(() => {
    matches = false;
    listeners = new Set();
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      media: query,
      get matches() {
        return matches;
      },
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }));
  });

  it("reports the query and follows its changes", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));
    expect(result.current).toBe(false);

    act(() => {
      matches = true;
      listeners.forEach((fn) => fn());
    });

    expect(result.current).toBe(true);
  });

  it("stops listening on unmount", () => {
    const { unmount } = renderHook(() => useMediaQuery("(max-width: 600px)"));
    unmount();
    expect(listeners.size).toBe(0);
  });

  it("subscribes to nothing for a null query", () => {
    const { result } = renderHook(() => useMediaQuery(null));
    expect(result.current).toBe(false);
    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
