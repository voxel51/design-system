/**
 * Copyright 2017-2026, Voxel51, Inc.
 */

import { act, fireEvent, renderHook } from "@testing-library/react";

import { useDraggable } from "./useDraggable";

// Helper: attach a container element with explicit dimensions to the document
// and return a cleanup function. The hook's containerRef needs a parentElement
// with clientWidth/clientHeight so the clamping logic works in jsdom.
function setupContainer(
  parentWidth = 800,
  parentHeight = 600,
  elWidth = 50,
  elHeight = 50
) {
  const parent = document.createElement("div");
  Object.defineProperty(parent, "clientWidth", { value: parentWidth });
  Object.defineProperty(parent, "clientHeight", { value: parentHeight });

  const el = document.createElement("div");
  Object.defineProperty(el, "offsetWidth", { value: elWidth });
  Object.defineProperty(el, "offsetHeight", { value: elHeight });

  parent.appendChild(el);
  document.body.appendChild(parent);

  return { parent, el, cleanup: () => document.body.removeChild(parent) };
}

describe("useDraggable", () => {
  describe("initial state", () => {
    it("starts at (0, 0) by default", () => {
      const { result } = renderHook(() => useDraggable());
      expect(result.current.position).toEqual({ x: 0, y: 0 });
    });

    it("respects initialX and initialY options", () => {
      const { result } = renderHook(() =>
        useDraggable({ initialX: 100, initialY: 200 })
      );
      expect(result.current.position).toEqual({ x: 100, y: 200 });
    });

    it("isDragging is false initially", () => {
      const { result } = renderHook(() => useDraggable());
      expect(result.current.isDragging).toBe(false);
    });

    it("returns a containerRef", () => {
      const { result } = renderHook(() => useDraggable());
      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });

    it("returns a handleDragStart function", () => {
      const { result } = renderHook(() => useDraggable());
      expect(typeof result.current.handleDragStart).toBe("function");
    });
  });

  describe("drag lifecycle", () => {
    it("sets isDragging to true on handleDragStart", () => {
      const { result } = renderHook(() => useDraggable());
      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      expect(result.current.isDragging).toBe(true);
    });

    it("sets isDragging to false on mouseup", () => {
      const { result } = renderHook(() => useDraggable());
      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseUp(document);
      });
      expect(result.current.isDragging).toBe(false);
    });

    it("does not start dragging when lockX and lockY are both true", () => {
      const { result } = renderHook(() =>
        useDraggable({ lockX: true, lockY: true })
      );
      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("position updates", () => {
    it("moves by the delta on mousemove", () => {
      const { result, el, cleanup } = (() => {
        const { el, cleanup } = setupContainer();
        const hook = renderHook(() =>
          useDraggable({ initialX: 20, initialY: 20 })
        );
        // Attach el so the hook can read offsetWidth/offsetHeight
        act(() => {
          (
            hook.result.current.containerRef as React.MutableRefObject<HTMLElement | null>
          ).current = el;
        });
        return { ...hook, el, cleanup };
      })();

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 30, clientY: 40 });
      });

      expect(result.current.position).toEqual({ x: 50, y: 60 });
      cleanup();
    });

    it("clamps position to 0 minimum", () => {
      const { result, el, cleanup } = (() => {
        const { el, cleanup } = setupContainer();
        const hook = renderHook(() =>
          useDraggable({ initialX: 10, initialY: 10 })
        );
        act(() => {
          (
            hook.result.current.containerRef as React.MutableRefObject<HTMLElement | null>
          ).current = el;
        });
        return { ...hook, el, cleanup };
      })();

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        // Move far past the left/top edge
        fireEvent.mouseMove(document, { clientX: -200, clientY: -200 });
      });

      expect(result.current.position.x).toBe(0);
      expect(result.current.position.y).toBe(0);
      cleanup();
    });

    it("clamps position to parent bounds maximum", () => {
      // parent 800×600, element 50×50 → max position is (750, 550)
      const { result, el, cleanup } = (() => {
        const { el, cleanup } = setupContainer(800, 600, 50, 50);
        const hook = renderHook(() =>
          useDraggable({ initialX: 20, initialY: 20 })
        );
        act(() => {
          (
            hook.result.current.containerRef as React.MutableRefObject<HTMLElement | null>
          ).current = el;
        });
        return { ...hook, el, cleanup };
      })();

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 10000, clientY: 10000 });
      });

      expect(result.current.position.x).toBe(750);
      expect(result.current.position.y).toBe(550);
      cleanup();
    });

    it("does not update X when lockX=true", () => {
      const { result, el, cleanup } = (() => {
        const { el, cleanup } = setupContainer();
        const hook = renderHook(() =>
          useDraggable({ initialX: 20, initialY: 20, lockX: true })
        );
        act(() => {
          (
            hook.result.current.containerRef as React.MutableRefObject<HTMLElement | null>
          ).current = el;
        });
        return { ...hook, el, cleanup };
      })();

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });

      expect(result.current.position.x).toBe(20);
      expect(result.current.position.y).toBe(120);
      cleanup();
    });

    it("does not update Y when lockY=true", () => {
      const { result, el, cleanup } = (() => {
        const { el, cleanup } = setupContainer();
        const hook = renderHook(() =>
          useDraggable({ initialX: 20, initialY: 20, lockY: true })
        );
        act(() => {
          (
            hook.result.current.containerRef as React.MutableRefObject<HTMLElement | null>
          ).current = el;
        });
        return { ...hook, el, cleanup };
      })();

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });

      expect(result.current.position.x).toBe(120);
      expect(result.current.position.y).toBe(20);
      cleanup();
    });

    it("does not move when not dragging", () => {
      const { result } = renderHook(() =>
        useDraggable({ initialX: 20, initialY: 20 })
      );
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });
      expect(result.current.position).toEqual({ x: 20, y: 20 });
    });
  });

  describe("portal mode", () => {
    it("clamps against window dimensions when portal=true", () => {
      // jsdom defaults: window.innerWidth=1024, window.innerHeight=768
      const { result } = renderHook(() =>
        useDraggable({ initialX: 20, initialY: 20, portal: true })
      );

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 10000, clientY: 10000 });
      });

      // element offsetWidth/Height default to 0 when containerRef is null,
      // so max = window.innerWidth - 0 = 1024, window.innerHeight - 0 = 768
      expect(result.current.position.x).toBe(window.innerWidth);
      expect(result.current.position.y).toBe(window.innerHeight);
    });
  });

  describe("event listener cleanup", () => {
    it("removes mousemove and mouseup listeners after mouseup", () => {
      const removeSpy = jest.spyOn(document, "removeEventListener");
      const { result } = renderHook(() => useDraggable());

      act(() => {
        result.current.handleDragStart({
          clientX: 0,
          clientY: 0,
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent);
      });
      act(() => {
        fireEvent.mouseUp(document);
      });

      expect(removeSpy).toHaveBeenCalledWith(
        "mousemove",
        expect.any(Function)
      );
      expect(removeSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
      removeSpy.mockRestore();
    });
  });
});
