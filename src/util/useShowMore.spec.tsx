import { act, renderHook } from "@testing-library/react";

import { useShowMore } from "./useShowMore";

const items = Array.from({ length: 5 }, (_, i) => i);

describe("useShowMore", () => {
  it("shows the first items and counts the rest", () => {
    const { result } = renderHook(() => useShowMore(items, 3));

    expect(result.current.shown).toEqual([0, 1, 2]);
    expect(result.current.hidden).toBe(2);
    expect(result.current.open).toBe(false);
  });

  it("shows every item once toggled", () => {
    const { result } = renderHook(() => useShowMore(items, 3));

    act(() => result.current.toggle());

    expect(result.current.shown).toEqual(items);
    expect(result.current.open).toBe(true);
  });

  it("stays open while forced", () => {
    const { result } = renderHook(() => useShowMore(items, 3, true));

    expect(result.current.shown).toEqual(items);
    expect(result.current.hidden).toBe(0);
  });

  it("closes once the force clears", () => {
    const { result, rerender } = renderHook(
      ({ forced }) => useShowMore(items, 3, forced),
      { initialProps: { forced: true } }
    );

    rerender({ forced: false });

    expect(result.current.open).toBe(false);
    expect(result.current.hidden).toBe(2);
  });

  it("hides nothing when the items fit", () => {
    const { result } = renderHook(() => useShowMore(items, 10));

    expect(result.current.hidden).toBe(0);
    expect(result.current.shown).toEqual(items);
  });
});
