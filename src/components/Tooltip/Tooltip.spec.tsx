import { fireEvent, render, screen, within } from "@testing-library/react";

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

  it("should portal the panel to the body by default, so a transformed ancestor cannot offset it", () => {
    const content = randomString();
    const children = randomString();

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
    expect(tooltipPanel).toHaveClass("z-[var(--z-above-modal)]");
    expect(screen.getByTestId(testId)).not.toContainElement(tooltipPanel);
  });

  it("should render the panel inline with high z-index when portal is false", () => {
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

    const tooltipPanel = screen.getByText(content).parentElement;
    expect(tooltipPanel).toHaveClass("fixed");
    expect(tooltipPanel).toHaveClass("z-[var(--z-high)]");
    expect(tooltipPanel).not.toHaveClass("z-[var(--z-above-modal)]");
    expect(screen.getByTestId(testId)).toContainElement(tooltipPanel);
  });
});
