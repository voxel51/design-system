import { render, screen, within } from "@testing-library/react";
import { Slider } from "@/components/Slider";
import { randomString } from "#/testing-utils";
import userEvent from "@testing-library/user-event";

describe("Slider", () => {
  let testId: string;
  let defaultProps: {
    "data-testid": string;
    min: number;
    max: number;
    value: number | number[];
    multi?: boolean;
  };

  beforeEach(() => {
    testId = Math.random().toString(36).substring(2, 9);
    defaultProps = { "data-testid": testId, min: 0, max: 1, value: 0.5 };
  });

  describe("with a single value", () => {
    it("should render", () => {
      render(<Slider {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("should render an input field with the provided value", () => {
      render(<Slider {...defaultProps} />);

      const input: HTMLInputElement = within(
        screen.getByTestId(testId)
      ).getByRole("textbox");

      expect(input).toBeInTheDocument();
      expect(input.value).toBe(defaultProps.value.toString());
    });

    it("should render an input label", () => {
      const maxLabel = randomString();
      render(<Slider {...defaultProps} maxLabel={maxLabel} />);

      const slider = screen.getByTestId(testId);
      expect(within(slider).getByText(maxLabel)).toBeInTheDocument();
    });

    it("should not render inputs when bare", () => {
      render(<Slider {...defaultProps} bare />);

      expect(
        within(screen.getByTestId(testId)).queryByRole("textbox")
      ).not.toBeInTheDocument();
    });

    it("should emit onChange when inputs change", async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const input = within(screen.getByTestId(testId)).getByRole("textbox");

      const user = userEvent.setup();
      const newValue = 0.25;
      await user.clear(input);
      await user.type(input, newValue.toString());

      expect(onChange).toHaveBeenLastCalledWith(newValue);
    });

    it("should not emit onChange for invalid inputs", async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const input = within(screen.getByTestId(testId)).getByRole("textbox");

      const user = userEvent.setup();
      const newValue = -1;
      await user.clear(input);
      await user.type(input, newValue.toString());

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("with multiple values", () => {
    beforeEach(() => {
      defaultProps = {
        ...defaultProps,
        value: [0.25, 0.75],
        multi: true,
      };
    });

    it("should render", () => {
      render(<Slider {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("should render input fields with the provided values", () => {
      render(<Slider {...defaultProps} />);

      const inputs: HTMLInputElement[] = within(
        screen.getByTestId(testId)
      ).getAllByRole("textbox");

      inputs.forEach((input, idx) => {
        expect(input).toBeInTheDocument();
        expect(input.value).toBe(
          (defaultProps.value as number[])[idx].toString()
        );
      });
    });

    it("should render input labels", () => {
      const minLabel = randomString();
      const maxLabel = randomString();
      render(
        <Slider {...defaultProps} minLabel={minLabel} maxLabel={maxLabel} />
      );

      const slider = screen.getByTestId(testId);
      expect(within(slider).getByText(minLabel)).toBeInTheDocument();
      expect(within(slider).getByText(maxLabel)).toBeInTheDocument();
    });

    it("should not render inputs when bare", () => {
      render(<Slider {...defaultProps} bare />);

      expect(
        within(screen.getByTestId(testId)).queryByRole("textbox")
      ).not.toBeInTheDocument();
    });

    it("should emit onChange when inputs change", async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByTestId(testId);
      const inputs: HTMLInputElement[] = within(slider).getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
      const [minInput, maxInput] = inputs;

      const user = userEvent.setup();
      const newMin = 0.1;
      const newMax = 0.2;

      await user.clear(minInput);
      await user.type(minInput, newMin.toString());

      expect(onChange).toHaveBeenLastCalledWith([
        newMin,
        (defaultProps.value as number[])[1],
      ]);

      await user.clear(maxInput);
      await user.type(maxInput, newMax.toString());

      expect(onChange).toHaveBeenLastCalledWith([newMin, newMax]);
    });

    it("should not emit onChange for invalid inputs", async () => {
      const onChange = jest.fn();
      render(<Slider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByTestId(testId);
      const inputs: HTMLInputElement[] = within(slider).getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
      const [minInput, maxInput] = inputs;

      const user = userEvent.setup();
      const invalidMin = -1;
      const invalidMax = 100;

      await user.clear(minInput);
      await user.type(minInput, invalidMin.toString());

      expect(onChange).not.toHaveBeenCalled();

      await user.clear(maxInput);
      await user.type(maxInput, invalidMax.toString());

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
