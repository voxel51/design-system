import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Drawer from "./Drawer";

// jsdom doesn't lay out elements, so stub offsetHeight. The content element is
// what the hook measures; with this stub every element reports CONTENT_HEIGHT.
const CONTENT_HEIGHT = 200;

beforeEach(() => {
  Element.prototype.setPointerCapture = jest.fn();
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return CONTENT_HEIGHT;
    },
  });
  globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

function pointerDown(element: Element, clientY: number, clientX = 0) {
  const event = createEvent.pointerDown(element);
  Object.defineProperty(event, "clientY", {
    value: clientY,
    configurable: true,
  });
  Object.defineProperty(event, "clientX", {
    value: clientX,
    configurable: true,
  });
  fireEvent(element, event);
}

function pointerMove(element: Element, clientY: number, clientX = 0) {
  const event = createEvent.pointerMove(element);
  Object.defineProperty(event, "clientY", {
    value: clientY,
    configurable: true,
  });
  Object.defineProperty(event, "clientX", {
    value: clientX,
    configurable: true,
  });
  fireEvent(element, event);
}

function pointerUp(element: Element) {
  fireEvent.pointerUp(element);
}

function getHandle(container: HTMLElement) {
  return container.firstChild!.firstChild as HTMLElement;
}

function getContentWrapper(container: HTMLElement) {
  return container.querySelector("[class*='contentWrapper']") as HTMLElement;
}

const defaultProps = { maxSize: 400 };

