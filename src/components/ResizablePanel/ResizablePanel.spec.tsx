import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResizablePanel from "./ResizablePanel";

const CLOSED_HEIGHT = 28; // DRAG_HANDLE_HEIGHT(4) + TOGGLE_HEIGHT(24)

beforeEach(() => {
  Element.prototype.setPointerCapture = jest.fn();
});

// jsdom's PointerEvent constructor doesn't propagate clientY from its init
// object, so we create events via createEvent and patch clientY directly.
function pointerDown(element: Element, clientY: number) {
  const event = createEvent.pointerDown(element);
  Object.defineProperty(event, "clientY", { value: clientY, configurable: true });
  fireEvent(element, event);
}

function pointerMove(element: Element, clientY: number) {
  const event = createEvent.pointerMove(element);
  Object.defineProperty(event, "clientY", { value: clientY, configurable: true });
  fireEvent(element, event);
}

function pointerUp(element: Element) {
  fireEvent.pointerUp(element);
}

describe("ResizablePanel", () => {
  it("should render with a label", () => {
    render(<ResizablePanel minHeight={20} maxHeight={200} label="Timeline" />);
    expect(screen.getByText("Timeline")).toBeInTheDocument();
  });

  it("should render without a label", () => {
    render(<ResizablePanel minHeight={20} maxHeight={200} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <ResizablePanel minHeight={20} maxHeight={200}>
        <span>track content</span>
      </ResizablePanel>
    );
    expect(screen.getByText("track content")).toBeInTheDocument();
  });

  it("should apply className to the root element", () => {
    const { container } = render(
      <ResizablePanel minHeight={20} maxHeight={200} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should apply style to the root element", () => {
    const { container } = render(
      <ResizablePanel minHeight={20} maxHeight={200} style={{ width: 300 }} />
    );
    expect(container.firstChild).toHaveStyle({ width: "300px" });
  });

  describe("open/close", () => {
    it("should be open by default", () => {
      render(<ResizablePanel minHeight={20} maxHeight={200} label="Timeline" />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("should be closed when defaultOpen is false", () => {
      render(
        <ResizablePanel minHeight={20} maxHeight={200} label="Timeline" defaultOpen={false} />
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });

    it("should close when clicked while open", async () => {
      const user = userEvent.setup();
      render(<ResizablePanel minHeight={20} maxHeight={200} label="Timeline" defaultOpen={true} />);

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });

    it("should open when clicked while closed", async () => {
      const user = userEvent.setup();
      render(
        <ResizablePanel minHeight={20} maxHeight={200} label="Timeline" defaultOpen={false} />
      );

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("height", () => {
    it("should set height to maxHeight when open", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      expect(container.firstChild).toHaveStyle({ height: "200px" });
    });

    it("should set height to CLOSED_HEIGHT when closed", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={false} />
      );
      expect(container.firstChild).toHaveStyle({ height: `${CLOSED_HEIGHT}px` });
    });

    it("should restore saved height on reopen", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      // drag down by 50px: 200 - 50 = 150
      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 150);
      pointerUp(dragHandle);

      // close then reopen
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button"));

      expect(root).toHaveStyle({ height: "150px" });
    });
  });

  describe("mode", () => {
    it("should apply push class by default", () => {
      const { container } = render(<ResizablePanel minHeight={20} maxHeight={200} />);
      expect(container.firstChild).toHaveClass("push");
    });

    it("should apply push class when mode is push", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} mode="push" />
      );
      expect(container.firstChild).toHaveClass("push");
      expect(container.firstChild).not.toHaveClass("float");
    });

    it("should apply float class when mode is float", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} mode="float" />
      );
      expect(container.firstChild).toHaveClass("float");
      expect(container.firstChild).not.toHaveClass("push");
    });
  });

  describe("align", () => {
    it("should default to left align", () => {
      const { container } = render(<ResizablePanel minHeight={20} maxHeight={200} />);
      expect(container.querySelector(".toggle")).not.toHaveClass("toggleRight");
    });

    it("should not apply toggleRight when align is left", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} align="left" />
      );
      expect(container.querySelector(".toggle")).not.toHaveClass("toggleRight");
    });

    it("should apply toggleRight when align is right", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} align="right" />
      );
      expect(container.querySelector(".toggle")).toHaveClass("toggleRight");
    });
  });

  describe("drag handle", () => {
    it("should have dragHandleDisabled class when closed", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={false} />
      );
      expect(container.firstChild!.firstChild).toHaveClass("dragHandleDisabled");
    });

    it("should not have dragHandleDisabled class when open", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      expect(container.firstChild!.firstChild).not.toHaveClass("dragHandleDisabled");
    });

    it("should increase height when dragged up", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 60);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: "200px" }); // 200 + 40 clamped to maxHeight
    });

    it("should decrease height when dragged down", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 150);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: "150px" }); // 200 - 50 = 150
    });

    it("should clamp height to maxHeight", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, -500);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: "200px" });
    });

    it("should clamp height to minHeight when minHeight exceeds closed height", () => {
      // minHeight(50) > CLOSED_HEIGHT(28): drag that would land between them clamps to minHeight
      const { container } = render(
        <ResizablePanel minHeight={50} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      // raw = 200 - 160 = 40, between CLOSED_HEIGHT(28) and minHeight(50) → clamps to 50
      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 260);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: "50px" });
    });

    it("should close when dragged below closed height", () => {
      // Extreme drag past the closedHeight threshold closes the drawer
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 10000);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: `${CLOSED_HEIGHT}px` });
    });

    it("should not respond to drag when closed", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={false} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerMove(dragHandle, 150);
      pointerUp(dragHandle);

      expect(root).toHaveStyle({ height: `${CLOSED_HEIGHT}px` });
    });
  });

  describe("transition", () => {
    it("should apply height transition when not dragging", () => {
      const { container } = render(<ResizablePanel minHeight={20} maxHeight={200} />);
      expect(container.firstChild).toHaveStyle({
        transition: "height 0.2s ease",
      });
    });

    it("should remove transition while dragging", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      expect(root).toHaveStyle({ transition: "none" });
    });

    it("should restore transition after drag ends", () => {
      const { container } = render(
        <ResizablePanel minHeight={20} maxHeight={200} defaultOpen={true} />
      );
      const root = container.firstChild as HTMLElement;
      const dragHandle = root.firstChild as HTMLElement;

      pointerDown(dragHandle, 100);
      pointerUp(dragHandle);
      expect(root).toHaveStyle({ transition: "height 0.2s ease" });
    });
  });
});
