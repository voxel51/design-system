import { RadioGroup } from "@headlessui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

import { Size } from "@/types";

import { Radio } from "./Radio";

type RadioGroupWrapperProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
};

const renderRadioInGroup = (
  radio: ReactNode,
  groupProps?: Omit<RadioGroupWrapperProps, "children">
) => {
  const {
    value = "",
    onChange = () => {},
    disabled = false,
  } = groupProps || {};
  return render(
    <RadioGroup value={value} onChange={onChange} disabled={disabled}>
      {radio}
    </RadioGroup>
  );
};

describe("Radio", () => {
  const radioLabel = "Radio label";

  it("should pass through additional props to the component", () => {
    renderRadioInGroup(
      <Radio data-testid="custom-radio" name="radio-group" label={radioLabel} />
    );

    const radio = screen.getByTestId("custom-radio");
    expect(radio).toHaveAttribute("data-testid", "custom-radio");
    expect(radio).toHaveAttribute("name", "radio-group");
  });

  describe("Checked state", () => {
    it("should handle checked state", () => {
      renderRadioInGroup(<Radio value="test-value" label={radioLabel} />, {
        value: "test-value",
      });
      const radio = screen.getByRole("radio");
      expect(radio).toBeChecked();
    });

    it("should handle unchecked state by default", () => {
      renderRadioInGroup(<Radio value="test-value" label={radioLabel} />);
      const radio = screen.getByRole("radio");
      expect(radio).not.toBeChecked();
    });
  });

  describe("User interactions", () => {
    it("should handle click events", async () => {
      const handleChange = jest.fn();
      renderRadioInGroup(
        <Radio
          value="test-value"
          label={radioLabel}
          data-testid="clickable-radio"
        />,
        { onChange: handleChange }
      );

      const radio = screen.getByTestId("clickable-radio");
      const user = userEvent.setup();

      await user.click(radio);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("test-value");
    });

    it("should not call onChange when clicking already checked radio", async () => {
      const handleChange = jest.fn();
      renderRadioInGroup(
        <Radio
          value="test-value"
          label={radioLabel}
          data-testid="checked-radio"
        />,
        { value: "test-value", onChange: handleChange }
      );

      const radio = screen.getByTestId("checked-radio");
      const user = userEvent.setup();

      await user.click(radio);

      // Radio buttons don't trigger change events when clicking an already-checked radio
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should be clickable via label", async () => {
      const handleChange = jest.fn();
      renderRadioInGroup(
        <Radio
          value="test-value"
          label={radioLabel}
          data-testid="label-clickable-radio"
        />,
        { onChange: handleChange }
      );

      const label = screen.getByText(radioLabel);
      const user = userEvent.setup();

      await user.click(label);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("test-value");
    });
  });

  describe("Disabled state", () => {
    it("should handle disabled state", () => {
      renderRadioInGroup(<Radio label={radioLabel} />, { disabled: true });
      const radio = screen.getByRole("radio");
      expect(radio).toHaveAttribute("aria-disabled", "true");
    });

    it("should not be clickable when disabled", async () => {
      const handleChange = jest.fn();
      renderRadioInGroup(
        <Radio
          value="test-value"
          label={radioLabel}
          data-testid="disabled-radio"
        />,
        { onChange: handleChange, disabled: true }
      );

      const radio = screen.getByTestId("disabled-radio");
      const user = userEvent.setup();

      await user.click(radio);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  it("should apply correct classes when size is Small", () => {
    renderRadioInGroup(<Radio size={Size.Sm} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-4", "h-4");
  });

  it("should apply correct classes when size is Medium", () => {
    renderRadioInGroup(<Radio size={Size.Md} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-5", "h-5");
  });

  it("should apply correct classes when size is Large", () => {
    renderRadioInGroup(<Radio size={Size.Lg} label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-6", "h-6");
  });

  it("should default to Small size", () => {
    renderRadioInGroup(<Radio label={radioLabel} />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("w-4", "h-4");
  });
});
