import { render, screen } from "@testing-library/react";
import { Pill } from "./Pill";

describe("Pill", () => {
  const pillText = "Pill text";

  it("should render with text", () => {
    render(<Pill>{pillText}</Pill>);
    expect(screen.getByText(pillText)).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Pill id="test-pill" data-testid="custom-pill">
        {pillText}
      </Pill>
    );

    const pill = screen.getByTestId("custom-pill");
    expect(pill).toHaveAttribute("id", "test-pill");
    expect(pill).toHaveAttribute("data-testid", "custom-pill");
  });
});
