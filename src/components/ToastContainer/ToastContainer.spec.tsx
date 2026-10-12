import { render, screen, within } from "@testing-library/react";

import { Anchor } from "@/types";
import { randomString } from "@/util/random";

import { makeChild } from "#/testing-utils";

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

  describe("stacking", () => {
    it("should render every child", () => {
      render(
        <ToastContainer {...defaultProps}>
          <span>first</span>
          <span>second</span>
          <span>third</span>
        </ToastContainer>
      );

      const container = screen.getByTestId(testId);
      expect(within(container).getByText("first")).toBeInTheDocument();
      expect(within(container).getByText("second")).toBeInTheDocument();
      expect(within(container).getByText("third")).toBeInTheDocument();
    });

    it("should grow downward from a top anchor", () => {
      render(<ToastContainer {...defaultProps} anchor={Anchor.TopRight} />);

      expect(screen.getByTestId(testId)).toHaveClass("flex-col-reverse");
    });

    it("should grow upward from a bottom anchor", () => {
      render(<ToastContainer {...defaultProps} anchor={Anchor.BottomRight} />);

      expect(screen.getByTestId(testId)).toHaveClass("flex-col");
    });

    it("should separate stacked children", () => {
      render(<ToastContainer {...defaultProps} />);

      expect(screen.getByTestId(testId)).toHaveClass("flex", "gap-2");
    });
  });
});
