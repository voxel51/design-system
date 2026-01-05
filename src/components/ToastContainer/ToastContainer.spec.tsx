import { makeChild } from "#/testing-utils";
import { randomString } from "@/util/random";
import { render, screen, within } from "@testing-library/react";
import { ToastContainer } from "./ToastContainer";

describe("ToastContainer", () => {
  let testId: string;
  let defaultProps: { "data-testid": string; open: boolean };

  beforeEach(() => {
    testId = randomString();
    defaultProps = { "data-testid": testId, open: true };
  });

  it("should render if open", () => {
    render(<ToastContainer {...defaultProps}></ToastContainer>);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("should not render if not open", () => {
    render(<ToastContainer {...defaultProps} open={false}></ToastContainer>);

    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  it("should render children", () => {
    const children = makeChild();
    const Child = children.data;
    render(
      <ToastContainer {...defaultProps}>
        <Child />
      </ToastContainer>
    );

    const container = screen.getByTestId(testId);
    expect(within(container).getByTestId(children.id)).toBeInTheDocument();
  });
});
