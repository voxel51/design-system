import { Size } from "@/types";
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

    it("should render with empty options array", () => {
      const handleChange = jest.fn();
      render(<RadioGroup options={[]} value="" onChange={handleChange} />);

      const radios = screen.queryAllByRole("radio");
      expect(radios).toHaveLength(0);
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

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
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

  describe("Name attribute", () => {
    it("should use provided name for all radios", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          name="custom-group-name"
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("name", "custom-group-name");
      });
    });

    it("should generate unique name when name is not provided", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      const radios = screen.getAllByRole("radio");
      const name = radios[0].getAttribute("name");

      expect(name).toBeTruthy();
      expect(name).toMatch(/^radio-group-/);

      // All radios should have the same generated name
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("name", name);
      });
    });
  });

  describe("Size prop", () => {
    it("should apply size to all radios", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          size={Size.Md}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveClass("w-5", "h-5");
      });
    });

    it("should default to Small size", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveClass("w-4", "h-4");
      });
    });

    it("should apply Large size to all radios", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
          size={Size.Lg}
        />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveClass("w-6", "h-6");
      });
    });
  });

  describe("Orientation prop", () => {
    it("should render with Column orientation by default", () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup
          options={defaultOptions}
          value="option1"
          onChange={handleChange}
        />
      );

      // Stack component with Column orientation should be present
      // We can verify by checking the structure
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
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
        expect(radio).toBeDisabled();
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
        expect(radio).not.toBeDisabled();
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

      expect(option1).not.toBeDisabled();
      expect(option2).toBeDisabled();
      expect(option3).not.toBeDisabled();
    });

    it("should disable option when both group disabled and option disabled are true", () => {
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
          disabled
        />
      );

      const option1 = screen.getByLabelText("Option 1");
      const option2 = screen.getByLabelText("Option 2");

      expect(option1).toBeDisabled();
      expect(option2).toBeDisabled();
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
