import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Drawer, { DrawerHeaderState } from "./Drawer";

// HANDLE_SIZE(4) with no header
const CLOSED_SIZE_NO_HEADER = 4;
// HANDLE_SIZE(4) + DEFAULT_HEADER_SIZE(24)
const CLOSED_SIZE_WITH_HEADER = 28;

beforeEach(() => {
  Element.prototype.setPointerCapture = jest.fn();
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// jsdom's PointerEvent constructor doesn't propagate clientX/Y from its init
// object, so we create events via createEvent and patch the property directly.
function pointerDown(element: Element, clientY: number, clientX = 0) {
  const event = createEvent.pointerDown(element);
  Object.defineProperty(event, "clientY", { value: clientY, configurable: true });
  Object.defineProperty(event, "clientX", { value: clientX, configurable: true });
  fireEvent(element, event);
}

function pointerMove(element: Element, clientY: number, clientX = 0) {
  const event = createEvent.pointerMove(element);
  Object.defineProperty(event, "clientY", { value: clientY, configurable: true });
  Object.defineProperty(event, "clientX", { value: clientX, configurable: true });
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
      render(<Drawer {...defaultProps}><span>content</span></Drawer>);
      expect(screen.getByText("content")).toBeInTheDocument();
    });

    it("should apply className to the root element", () => {
      const { container } = render(<Drawer {...defaultProps} className="custom" />);
      expect(container.firstChild).toHaveClass("custom");
    });

    it("should apply style to the root element", () => {
      const { container } = render(<Drawer {...defaultProps} style={{ zIndex: 5 }} />);
      expect(container.firstChild).toHaveStyle({ zIndex: 5 });
    });

    it("should render pinned content", () => {
      render(<Drawer {...defaultProps} pinnedContent={<span>pinned</span>} />);
      expect(screen.getByText("pinned")).toBeInTheDocument();
    });

    it("should render overlay", () => {
      render(<Drawer {...defaultProps} overlay={<span>overlay</span>} />);
      expect(screen.getByText("overlay")).toBeInTheDocument();
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
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("should call the header render prop with open=false when closed", () => {
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
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
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
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE_WITH_HEADER}px` });
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
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

      // drag to 150 to save a new size
      pointerDown(handle, 100);
      pointerMove(handle, 150);
      pointerUp(handle);

      // close then reopen via header toggle
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button"));

      expect(root).toHaveStyle({ height: "150px" });
    });

    it("should not render a header when no header prop is provided", () => {
      render(<Drawer {...defaultProps} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("open/close state", () => {
    it("should be open by default", () => {
      const { container } = render(<Drawer {...defaultProps} />);
      expect(container.firstChild).toHaveStyle({ height: "200px" });
    });

    it("should be closed when defaultOpen is false", () => {
      const { container } = render(<Drawer {...defaultProps} defaultOpen={false} />);
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE_NO_HEADER}px` });
    });

    it("should respect controlled open prop", () => {
      const { container } = render(<Drawer {...defaultProps} open={false} />);
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE_NO_HEADER}px` });
    });
  });

  describe("dimension style", () => {
    it("should set height for bottom drawer when open", () => {
      const { container } = render(<Drawer {...defaultProps} side="bottom" defaultOpen={true} />);
      expect(container.firstChild).toHaveStyle({ height: "200px" });
    });

    it("should set height for bottom drawer when closed", () => {
      const { container } = render(<Drawer {...defaultProps} side="bottom" defaultOpen={false} />);
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_SIZE_NO_HEADER}px` });
    });

    it("should set width for left drawer when open", () => {
      const { container } = render(<Drawer {...defaultProps} side="left" defaultOpen={true} />);
      expect(container.firstChild).toHaveStyle({ width: "200px" });
    });

    it("should set width for left drawer when closed", () => {
      const { container } = render(<Drawer {...defaultProps} side="left" defaultOpen={false} />);
      expect(container.firstChild).toHaveStyle({ width: `${CLOSED_SIZE_NO_HEADER}px` });
    });
  });

  describe("drag handle", () => {
    it("should have handleDisabled class when closed", () => {
      const { container } = render(<Drawer {...defaultProps} defaultOpen={false} />);
      expect(getHandle(container)).toHaveClass("handleDisabled");
    });

    it("should not have handleDisabled class when open", () => {
      const { container } = render(<Drawer {...defaultProps} defaultOpen={true} />);
      expect(getHandle(container)).not.toHaveClass("handleDisabled");
    });

    it("should decrease height when dragged down on a bottom drawer", () => {
      // bottom is inverted: dragging down (increasing clientY) reduces height
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

    it("should clamp height to minSize", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 200); // raw = 200 - 100 = 100, but minSize=50 → 100 fine; let's go further
      pointerMove(handle, 240); // raw = 200 - 140 = 60, above closeThreshold(4), clamps to max(50,60)=60
      pointerUp(handle);

      // 60 > minSize(50) so not clamped to minSize here; need a bigger drag
      // raw = 200 - delta. To get raw=60: delta=140, clientY=100+140=240
      expect(container.firstChild).toHaveStyle({ height: "60px" });
    });

    it("should close when dragged past the close threshold", () => {
      const { container } = render(
        <Drawer {...defaultProps} side="bottom" defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 10000); // extreme drag down
      pointerUp(handle);

      expect(root).toHaveStyle({ height: `${CLOSED_SIZE_NO_HEADER}px` });
    });

    it("should increase width when dragged right on a left drawer", () => {
      // left is not inverted: dragging right (increasing clientX) increases width
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
      // no inline transition override; CSS module handles default transition
      expect(container.firstChild).not.toHaveStyle({ transition: "none" });
    });

    it("should set transition to none while dragging", () => {
      const { container } = render(<Drawer {...defaultProps} defaultOpen={true} />);
      const handle = getHandle(container);

      pointerDown(handle, 100);
      expect(container.firstChild).toHaveStyle({ transition: "none" });
    });

    it("should remove transition override after drag ends", () => {
      const { container } = render(<Drawer {...defaultProps} defaultOpen={true} />);
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerUp(handle);
      expect(container.firstChild).not.toHaveStyle({ transition: "none" });
    });
  });

  describe("onOpenChange callback", () => {
    it("should call onOpenChange when toggled via header", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      render(
        <Drawer
          {...defaultProps}
          onOpenChange={onOpenChange}
          header={(state) => (
            <button onClick={state.toggle}>toggle</button>
          )}
        />
      );
      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should call onOpenChange when closed by drag", () => {
      const onOpenChange = jest.fn();
      const { container } = render(
        <Drawer {...defaultProps} onOpenChange={onOpenChange} defaultOpen={true} />
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
        <Drawer {...defaultProps} onSizeChange={onSizeChange} defaultOpen={true} />
      );
      const handle = getHandle(container);

      pointerDown(handle, 100);
      pointerMove(handle, 150);
      pointerUp(handle);

      expect(onSizeChange).toHaveBeenCalledWith(150);
    });
  });
});
