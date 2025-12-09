import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  const checkboxLabel = "Checkbox label";

  it("should render with label", () => {
    render(<Checkbox label={checkboxLabel} />);
    expect(screen.getByLabelText(checkboxLabel)).toBeInTheDocument();
  });

  it("should render without label", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Checkbox
        id="test-checkbox"
        data-testid="custom-checkbox"
        label={checkboxLabel}
      />
    );

    const checkbox = screen.getByTestId("custom-checkbox");
    expect(checkbox).toHaveAttribute("id", "test-checkbox");
    expect(checkbox).toHaveAttribute("data-testid", "custom-checkbox");
  });

  it("should handle checked state", () => {
    render(<Checkbox checked label={checkboxLabel} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should handle click events", () => {
    const handleChange = jest.fn();
    render(
      <Checkbox onChange={handleChange} label={checkboxLabel} data-testid="clickable-checkbox" />
    );

    const checkbox = screen.getByTestId("clickable-checkbox");
    checkbox.click();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

