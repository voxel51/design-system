import { Size } from "@/types";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";
import userEvent from "@testing-library/user-event";

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

  it("should handle click events", async () => {
    const handleChange = jest.fn();
    render(
      <Checkbox
        onChange={handleChange}
        label={checkboxLabel}
        data-testid="clickable-checkbox"
      />
    );

    const checkbox = screen.getByTestId("clickable-checkbox");
    const user = userEvent.setup();

    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should apply correct classes when size is Large", () => {
    render(<Checkbox size={Size.Lg} label={checkboxLabel} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("w-6", "h-6", "checked:after:text-lg");
  });
});
