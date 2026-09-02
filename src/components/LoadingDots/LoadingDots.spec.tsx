import { render, screen } from "@testing-library/react";

import { LoadingDots } from "./LoadingDots";

describe("LoadingDots", () => {
  it("should render as a status region", () => {
    render(<LoadingDots />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render the text the dots follow", () => {
    render(<LoadingDots text="Searching cats" />);
    expect(screen.getByRole("status")).toHaveTextContent("Searching cats");
  });

  it("should hide the animated dots from assistive tech", () => {
    render(<LoadingDots text="Loading" />);
    const dots = screen.getByRole("status").querySelector("[aria-hidden]");
    expect(dots).not.toBeNull();
  });

  it("should apply className and pass through HTML props", () => {
    render(<LoadingDots className="custom" data-testid="dots" />);
    expect(screen.getByTestId("dots")).toHaveClass("custom");
  });
});
