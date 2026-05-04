import { act, renderHook } from "@testing-library/react";

import { useElementSize } from "./useElementSize";

function makeElement(width: number, height: number) {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetWidth", {
    value: width,
    configurable: true,
  });
  Object.defineProperty(el, "offsetHeight", {
    value: height,
    configurable: true,
  });
  return el;
}

describe("useElementSize", () => {
  let observeFn: jest.Mock;
  let disconnectFn: jest.Mock;
  let roCallback: ResizeObserverCallback;

  beforeEach(() => {
    observeFn = jest.fn();
    disconnectFn = jest.fn();
<<<<<<< HEAD
    globalThis.ResizeObserver = jest
=======
    global.ResizeObserver = jest
>>>>>>> 7e67ff3 (lints)
      .fn()
      .mockImplementation((cb: ResizeObserverCallback) => {
        roCallback = cb;
        return { observe: observeFn, disconnect: disconnectFn };
      });
  });

  describe("initial state", () => {
    it("starts at zero before ref attaches", () => {
      const { result } = renderHook(() => useElementSize());
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
    });

    it("returns a ref callback", () => {
      const { result } = renderHook(() => useElementSize());
      expect(typeof result.current.ref).toBe("function");
    });
  });

  describe("ref attachment", () => {
    it("measures element dimensions on attach", () => {
      const { result } = renderHook(() => useElementSize());
      const el = makeElement(200, 100);

      act(() => {
        result.current.ref(el);
      });

      expect(result.current.width).toBe(200);
      expect(result.current.height).toBe(100);
    });

    it("creates a ResizeObserver and starts observing the element", () => {
      const { result } = renderHook(() => useElementSize());
      const el = makeElement(100, 50);

      act(() => {
        result.current.ref(el);
      });

      expect(globalThis.ResizeObserver).toHaveBeenCalledTimes(1);
      expect(observeFn).toHaveBeenCalledWith(el);
    });

    it("disconnects the previous observer when a new element is attached", () => {
      const { result } = renderHook(() => useElementSize());
      const el1 = makeElement(100, 50);
      const el2 = makeElement(200, 80);

      act(() => {
        result.current.ref(el1);
      });
      act(() => {
        result.current.ref(el2);
      });

      expect(disconnectFn).toHaveBeenCalledTimes(1);
      expect(globalThis.ResizeObserver).toHaveBeenCalledTimes(2);
    });

    it("disconnects the observer when ref is detached", () => {
      const { result } = renderHook(() => useElementSize());
      const el = makeElement(100, 50);

      act(() => {
        result.current.ref(el);
      });
      act(() => {
        result.current.ref(null);
      });

      expect(disconnectFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("resize updates", () => {
    it("updates dimensions when ResizeObserver fires", () => {
      const { result } = renderHook(() => useElementSize());
      const el = makeElement(100, 50);

      act(() => {
        result.current.ref(el);
      });

      Object.defineProperty(el, "offsetWidth", {
        value: 300,
        configurable: true,
      });
      Object.defineProperty(el, "offsetHeight", {
        value: 150,
        configurable: true,
      });

      act(() => {
        roCallback([], {} as ResizeObserver);
      });

      expect(result.current.width).toBe(300);
      expect(result.current.height).toBe(150);
    });

    it("reflects each successive resize", () => {
      const { result } = renderHook(() => useElementSize());
      const el = makeElement(100, 50);

      act(() => {
        result.current.ref(el);
      });

      Object.defineProperty(el, "offsetWidth", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(el, "offsetHeight", {
        value: 80,
        configurable: true,
      });
      act(() => {
        roCallback([], {} as ResizeObserver);
      });
      expect(result.current.width).toBe(200);

      Object.defineProperty(el, "offsetWidth", {
        value: 400,
        configurable: true,
      });
      Object.defineProperty(el, "offsetHeight", {
        value: 120,
        configurable: true,
      });
      act(() => {
        roCallback([], {} as ResizeObserver);
      });
      expect(result.current.width).toBe(400);
      expect(result.current.height).toBe(120);
    });
  });
});
