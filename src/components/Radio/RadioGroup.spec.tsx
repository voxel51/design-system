import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioOption } from "./RadioGroup";

describe("RadioGroup", () => {
  const defaultOptions: RadioOption[] = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  describe("Rendering", () => {
    it("should render all options", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Option 3")).toBeInTheDocument();
    });

    it("should pass through additional props to the container", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          data-testid="radio-group"
          id="custom-group-id"
        />
      );

      const group = screen.getByTestId("radio-group");
      expect(group).toHaveAttribute("id", "custom-group-id");
      expect(group).toHaveAttribute("data-testid", "radio-group");
    });
  });

  describe("Value selection", () => {
    it("should check the radio matching the value prop", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option2"
          onChange={handleChange}
        />
      );

      const option1 = screen.getByLabelText("Option 1");
      const option2 = screen.getByLabelText("Option 2");
      const option3 = screen.getByLabelText("Option 3");

      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
      expect(option3).not.toBeChecked();
    });

    it("should have no radio checked when value doesn't match any option", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="nonexistent"
          onChange={handleChange}
        />
      );

      screen.getAllByRole("radio").forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });

    it("should call onChange with correct value when clicking an option", async () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      const option2 = screen.getByLabelText("Option 2");
      const user = userEvent.setup();

      await user.click(option2);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("should switch selection when clicking different options", async () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      const option2 = screen.getByLabelText("Option 2");
      const option3 = screen.getByLabelText("Option 3");
      const user = userEvent.setup();

      await user.click(option2);
      expect(handleChange).toHaveBeenCalledWith("option2");

      await user.click(option3);
      expect(handleChange).toHaveBeenCalledWith("option3");
    });
  });

  describe("Disabled state", () => {
    it("should disable all radios when disabled prop is true", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          disabled
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("should not disable radios when disabled prop is false", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          disabled={false}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).not.toHaveAttribute("aria-disabled", "true");
      });
    });

    it("should disable individual options when option.disabled is true", () => {
      const handleChange = jest.fn();
      const optionsWithDisabled: RadioOption[] = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2", disabled: true },
        { value: "option3", label: "Option 3" },
      ];

      render(
        <RadioGroup
          options={optionsWithDisabled}
          value="option1"
          onChange={handleChange}
        />
      );

      const option1 = screen.getByLabelText("Option 1");
      const option2 = screen.getByLabelText("Option 2");
      const option3 = screen.getByLabelText("Option 3");

      expect(option1).not.toHaveAttribute("aria-disabled", "true");
      expect(option2).toHaveAttribute("aria-disabled", "true");
      expect(option3).not.toHaveAttribute("aria-disabled", "true");
    });

    it("should not call onChange when clicking disabled option", async () => {
      const handleChange = jest.fn();
      const optionsWithDisabled: RadioOption[] = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2", disabled: true },
      ];

      render(
        <RadioGroup
          options={optionsWithDisabled}
          value="option1"
          onChange={handleChange}
        />
      );

      const option2 = screen.getByLabelText("Option 2");
      const user = userEvent.setup();

      await user.click(option2);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("should not call onChange when group is disabled", async () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          disabled
        />
      );

      const option2 = screen.getByLabelText("Option 2");
      const user = userEvent.setup();

      await user.click(option2);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
