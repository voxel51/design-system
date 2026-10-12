import { render, screen } from "@testing-library/react";

import { StatusDot } from "@/components/StatusDot/StatusDot";

describe("StatusDot", () => {
  it("pulses only when asked", () => {
    render(
      <>
        <StatusDot data-testid="still" />
        <StatusDot data-testid="pulsing" pulse />
      </>
    );

    expect(screen.getByTestId("still")).not.toHaveClass("animate-pulse");
    expect(screen.getByTestId("pulsing")).toHaveClass("animate-pulse");
  });
});
