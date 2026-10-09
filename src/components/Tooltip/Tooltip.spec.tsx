import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { Tooltip } from "@/components/Tooltip";
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

  it("should stay open while the pointer crosses into an interactive panel", () => {
    jest.useFakeTimers();
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
    // the pointer reaches the panel, inside the wrapper, before the delay ends
    fireEvent.mouseEnter(screen.getByText(content));
    act(() => jest.advanceTimersByTime(500));

    expect(screen.getByText(content)).toBeInTheDocument();

    fireEvent.mouseLeave(element);
    act(() => jest.advanceTimersByTime(500));

    expect(screen.queryByText(content)).not.toBeInTheDocument();
    jest.useRealTimers();
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

  it("should use fixed positioning with high z-index by default so overflow ancestors cannot clip it", () => {
    const content = randomString();
    const children = randomString();
    const highZIndexClass = "z-[var(--z-high)]";

    render(
      <Tooltip {...defaultProps} content={content}>
        {children}
      </Tooltip>
    );

    fireEvent.mouseEnter(
      within(screen.getByTestId(testId)).getByText(children)
    );

    const tooltipPanel = screen.getByText(content).parentElement;
    expect(tooltipPanel).toHaveClass("fixed");
    expect(tooltipPanel).toHaveClass(highZIndexClass);
    expect(tooltipPanel).not.toHaveClass("z-[var(--z-above-modal)]");
  });
});
