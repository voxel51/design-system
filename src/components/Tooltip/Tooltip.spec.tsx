import { Tooltip } from "@/components/Tooltip";
import { randomString } from "@/util/random";
import { fireEvent, render, screen, within } from "@testing-library/react";

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
});
