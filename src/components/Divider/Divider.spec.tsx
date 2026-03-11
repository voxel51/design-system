import { render, screen } from "@testing-library/react";

import { Orientation } from "@/types";

import { Divider } from "./Divider";

describe("Divider", () => {
  it("should render horizontal Divider without label by default", () => {
    const { container } = render(<Divider />);
    expect(screen.getByTestId("divider-line-before")).toHaveClass("h-px");
    expect(container.textContent).toBe("");
  });

  it("should render vertical Divider when orientation is provided", () => {
    const { container } = render(<Divider orientation={Orientation.Column} />);
    expect(screen.getByTestId("divider-line-before")).toHaveClass("w-px");
    expect(container.textContent).toBe("");
  });

  it("should render Divider with label", () => {
    const LABEL = "Label";
    render(<Divider label={LABEL} />);
    expect(screen.queryByText(LABEL)).toBeInTheDocument();
    expect(screen.getByTestId("divider-line-before")).toHaveClass("h-px");
    expect(screen.getByTestId("divider-line-after")).toHaveClass("h-px");
  });
});
