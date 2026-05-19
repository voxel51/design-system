import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Drawer from "./Drawer";

// HANDLE_SIZE(4) — jsdom doesn't measure real element heights,
// so headerHeight is always 0 and closedSize is always HANDLE_SIZE.
const CLOSED_SIZE = 4;

beforeEach(() => {
  Element.prototype.setPointerCapture = jest.fn();
  globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// jsdom's PointerEvent constructor doesn't propagate clientX/Y from its init
// object, so we create events via createEvent and patch the property directly.
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

const defaultProps = { defaultSize: 200, minSize: 50, maxSize: 400 };

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

    it("should wrap header output in a measured div", () => {
      const { container } = render(
        <Drawer
          {...defaultProps}
          header={(state) => <button onClick={state.toggle}>toggle</button>}
        />
      );
      const headerDiv = container.querySelector("[class*='header']");
      expect(headerDiv).toBeInTheDocument();
      expect(headerDiv).toContainElement(screen.getByRole("button"));
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
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE}px` });
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should restore saved size when toggled open via header", async () => {
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
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      // drag to save size=150 (delta=+50, adjusted=-50, raw=150)
      pointerDown(handle, 100);
      pointerMove(handle, 150);
      pointerUp(handle);

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button"));

      expect(root).toHaveStyle({ height: "150px" });
    });

    it("should not render a header wrapper when no header prop is provided", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(
        container.querySelector("[class*='header']")
      ).not.toBeInTheDocument();
    });
  });

  describe("open/close state", () => {
    it("should be open by default", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(container.firstChild).toHaveStyle({ height: "200px" });
    });

    it("should be closed when defaultOpen is false", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={false} />
      );
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE}px` });
    });

    it("should respect controlled open prop", () => {
      const { container } = render(<Drawer {...defaultProps} open={false} />);
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE}px` });
    });
  });

  describe("test attributes", () => {
    it("should expose data-testid=drawer on the root for queries", () => {
      render(<Drawer {...defaultProps} />);
      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });

    it("should reflect open state via data-state=open", () => {
      render(<Drawer {...defaultProps} defaultOpen={true} />);
      expect(screen.getByTestId("drawer")).toHaveAttribute("data-state", "open");
    });

    it("should reflect closed state via data-state=closed", () => {
      render(<Drawer {...defaultProps} defaultOpen={false} />);
      expect(screen.getByTestId("drawer")).toHaveAttribute(
        "data-state",
        "closed"
      );
    });

    it.each(["left", "right", "top", "bottom"] as const)(
      "should expose data-side=%s",
      (side) => {
        render(<Drawer {...defaultProps} side={side} />);
        expect(screen.getByTestId("drawer")).toHaveAttribute("data-side", side);
      }
    );
  });

  describe("dimension style", () => {
    it("should set height for bottom drawer when open", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      expect(container.firstChild).toHaveStyle({ height: "200px" });
    });

    it("should set height for bottom drawer when closed", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={false} />
      );
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE}px` });
    });

    it("should set width for left drawer when open", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="left" defaultOpen={true} />
      );
      expect(container.firstChild).toHaveStyle({ width: "200px" });
    });

    it("should set width for left drawer when closed", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="left" defaultOpen={false} />
      );
      expect(container.firstChild).toHaveStyle({ width: `${CLOSED_SIZE}px` });
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

    it("should decrease height when dragged down on a bottom drawer", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 150); // delta=+50, adjusted=-50 → 200-50=150
      pointerUp(handle);

      expect(root).toHaveStyle({ height: "150px" });
    });

    it("should increase height when dragged up on a bottom drawer", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 60); // delta=-40, adjusted=+40 → 200+40=240
      pointerUp(handle);

      expect(root).toHaveStyle({ height: "240px" });
    });

    it("should clamp height to maxSize", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, -9999);
      pointerUp(handle);

      expect(container.firstChild).toHaveStyle({ height: "400px" });
    });

    it("should clamp to raw size when above minSize", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const handle = getHandle(container);

      // delta=+140, adjusted=-140, raw=60 — above closeThreshold(4) and above minSize(50)
      pointerDown(handle, 100);
      pointerMove(handle, 240);
      pointerUp(handle);

      expect(container.firstChild).toHaveStyle({ height: "60px" });
    });

    it("should close when dragged past the close threshold", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 10000);
      pointerUp(handle);

      expect(root).toHaveStyle({ height: `${CLOSED_SIZE}px` });
    });

    it("should increase width when dragged right on a left drawer", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="left" defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      pointerDown(handle, 0, 100);
      pointerMove(handle, 0, 140); // delta=+40, adjusted=+40 → 200+40=240
      pointerUp(handle);

      expect(root).toHaveStyle({ width: "240px" });
    });
  });

  describe("transition", () => {
    it("should not set transition override when not dragging", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(container.firstChild).not.toHaveStyle({ transition: "none" });
    });

    it("should set transition to none while dragging", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      expect(container.firstChild).toHaveStyle({ transition: "none" });
    });

    it("should remove transition override after drag ends", () => {
      const { container } = render(
        <Drawer {...defaultProps} defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerUp(handle);
      expect(container.firstChild).not.toHaveStyle({ transition: "none" });
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

    it("should call onSizeChange when size changes via drag", () => {
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
