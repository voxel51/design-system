import { act, renderHook } from "@testing-library/react";
import { useResizableDrawer } from "./useResizableDrawer";

// Uses invert=true (bottom/right drawer): dragging down reduces size, dragging up increases it.
// delta = current - start; adjusted = -delta; raw = dragStartSize + adjusted
const defaultOptions = {
  axis: "vertical" as const,
  invert: true,
  defaultSize: 200,
  minSize: 50,
  maxSize: 400,
};

function pointerDown(
  handleProps: ReturnType<typeof useResizableDrawer>["dragHandleProps"],
  clientY = 0,
  clientX = 0
) {
  act(() => {
    handleProps.onPointerDown({
      clientY,
      clientX,
      pointerId: 1,
      currentTarget: { setPointerCapture: jest.fn() },
    } as unknown as React.PointerEvent<HTMLElement>);
  });
}

function pointerMove(
  handleProps: ReturnType<typeof useResizableDrawer>["dragHandleProps"],
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

function pointerUp(
  handleProps: ReturnType<typeof useResizableDrawer>["dragHandleProps"]
) {
  act(() => {
    handleProps.onPointerUp();
  });
}

describe("useResizableDrawer", () => {
  describe("initial state", () => {
    it("is open by default", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      expect(result.current.open).toBe(true);
    });

    it("respects defaultOpen=false", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      expect(result.current.open).toBe(false);
    });

    it("starts at defaultSize", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      expect(result.current.size).toBe(200);
    });

    it("isDragging is false initially", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("toggle", () => {
    it("closes when open", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      act(() => {
        result.current.toggle();
      });
      expect(result.current.open).toBe(false);
    });

    it("opens when closed", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      act(() => {
        result.current.toggle();
      });
      expect(result.current.open).toBe(true);
    });

    it("restores saved size on re-open after drag", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));

      // drag up from 100 to 60: delta=-40, adjusted=+40, raw=240
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(240);

      act(() => {
        result.current.toggle();
      });
      act(() => {
        result.current.toggle();
      });

      expect(result.current.size).toBe(240);
    });

    it("does not reset to defaultSize on re-open", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));

      // drag down from 0 to 50: delta=+50, adjusted=-50, raw=150
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 50);
      pointerUp(result.current.dragHandleProps);

      act(() => {
        result.current.toggle();
      });
      act(() => {
        result.current.toggle();
      });

      expect(result.current.size).toBe(150);
      expect(result.current.size).not.toBe(200);
    });
  });

  describe("drag", () => {
    it("increases size when dragged up (invert=true, negative delta)", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      // delta=-40, adjusted=+40, raw=240
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(240);
    });

    it("decreases size when dragged down (invert=true, positive delta)", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      // delta=+50, adjusted=-50, raw=150
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 150);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(150);
    });

    it("clamps to maxSize", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      // delta=-300, adjusted=+300, raw=500 → clamped to 400
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, -300);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(400);
    });

    it("clamps to minSize when raw is above closeThreshold", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      // delta=+160, adjusted=-160, raw=40 → above closeThreshold(0), below minSize(50) → 50
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 160);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(50);
    });

    it("uses clientX for horizontal axis", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({
          ...defaultOptions,
          axis: "horizontal",
          invert: false,
        })
      );
      // non-inverted horizontal: delta=+40, adjusted=+40, raw=240
      pointerDown(result.current.dragHandleProps, 0, 100);
      pointerMove(result.current.dragHandleProps, 0, 140);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(240);
    });

    it("reopens when dragged in the opening direction while closed", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      // drag up from closeThreshold(0): delta=-40, adjusted=+40, raw=40 → clamped to minSize(50)
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(true);
      expect(result.current.size).toBe(50);
    });

    it("does not change size when dragged further closed while already closed", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      // drag down: delta=+100, adjusted=-100, raw=-100 ≤ closeThreshold(0) → no-op (already closed)
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 100);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(false);
      expect(result.current.size).toBe(200);
    });
  });

  describe("close by drag", () => {
    it("closes when dragged past closeThreshold", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, closeThreshold: 28 })
      );
      // delta=+172, adjusted=-172, raw=28 ≤ 28 → close
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 172);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(false);
    });

    it("does not close when raw stays above closeThreshold", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, closeThreshold: 28 })
      );
      // delta=+100, adjusted=-100, raw=100 > 28 → stays open
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 100);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(true);
    });
  });

  describe("isDragging", () => {
    it("is true between pointerDown and pointerUp", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      pointerDown(result.current.dragHandleProps, 0);
      expect(result.current.isDragging).toBe(true);
    });

    it("is false after pointerUp", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      pointerDown(result.current.dragHandleProps, 0);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("calls onSizeChange when size changes via drag", () => {
      const onSizeChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, onSizeChange })
      );
      // delta=+50, adjusted=-50, raw=150
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 50);
      pointerUp(result.current.dragHandleProps);
      expect(onSizeChange).toHaveBeenCalledWith(150);
    });

    it("calls onOpenChange when closed by drag", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({
          ...defaultOptions,
          closeThreshold: 28,
          onOpenChange,
        })
      );
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 172);
      pointerUp(result.current.dragHandleProps);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onOpenChange when toggled closed", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, onOpenChange })
      );
      act(() => {
        result.current.toggle();
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
