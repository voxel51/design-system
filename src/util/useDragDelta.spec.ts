import { act, renderHook } from "@testing-library/react";
import { useDragDelta } from "./useDragDelta";

function makeElement() {
  return { setPointerCapture: jest.fn() };
}

function pointerDown(
  handleProps: ReturnType<typeof useDragDelta>["handleProps"],
  clientY = 0,
  clientX = 0,
  currentTarget = makeElement()
) {
  act(() => {
    handleProps.onPointerDown({
      clientY,
      clientX,
      pointerId: 1,
      currentTarget,
    } as unknown as React.PointerEvent<HTMLElement>);
  });
  return currentTarget;
}

function pointerMove(
  handleProps: ReturnType<typeof useDragDelta>["handleProps"],
  clientY = 0,
  clientX = 0
) {
  act(() => {
    handleProps.onPointerMove({
      clientY,
      clientX,
    } as unknown as React.PointerEvent<HTMLElement>);
  });
}

function pointerUp(handleProps: ReturnType<typeof useDragDelta>["handleProps"]) {
  act(() => {
    handleProps.onPointerUp();
  });
}

describe("useDragDelta", () => {
  describe("initial state", () => {
    it("isDragging is false initially", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      expect(result.current.isDragging).toBe(false);
    });

    it("returns handleProps with onPointerDown, onPointerMove, and onPointerUp", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      expect(typeof result.current.handleProps.onPointerDown).toBe("function");
      expect(typeof result.current.handleProps.onPointerMove).toBe("function");
      expect(typeof result.current.handleProps.onPointerUp).toBe("function");
    });
  });

  describe("drag lifecycle", () => {
    it("sets isDragging to true on pointerDown", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      pointerDown(result.current.handleProps);
      expect(result.current.isDragging).toBe(true);
    });

    it("sets isDragging to false on pointerUp", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      pointerDown(result.current.handleProps);
      pointerUp(result.current.handleProps);
      expect(result.current.isDragging).toBe(false);
    });

    it("calls onDragStart on pointerDown", () => {
      const onDragStart = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn(), onDragStart })
      );
      pointerDown(result.current.handleProps);
      expect(onDragStart).toHaveBeenCalledTimes(1);
    });

    it("calls onDragEnd on pointerUp", () => {
      const onDragEnd = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn(), onDragEnd })
      );
      pointerDown(result.current.handleProps);
      pointerUp(result.current.handleProps);
      expect(onDragEnd).toHaveBeenCalledTimes(1);
    });

    it("does not call onDragStart or onDragEnd if not provided", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      // should not throw
      expect(() => {
        pointerDown(result.current.handleProps);
        pointerUp(result.current.handleProps);
      }).not.toThrow();
    });
  });

  describe("delta calculation — vertical axis", () => {
    it("reports delta as current - start on pointerMove", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta })
      );
      pointerDown(result.current.handleProps, 100);
      pointerMove(result.current.handleProps, 140);
      expect(onDelta).toHaveBeenCalledWith(40);
    });

    it("reports a negative delta when moving upward", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta })
      );
      pointerDown(result.current.handleProps, 100);
      pointerMove(result.current.handleProps, 60);
      expect(onDelta).toHaveBeenCalledWith(-40);
    });

    it("delta is always relative to the drag start, not the previous move", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta })
      );
      pointerDown(result.current.handleProps, 100);
      pointerMove(result.current.handleProps, 150); // delta = 50
      pointerMove(result.current.handleProps, 130); // delta = 30 (not -20)
      expect(onDelta).toHaveBeenNthCalledWith(1, 50);
      expect(onDelta).toHaveBeenNthCalledWith(2, 30);
    });

    it("does not call onDelta on pointerMove when not dragging", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta })
      );
      pointerMove(result.current.handleProps, 50);
      expect(onDelta).not.toHaveBeenCalled();
    });

    it("does not call onDelta after pointerUp", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta })
      );
      pointerDown(result.current.handleProps, 100);
      pointerUp(result.current.handleProps);
      pointerMove(result.current.handleProps, 150);
      expect(onDelta).not.toHaveBeenCalled();
    });
  });

  describe("delta calculation — horizontal axis", () => {
    it("uses clientX for horizontal axis", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "horizontal", onDelta })
      );
      pointerDown(result.current.handleProps, 0, 100);
      pointerMove(result.current.handleProps, 0, 160);
      expect(onDelta).toHaveBeenCalledWith(60);
    });

    it("ignores clientY movement on horizontal axis", () => {
      const onDelta = jest.fn();
      const { result } = renderHook(() =>
        useDragDelta({ axis: "horizontal", onDelta })
      );
      pointerDown(result.current.handleProps, 0, 100);
      pointerMove(result.current.handleProps, 999, 100); // Y moved a lot, X stayed
      expect(onDelta).toHaveBeenCalledWith(0);
    });
  });

  describe("pointer capture", () => {
    it("calls setPointerCapture on pointerDown", () => {
      const { result } = renderHook(() =>
        useDragDelta({ axis: "vertical", onDelta: jest.fn() })
      );
      const el = pointerDown(result.current.handleProps, 0);
      expect(el.setPointerCapture).toHaveBeenCalledWith(1);
    });
  });

  describe("callback ref stability", () => {
    it("calls the latest onDelta mid-drag after it is replaced between renders", () => {
      const first = jest.fn();
      const second = jest.fn();
      const { result, rerender } = renderHook(
        ({ onDelta }) => useDragDelta({ axis: "vertical", onDelta }),
        { initialProps: { onDelta: first } }
      );

      pointerDown(result.current.handleProps, 100);
      rerender({ onDelta: second });
      pointerMove(result.current.handleProps, 150);

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledWith(50);
    });

    it("calls the latest onDragEnd after it is replaced between renders", () => {
      const first = jest.fn();
      const second = jest.fn();
      const { result, rerender } = renderHook(
        ({ onDragEnd }) =>
          useDragDelta({ axis: "vertical", onDelta: jest.fn(), onDragEnd }),
        { initialProps: { onDragEnd: first } }
      );

      pointerDown(result.current.handleProps, 0);
      rerender({ onDragEnd: second });
      pointerUp(result.current.handleProps);

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });
  });
});