describe("Drawer", () => {
  describe("rendering", () => {
    it("should render children", () => {
      render(
        <Drawer {...defaultProps}>
          <span>content</span>
        </Drawer>
      );
      expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("should apply className to the root element", () => {
      const { container } = render(
        <Drawer {...defaultProps} className="custom" />
      );
      expect(container.firstChild).toHaveClass("custom");
    });

    it("should apply style to the root element", () => {
      const { container } = render(
        <Drawer {...defaultProps} style={{ zIndex: 5 }} />
      );
      expect(container.firstChild).toHaveStyle({ zIndex: 5 });
    });
  });

  describe("side classes", () => {
    it("should apply bottom class by default", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(container.firstChild).toHaveClass("bottom");
    });

    it.each(["left", "right", "top", "bottom"] as const)(
      "should apply %s class when side is %s",
      (side) => {
        const { container } = render(<Drawer {...defaultProps} side={side} />);
        expect(container.firstChild).toHaveClass(side);
      }
    );
  });

  describe("mode classes", () => {
    it("should apply push class by default", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(container.firstChild).toHaveClass("push");
    });

    it("should apply float class when mode is float", () => {
      const { container } = render(<Drawer {...defaultProps} mode="float" />);
      expect(container.firstChild).toHaveClass("float");
      expect(container.firstChild).not.toHaveClass("push");
    });
  });

  describe("header render prop", () => {
    it("should render the header with open state and toggle", () => {
      render(
        <Drawer
          {...defaultProps}
          defaultOpen={true}
          header={(state) => (
            <button onClick={state.toggle} aria-expanded={state.open}>
              toggle
            </button>
          )}
        />
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("should pass open=false to header when closed", () => {
      render(
        <Drawer
          {...defaultProps}
          defaultOpen={false}
          header={(state) => (
            <button onClick={state.toggle} aria-expanded={state.open}>
              toggle
            </button>
          )}
        />
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should close the drawer when toggle is called via header", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Drawer
          {...defaultProps}
          defaultOpen={true}
          header={(state) => (
            <button onClick={state.toggle} aria-expanded={state.open}>
              toggle
            </button>
          )}
        />
      );
      await user.click(screen.getByRole("button"));
      expect(getContentWrapper(container)).toHaveStyle({ height: "0px" });
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should open to content height when toggled open via header", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Drawer
          {...defaultProps}
          defaultOpen={true}
          header={(state) => (
            <button onClick={state.toggle} aria-expanded={state.open}>
              toggle
            </button>
          )}
        />
      );
      await user.click(screen.getByRole("button")); // close
      await user.click(screen.getByRole("button")); // open
      expect(getContentWrapper(container)).toHaveStyle({
        height: `${CONTENT_HEIGHT}px`,
      });
    });

    it("should not render a header wrapper when no header prop is provided", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(
        container.querySelector("[class*='header']")
      ).not.toBeInTheDocument();
    });
  });

  describe("open/close state", () => {
    it("content wrapper is content-height tall when open", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(getContentWrapper(container)).toHaveStyle({
        height: `${CONTENT_HEIGHT}px`,
      });
    });

    it("content wrapper collapses to 0 when defaultOpen is false", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={false} />
      );
      expect(getContentWrapper(container)).toHaveStyle({ height: "0px" });
    });

    it("respects controlled open=false", () => {
      const { container } = render(<Drawer {...defaultProps} open={false} />);
      expect(getContentWrapper(container)).toHaveStyle({ height: "0px" });
    });
  });

  describe("dimension style", () => {
    it("uses width (not height) for a left drawer", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="left" defaultOpen={true} />
      );
      expect(getContentWrapper(container)).toHaveStyle({
        width: `${CONTENT_HEIGHT}px`,
      });
    });
  });

  describe("drag handle", () => {
    it("should have handleDisabled class when closed", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={false} />
      );
      expect(getHandle(container)).toHaveClass("handleDisabled");
    });

    it("should not have handleDisabled class when open", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={true} />
      );
      expect(getHandle(container)).not.toHaveClass("handleDisabled");
    });

    it("should decrease content height when dragged down, and persist after release", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 150); // delta=+50, adjusted=-50 -> 200-50=150
      pointerUp(handle);
      // a manual drag persists (it does not snap back to content height)
      expect(getContentWrapper(container)).toHaveStyle({ height: "150px" });
    });

    it("should close (handle disabled, height 0) when dragged shut", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 10000); // raw < 0 -> close
      pointerUp(handle);

      expect(getHandle(container)).toHaveClass("handleDisabled");
      expect(getContentWrapper(container)).toHaveStyle({ height: "0px" });
    });
  });

  describe("transition", () => {
    it("disables the transition when idle (auto-sized, not animating)", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(getContentWrapper(container)).toHaveStyle({ transition: "none" });
    });

    it("enables the transition while toggling (animating)", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Drawer
          {...defaultProps}
          defaultOpen={true}
          header={(state) => <button onClick={state.toggle}>toggle</button>}
        />
      );
      await user.click(screen.getByRole("button")); // toggle -> animating
      expect(getContentWrapper(container)).not.toHaveStyle({
        transition: "none",
      });
    });

    it("disables the transition again once the transition ends", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Drawer
          {...defaultProps}
          defaultOpen={true}
          header={(state) => <button onClick={state.toggle}>toggle</button>}
        />
      );
      await user.click(screen.getByRole("button"));
      fireEvent.transitionEnd(getContentWrapper(container));
      expect(getContentWrapper(container)).toHaveStyle({ transition: "none" });
    });

    it("disables the transition while dragging", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={true} />
      );
      const handle = getHandle(container);
      pointerDown(handle, 100);
      expect(getContentWrapper(container)).toHaveStyle({ transition: "none" });
      pointerUp(handle);
    });
  });

  describe("callbacks", () => {
    it("should call onOpenChange when toggled via header", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <Drawer
          {...defaultProps}
          onOpenChange={onOpenChange}
          header={(state) => <button onClick={state.toggle}>toggle</button>}
        />
      );
      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange when closed by drag", () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <Drawer
          {...defaultProps}
          onOpenChange={onOpenChange}
          defaultOpen={true}
        />
      );
      const handle = getHandle(container);
      pointerDown(handle, 100);
      pointerMove(handle, 10000);
      pointerUp(handle);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onSizeChange while dragging", () => {
      const onSizeChange = jest.fn();
      const { container } = render(
        <Drawer
          {...defaultProps}
          onSizeChange={onSizeChange}
          defaultOpen={true}
        />
      );
      const handle = getHandle(container);
      pointerDown(handle, 100);
      pointerMove(handle, 150);
      pointerUp(handle);
      expect(onSizeChange).toHaveBeenCalledWith(150);
    });
  });
});
