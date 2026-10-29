import { render, screen } from "@testing-library/react";

import { TooltipLabel } from "./TooltipLabel";

describe("TooltipLabel", () => {
  it("shows the label and its detail", () => {
    render(
      <TooltipLabel
        label="Show only selected"
        detail="No members in this scope"
      />
    );
    expect(screen.getByText("Show only selected")).toBeInTheDocument();
    expect(screen.getByText("No members in this scope")).toBeInTheDocument();
  });

  it("shows the label alone without a detail", () => {
    const { container } = render(<TooltipLabel label="Tag" detail="" />);
    expect(container.firstElementChild?.children).toHaveLength(1);
  });
});
