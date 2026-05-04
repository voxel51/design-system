import { act, renderHook } from "@testing-library/react";

import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  describe("uncontrolled", () => {
    it("seeds value from initializer", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 7 })
      );
      expect(result.current[0]).toBe(7);
    });

    it("calls initializer lazily and only once", () => {
      const initializer = jest.fn(() => "init");
      const { rerender } = renderHook(() =>
        useControllableState({ initializer })
      );
      rerender();
      rerender();
      expect(initializer).toHaveBeenCalledTimes(1);
    });

    it("updates internal value on change", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0 })
      );
      act(() => {
        result.current[1](42);
      });
      expect(result.current[0]).toBe(42);
    });

    it("invokes onChange with the next value", () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0, onChange })
      );
      act(() => {
        result.current[1](42);
      });
      expect(onChange).toHaveBeenCalledWith(42);
    });

    it("supports successive updates", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0 })
      );
      act(() => {
        result.current[1](1);
      });
      act(() => {
        result.current[1](2);
      });
      act(() => {
        result.current[1](3);
      });
      expect(result.current[0]).toBe(3);
    });
  });

  describe("controlled", () => {
    it("returns the controlled value", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0, value: 99 })
      );
      expect(result.current[0]).toBe(99);
    });

    it("ignores onChange writes for internal state", () => {
      const { result } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0, value: 99 })
      );
      act(() => {
        result.current[1](123);
      });
      expect(result.current[0]).toBe(99);
    });

    it("still invokes onChange when controlled", () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState<number>({
          initializer: () => 0,
          onChange,
          value: 99,
        })
      );
      act(() => {
        result.current[1](123);
      });
      expect(onChange).toHaveBeenCalledWith(123);
    });

    it("reflects changes to the controlled value across rerenders", () => {
      const { result, rerender } = renderHook(
        ({ value }) =>
          useControllableState<number>({ initializer: () => 0, value }),
        { initialProps: { value: 1 } }
      );
      expect(result.current[0]).toBe(1);
      rerender({ value: 2 });
      expect(result.current[0]).toBe(2);
    });
  });

  describe("mode transitions", () => {
    it("switches from uncontrolled to controlled", () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: number | undefined }) =>
          useControllableState<number>({ initializer: () => 0, value }),
        { initialProps: { value: undefined as number | undefined } }
      );
      act(() => {
        result.current[1](5);
      });
      expect(result.current[0]).toBe(5);
      rerender({ value: 99 });
      expect(result.current[0]).toBe(99);
    });

    it("falls back to last internal value when switching from controlled to uncontrolled", () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: number | undefined }) =>
          useControllableState<number>({ initializer: () => 0, value }),
        { initialProps: { value: 99 as number | undefined } }
      );
      expect(result.current[0]).toBe(99);
      rerender({ value: undefined });
      expect(result.current[0]).toBe(0);
    });
  });

  describe("identity", () => {
    it("returns a stable tuple when inputs are unchanged", () => {
      const onChange = jest.fn();
      const { result, rerender } = renderHook(() =>
        useControllableState<number>({ initializer: () => 0, onChange })
      );
      const first = result.current;
      rerender();
      expect(result.current).toBe(first);
    });
  });
});
