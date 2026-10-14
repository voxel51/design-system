import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { Tooltip, type TooltipProps } from "@/components/Tooltip";
import { randomString } from "@/util/random";

describe("Tooltip", () => {
  let testId: string;
  let defaultProps: { "data-testid": string };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId };
  });

  it("should render", () => {
    render(<Tooltip {...defaultProps} content="tooltip"></Tooltip>);

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  it("should render children", () => {
    const children = randomString();

    render(
      <Tooltip {...defaultProps} content="tooltip">
        {children}
      </Tooltip>
    );

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toContainHTML(children);
  });

  it("should render tooltip on hover", () => {
    const content = randomString();
    const children = randomString();

    render(
      <Tooltip {...defaultProps} content={content}>
        {children}
      </Tooltip>
    );

    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();

    fireEvent.mouseEnter(within(element).getByText(children));

    expect(screen.getByText(content)).toBeInTheDocument();

    fireEvent.mouseLeave(within(element).getByText(children));

    expect(screen.queryByText(content)).not.toBeInTheDocument();
  });

  describe("interactive", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("should stay open while the pointer crosses into the panel", () => {
      const content = randomString();
      const children = randomString();

      render(
        <Tooltip {...defaultProps} content={content} interactive>
          {children}
        </Tooltip>
      );

      const element = screen.getByTestId(testId);
      fireEvent.mouseEnter(within(element).getByText(children));
      fireEvent.mouseLeave(within(element).getByText(children));
      act(() => jest.advanceTimersByTime(50));
      // the pointer reaches the panel before the close delay ends
      fireEvent.mouseEnter(screen.getByText(content));
      act(() => jest.advanceTimersByTime(500));

      expect(screen.getByText(content)).toBeInTheDocument();

      fireEvent.mouseLeave(element);
      act(() => jest.advanceTimersByTime(500));

      expect(screen.queryByText(content)).not.toBeInTheDocument();
    });

    it("should stay open when the pointer returns from the panel to the trigger", () => {
      const content = randomString();
      const children = randomString();

      render(
        <Tooltip {...defaultProps} content={content} interactive>
          {children}
        </Tooltip>
      );

      const trigger = within(screen.getByTestId(testId)).getByText(children);
      fireEvent.mouseEnter(trigger);
      fireEvent.mouseLeave(trigger);
      act(() => jest.advanceTimersByTime(50));
      fireEvent.mouseEnter(screen.getByText(content));

      // leave the panel and come straight back to the trigger
      fireEvent.mouseLeave(screen.getByText(content));
      act(() => jest.advanceTimersByTime(50));
      fireEvent.mouseEnter(trigger);
      act(() => jest.advanceTimersByTime(500));

      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it("should apply above-modal z-index to tooltip panel when portal is true", () => {
    const content = randomString();
    const children = randomString();
    const aboveModalZIndexClass = "z-[var(--z-above-modal)]";

    render(
      <Tooltip {...defaultProps} content={content} portal>
        {children}
      </Tooltip>
    );

    fireEvent.mouseEnter(
      within(screen.getByTestId(testId)).getByText(children)
    );

    const tooltipContent = screen.getByText(content);
    const tooltipPanel = tooltipContent.parentElement;
    expect(tooltipPanel).toHaveClass(aboveModalZIndexClass);
  });

  it("should portal to document.body with above-modal z-index by default", () => {
    const content = randomString();
    const children = randomString();

    render(
      <div data-testid="clipping-parent" style={{ overflow: "hidden" }}>
        <Tooltip {...defaultProps} content={content}>
          {children}
        </Tooltip>
      </div>
    );

    fireEvent.mouseEnter(
      within(screen.getByTestId(testId)).getByText(children)
    );

    const tooltipPanel = screen.getByRole("tooltip");
    expect(tooltipPanel.parentElement).toBe(document.body);
    expect(screen.getByTestId("clipping-parent").contains(tooltipPanel)).toBe(
      false
    );
    expect(tooltipPanel).toHaveClass("z-[var(--z-above-modal)]");
  });

  it("should render in place with fixed positioning and high z-index when portal is false", () => {
    const content = randomString();
    const children = randomString();

    render(
      <Tooltip {...defaultProps} content={content} portal={false}>
        {children}
      </Tooltip>
    );

    fireEvent.mouseEnter(
      within(screen.getByTestId(testId)).getByText(children)
    );

    const tooltipPanel = screen.getByRole("tooltip");
    expect(screen.getByTestId(testId)).toContainElement(tooltipPanel);
    expect(tooltipPanel.style.position).toBe("fixed");
    expect(tooltipPanel).toHaveClass("z-[var(--z-high)]");
  });

  describe("viewport collisions", () => {
    const VIEWPORT = { width: 1000, height: 800 };
    const PANEL = { width: 120, height: 24 };
    let trigger: DOMRect;

    const rect = (x: number, y: number, width: number, height: number) =>
      ({
        x,
        y,
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
        width,
        height,
        toJSON: () => ({}),
      }) as DOMRect;

    const isPanel = (element: Element) =>
      element.getAttribute("role") === "tooltip";

    beforeEach(() => {
      jest
        .spyOn(document.documentElement, "clientWidth", "get")
        .mockReturnValue(VIEWPORT.width);
      jest
        .spyOn(document.documentElement, "clientHeight", "get")
        .mockReturnValue(VIEWPORT.height);
      jest
        .spyOn(HTMLElement.prototype, "offsetWidth", "get")
        .mockImplementation(function (this: HTMLElement) {
          return isPanel(this) ? PANEL.width : 0;
        });
      jest
        .spyOn(HTMLElement.prototype, "offsetHeight", "get")
        .mockImplementation(function (this: HTMLElement) {
          return isPanel(this) ? PANEL.height : 0;
        });
      jest
        .spyOn(Element.prototype, "getBoundingClientRect")
        .mockImplementation(function (this: Element) {
          if (this.getAttribute("data-testid") === testId) return trigger;
          if (isPanel(this)) return rect(0, 0, PANEL.width, PANEL.height);
          return rect(0, 0, 0, 0);
        });
    });

    afterEach(() => jest.restoreAllMocks());

    const open = async (props: Partial<TooltipProps> = {}) => {
      render(
        <Tooltip {...defaultProps} content="Show filters" {...props}>
          trigger
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByTestId(testId));
      await act(async () => {});
      const panel = screen.getByRole("tooltip");
      const match = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(
        panel.style.transform
      );
      if (!match) throw new Error(`no translate in "${panel.style.transform}"`);
      return { panel, x: Number(match[1]), y: Number(match[2]) };
    };

    it("should shift a panel under a trigger at the left edge back inside the padding", async () => {
      trigger = rect(0, 100, 28, 28);
      const { panel, x } = await open({ anchor: "bottom" });
      expect(x).toBe(8);
      expect(panel.dataset.side).toBe("bottom");
      // the arrow stays on the trigger's center (14px) after the shift
      const arrowElement = panel.lastElementChild as HTMLElement;
      expect(x + parseFloat(arrowElement.style.left)).toBe(14);
    });

    it("should shift a panel near the right edge back inside the padding", async () => {
      trigger = rect(VIEWPORT.width - 28, 100, 28, 28);
      const { x } = await open({ anchor: "bottom" });
      expect(x).toBe(VIEWPORT.width - PANEL.width - 8);
    });

    it("should honor a custom collisionPadding", async () => {
      trigger = rect(0, 100, 28, 28);
      const { x } = await open({ anchor: "bottom", collisionPadding: 16 });
      expect(x).toBe(16);
    });

    it("should flip a top panel below a trigger with no room above", async () => {
      trigger = rect(400, 0, 28, 28);
      const { panel, y } = await open({ anchor: "top" });
      expect(panel.dataset.side).toBe("bottom");
      expect(y).toBeGreaterThanOrEqual(28);
    });

    it("should flip a left panel to the right of a trigger at the left edge", async () => {
      trigger = rect(0, 300, 28, 28);
      const { panel } = await open({ anchor: "left" });
      expect(panel.dataset.side).toBe("right");
    });

    it("should keep the preferred side and position when avoidCollisions is false", async () => {
      trigger = rect(0, 100, 28, 28);
      const { panel, x } = await open({
        anchor: "bottom",
        avoidCollisions: false,
      });
      expect(panel.dataset.side).toBe("bottom");
      expect(x).toBe(14 - PANEL.width / 2);
    });
  });
});
