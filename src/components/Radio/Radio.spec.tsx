import { Size } from "@/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "./Radio";

describe("Radio", () => {
  const radioLabel = "Radio label";

  describe("Rendering", () => {
    it("should render with label", () => {
      render(<Radio label={radioLabel} />);
      expect(screen.getByLabelText(radioLabel)).toBeInTheDocument();
    });

    it("should render without label", () => {
      render(<Radio />);
      const radio = screen.getByRole("radio");
      expect(radio).toBeInTheDocument();
    });

    it("should render with value", () => {
      render(<Radio value="test-value" label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).toHaveAttribute("value", "test-value");
    });

    it("should pass through additional props to the component", () => {
      render(
        <Radio
          id="test-radio"
          data-testid="custom-radio"
          name="radio-group"
          label={radioLabel}
        />
      );

      const radio = screen.getByTestId("custom-radio");
      expect(radio).toHaveAttribute("id", "test-radio");
      expect(radio).toHaveAttribute("data-testid", "custom-radio");
      expect(radio).toHaveAttribute("name", "radio-group");
    });
  });

  describe("Checked state", () => {
    it("should handle checked state", () => {
      render(<Radio checked label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).toBeChecked();
    });

    it("should handle unchecked state by default", () => {
      render(<Radio label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).not.toBeChecked();
    });
  });

  describe("Interactions", () => {
    it("should handle click events", async () => {
      const handleChange = jest.fn();
      render(
        <Radio
          onChange={handleChange}
          label={radioLabel}
          data-testid="clickable-radio"
        />
      );

      const radio = screen.getByTestId("clickable-radio");
      const user = userEvent.setup();

      await user.click(radio);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("should not call onChange when clicking already checked radio", async () => {
      const handleChange = jest.fn();
      render(
        <Radio
          checked
          onChange={handleChange}
          label={radioLabel}
          data-testid="checked-radio"
        />
      );

      const radio = screen.getByTestId("checked-radio");
      const user = userEvent.setup();

      await user.click(radio);

      // Radio buttons don't trigger change events when clicking an already-checked radio
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should not call onChange when onChange is not provided", async () => {
      const handleChange = jest.fn();
      render(<Radio label={radioLabel} data-testid="no-onchange-radio" />);

      const radio = screen.getByTestId("no-onchange-radio");
      const user = userEvent.setup();

      await user.click(radio);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should be clickable via label", async () => {
      const handleChange = jest.fn();
      render(
        <Radio
          onChange={handleChange}
          label={radioLabel}
          data-testid="label-clickable-radio"
        />
      );

      const label = screen.getByText(radioLabel);
      const user = userEvent.setup();

      await user.click(label);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Disabled state", () => {
    it("should handle disabled state", () => {
      render(<Radio disabled label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).toBeDisabled();
    });

    it("should not be clickable when disabled", async () => {
      const handleChange = jest.fn();
      render(
        <Radio
          disabled
          onChange={handleChange}
          label={radioLabel}
          data-testid="disabled-radio"
        />
      );

      const radio = screen.getByTestId("disabled-radio");
      const user = userEvent.setup();

      await user.click(radio);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should handle disabled checked state", () => {
      render(<Radio disabled checked label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).toBeDisabled();
      expect(radio).toBeChecked();
    });
  });

  it("should apply correct classes when size is Small", () => {
    render(<Radio size={Size.Sm} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-4", "h-4");
  });

  it("should apply correct classes when size is Medium", () => {
    render(<Radio size={Size.Md} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-5", "h-5");
  });

  it("should apply correct classes when size is Large", () => {
    render(<Radio size={Size.Lg} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-6", "h-6");
  });

  it("should default to Small size", () => {
    render(<Radio label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-4", "h-4");
  });
});
