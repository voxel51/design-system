import { render, screen } from "@testing-library/react";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("should be hidden from assistive tech", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("should size itself from its props", () => {
    render(
      <Skeleton data-testid="skeleton" width={160} height={16} radius={4} />
    );

    expect(screen.getByTestId("skeleton")).toHaveStyle({
      width: "160px",
      height: "16px",
      borderRadius: "4px",
    });
  });
});
