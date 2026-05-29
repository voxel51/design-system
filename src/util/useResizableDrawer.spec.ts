import { act, renderHook } from "@testing-library/react";
import React from "react";

import { useResizableDrawer } from "./useResizableDrawer";

// invert=true (bottom/right drawer): dragging down (clientY increases) reduces
// size, dragging up increases it.
// delta = current - start; adjusted = -delta; raw = dragStartSize + adjusted
const defaultOptions = {
  axis: "vertical" as const,
  invert: true,
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

// Attach contentRef to a mock element with a given offsetHeight. Attaching
// triggers useElementSize's synchronous measure -> re-render -> the hook's
// per-commit layout effect, which syncs `size` to min(offsetHeight, maxSize)
// when the drawer is open and idle.
function attachContent(
  result: { current: ReturnType<typeof useResizableDrawer> },
  offsetHeight: number
): HTMLElement {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetHeight", {
    get: () => offsetHeight,
    configurable: true,
  });
  act(() => result.current.contentRef(el));
  return el;
}

function setOffsetHeight(el: HTMLElement, offsetHeight: number) {
  Object.defineProperty(el, "offsetHeight", {
    get: () => offsetHeight,
    configurable: true,
  });
}

describe("useResizableDrawer", () => {
  beforeEach(() => {
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

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

    it("starts at size 0 before content is measured", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      expect(result.current.size).toBe(0);
    });

    it("isDragging and animating are false initially", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      expect(result.current.isDragging).toBe(false);
      expect(result.current.animating).toBe(false);
    });
  });

  describe("contentRef auto-sizing", () => {
    it("syncs size to content height when open", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);
      expect(result.current.size).toBe(300);
    });

    it("clamps content height to maxSize", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 600);
      expect(result.current.size).toBe(400);
    });

    it("stays at 0 while closed even with content attached", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      attachContent(result, 300);
      expect(result.current.size).toBe(0);
    });

    it("updates size when content height changes while open", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      const el = attachContent(result, 300);
      expect(result.current.size).toBe(300);

      setOffsetHeight(el, 150);
      act(() => result.current.contentRef(el)); // re-measure
      expect(result.current.size).toBe(150);
    });
  });

  describe("toggle", () => {
    it("closes when open", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      act(() => result.current.toggle());
      expect(result.current.open).toBe(false);
    });

    it("opens when closed", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      act(() => result.current.toggle());
      expect(result.current.open).toBe(true);
    });

    it("sets size to 0 when closing", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);
      act(() => result.current.toggle());
      expect(result.current.size).toBe(0);
    });

    it("opens to content height (clamped to maxSize)", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      attachContent(result, 300);
      act(() => result.current.toggle());
      expect(result.current.size).toBe(300);
    });

    it("opens to maxSize when content exceeds it", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      attachContent(result, 600);
      act(() => result.current.toggle());
      expect(result.current.size).toBe(400);
    });

    it("sets animating=true on toggle", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      act(() => result.current.toggle());
      expect(result.current.animating).toBe(true);
    });

    it("forgets a manually dragged size when reopened (auto-sizes)", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);

      // manually shrink to 200, then close and reopen
      // delta=+100, adjusted=-100, raw=300-100=200
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 200);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(200);

      act(() => result.current.toggle()); // close
      act(() => result.current.toggle()); // reopen
      expect(result.current.size).toBe(300); // back to content height, no memory
    });
  });

  describe("onTransitionEnd", () => {
    it("clears animating once the transition ends", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      act(() => result.current.toggle());
      expect(result.current.animating).toBe(true);

      act(() => result.current.onTransitionEnd());
      expect(result.current.animating).toBe(false);
    });

    it("starting a drag clears animating (drags never animate)", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);
      act(() => result.current.toggle()); // animating = true
      expect(result.current.animating).toBe(true);

      pointerDown(result.current.dragHandleProps, 0); // onDragStart clears it
      expect(result.current.animating).toBe(false);

      pointerUp(result.current.dragHandleProps);
    });
  });

  describe("drag", () => {
    it("decreases size when dragged down (invert=true) and persists after release", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);
      // delta=+50, adjusted=-50, raw=250, clamped=min(250, auto=300)=250
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 150);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(250);
    });

    it("dragging up to the natural size re-enters auto mode", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300); // auto = 300
      // drag up past content: raw=340, clamped=min(340,300)=300 -> auto mode
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(300);
    });

    it("clamps to maxSize when content exceeds it", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 600); // auto = min(600, 400) = 400
      // drag up beyond max: raw=700, clamped=min(700, 400)=400
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, -200);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(400);
    });

    it("closes and resets to 0 when dragged below 0", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      attachContent(result, 300);
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 10000);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(false);
      expect(result.current.size).toBe(0);
    });

    it("reopens when dragged up while closed and persists", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, defaultOpen: false })
      );
      attachContent(result, 300); // closed -> size 0
      // drag up from 0: delta=-40, adjusted=+40, raw=40, clamped=min(40, 300)=40
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.open).toBe(true);
      expect(result.current.size).toBe(40);
    });

    it("a manually dragged size survives a content resize (clamped to content)", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      const el = attachContent(result, 300);
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 150); // -> 250
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(250);

      // content grows: manual 250 is still respected
      setOffsetHeight(el, 350);
      act(() => result.current.contentRef(el));
      expect(result.current.size).toBe(250);

      // content shrinks below the manual size: size follows content down
      setOffsetHeight(el, 180);
      act(() => result.current.contentRef(el));
      expect(result.current.size).toBe(180);
    });

    it("uses clientX for the horizontal axis", () => {
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, axis: "horizontal", invert: false })
      );
      attachContent(result, 600); // auto = 400 (maxSize)
      // non-inverted: clientX delta=-40, adjusted=-40, raw=360, clamped=min(360,400)=360
      pointerDown(result.current.dragHandleProps, 0, 100);
      pointerMove(result.current.dragHandleProps, 0, 60);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.size).toBe(360);
    });

    it("sets isDragging true between pointerDown and pointerUp", () => {
      const { result } = renderHook(() => useResizableDrawer(defaultOptions));
      pointerDown(result.current.dragHandleProps, 0);
      expect(result.current.isDragging).toBe(true);
      pointerUp(result.current.dragHandleProps);
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("calls onSizeChange with the clamped size on drag", () => {
      const onSizeChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, onSizeChange })
      );
      attachContent(result, 300);
      pointerDown(result.current.dragHandleProps, 100);
      pointerMove(result.current.dragHandleProps, 150); // -> 250
      pointerUp(result.current.dragHandleProps);
      expect(onSizeChange).toHaveBeenCalledWith(250);
    });

    it("calls onOpenChange when toggled closed", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, onOpenChange })
      );
      act(() => result.current.toggle());
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onOpenChange when closed by drag", () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useResizableDrawer({ ...defaultOptions, onOpenChange })
      );
      attachContent(result, 300);
      pointerDown(result.current.dragHandleProps, 0);
      pointerMove(result.current.dragHandleProps, 10000);
      pointerUp(result.current.dragHandleProps);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
