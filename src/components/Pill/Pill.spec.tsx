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

  it("should render status icon when isStatus is true", () => {
    render(<Pill isStatus={true}>{pillText}</Pill>);

    const pill = screen.getByText(pillText);
    const svg = pill.querySelector("svg");
    const circle = pill.querySelector("circle");

    expect(svg).toBeInTheDocument();
    expect(circle).toBeInTheDocument();
  });

  it("should not render status icon when isStatus is false", () => {
    render(<Pill isStatus={false}>{pillText}</Pill>);

    const pill = screen.getByText(pillText);
    const svg = pill.querySelector("svg");

    expect(svg).not.toBeInTheDocument();
  });

  it("should not render status icon when isStatus is not provided", () => {
    render(<Pill>{pillText}</Pill>);

    const pill = screen.getByText(pillText);
    const svg = pill.querySelector("svg");

    expect(svg).not.toBeInTheDocument();
  });
});
