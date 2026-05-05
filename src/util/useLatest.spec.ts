import { renderHook } from "@testing-library/react";

import { useLatest } from "./useLatest";

describe("useLatest", () => {
  it("returns a ref containing the initial value", () => {
    const { result } = renderHook(() => useLatest(1));
    expect(result.current.current).toBe(1);
  });

  it("updates ref.current when the value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 1 },
    });
    expect(result.current.current).toBe(1);
    rerender({ value: 2 });
    expect(result.current.current).toBe(2);
    rerender({ value: 3 });
    expect(result.current.current).toBe(3);
  });

  it("preserves ref identity across rerenders", () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 1 },
    });
    const first = result.current;
    rerender({ value: 2 });
    rerender({ value: 3 });
    expect(result.current).toBe(first);
  });

  it("works with non-primitive values", () => {
    const a = { id: "a" };
    const b = { id: "b" };
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: a },
    });
    expect(result.current.current).toBe(a);
    rerender({ value: b });
    expect(result.current.current).toBe(b);
  });

  it("works with functions and lets a stable callback read the latest", () => {
    const fn1 = jest.fn<void, [string]>();
    const fn2 = jest.fn<void, [string]>();
    const { result, rerender } = renderHook(
      ({ fn }: { fn: (s: string) => void }) => useLatest(fn),
      { initialProps: { fn: fn1 as (s: string) => void } }
    );

    const stableHandler = (): void => result.current.current("payload");

    stableHandler();
    expect(fn1).toHaveBeenCalledWith("payload");
    expect(fn2).not.toHaveBeenCalled();

    rerender({ fn: fn2 });
    stableHandler();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledWith("payload");
  });

  it("supports undefined values", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number | undefined }) => useLatest(value),
      { initialProps: { value: undefined as number | undefined } }
    );
    expect(result.current.current).toBeUndefined();
    rerender({ value: 5 });
    expect(result.current.current).toBe(5);
    rerender({ value: undefined });
    expect(result.current.current).toBeUndefined();
  });
});
