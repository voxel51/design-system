import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Size } from "@/types";

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

  describe("indeterminate", () => {
    it("sets aria-checked to mixed when indeterminate and not checked", () => {
      render(<Checkbox indeterminate label={checkboxLabel} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    });

    it("ignores indeterminate when checked is true", () => {
      render(<Checkbox checked indeterminate label={checkboxLabel} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toHaveAttribute("aria-checked", "mixed");
      expect(checkbox.className).not.toContain(
        "bg-[var(--color-brand-accent)]"
      );
    });
  });
});
