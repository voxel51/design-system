import { render, screen } from "@testing-library/react";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  const toggleLabel = "Toggle label";

  it("should render with label", () => {
    render(<Toggle label={toggleLabel} />);
    expect(screen.getByLabelText(toggleLabel)).toBeInTheDocument();
  });

  it("should render without label", () => {
    render(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Toggle
        id="test-toggle"
        data-testid="custom-toggle"
        label={toggleLabel}
      />
    );

    const toggle = screen.getByTestId("custom-toggle");
    expect(toggle).toHaveAttribute("id", "test-toggle");
    expect(toggle).toHaveAttribute("data-testid", "custom-toggle");
  });

  it("should handle checked state", () => {
    render(<Toggle checked label={toggleLabel} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("should handle click events", () => {
    const handleChange = jest.fn();
    render(
      <Toggle onChange={handleChange} label={toggleLabel} data-testid="clickable-toggle" />
    );

    const toggle = screen.getByTestId("clickable-toggle");
    toggle.click();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

