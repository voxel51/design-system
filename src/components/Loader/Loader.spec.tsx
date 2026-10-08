import { render, screen } from "@testing-library/react";

import { Loader } from "./Loader";

describe("Loader", () => {
  it("should render a spinner by default", () => {
    render(<Loader data-testid="loader" />);
    expect(screen.getByTestId("loader").querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("should render bars as a status region", () => {
    render(<Loader type="bars" aria-label="Generating" />);
    const bars = screen.getByRole("status", { name: "Generating" });
    expect(bars.querySelectorAll("span")).toHaveLength(3);
  });

  it("should scale the bars with size", () => {
    render(<Loader type="bars" size="xl" />);
    expect(screen.getByRole("status")).toHaveStyle({
      "--loader-size": "32px",
    });
  });

  it("should apply className and pass through HTML props", () => {
    render(<Loader type="bars" className="custom" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("custom");
  });
});
