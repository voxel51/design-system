import { fireEvent, render, screen, within } from "@testing-library/react";
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

    describe("mouse interaction", () => {
      let onChange: jest.Mock;
      let knob: HTMLDivElement;
      let track: HTMLElement;
      let mockTrackWidth: number;

      beforeEach(() => {
        onChange = jest.fn();
        render(<Slider {...defaultProps} onChange={onChange} />);

        knob = within(screen.getByTestId(testId)).getByRole("slider");
        track = knob.parentElement!;

        expect(track).toBeInTheDocument();

        mockTrackWidth = 200;
        jest.spyOn(track!, "getBoundingClientRect").mockReturnValue({
          left: 0,
          width: mockTrackWidth,
          top: 0,
          height: 20,
          right: 200,
          bottom: 20,
          x: 0,
          y: 0,
          toJSON: () => {},
        });
      });

      it("should emit onChange when dragging the slider knob", () => {
        const relativeTarget = 0.75;
        fireEvent.mouseDown(knob);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * relativeTarget),
        });
        fireEvent.mouseUp(document);

        expect(onChange).toHaveBeenLastCalledWith(
          expect.closeTo(defaultProps.max * relativeTarget, 5)
        );
      });

      it("should emit onChange when clicking the slider track", () => {
        const relativeTarget = 0.75;
        fireEvent.click(track!, {
          clientX: Math.round(mockTrackWidth * relativeTarget),
        });

        expect(onChange).toHaveBeenLastCalledWith(
          expect.closeTo(defaultProps.max * relativeTarget, 5)
        );
      });
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

    describe("mouse interaction", () => {
      let onChange: jest.Mock;
      let knobs: HTMLDivElement[];
      let track: HTMLElement;
      let mockTrackWidth: number;

      beforeEach(() => {
        onChange = jest.fn();
        render(<Slider {...defaultProps} onChange={onChange} />);

        knobs = within(screen.getByTestId(testId)).getAllByRole("slider");
        expect(knobs).toHaveLength(2);
        track = knobs[0].parentElement!;

        expect(track).toBeInTheDocument();

        mockTrackWidth = 200;
        jest.spyOn(track!, "getBoundingClientRect").mockReturnValue({
          left: 0,
          width: mockTrackWidth,
          top: 0,
          height: 20,
          right: 200,
          bottom: 20,
          x: 0,
          y: 0,
          toJSON: () => {},
        });
      });

      it("should emit onChange when dragging the slider knobs", () => {
        // update minimum value
        const minRelativeTarget = 0.1;
        fireEvent.mouseDown(knobs[0]);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * minRelativeTarget),
        });
        fireEvent.mouseUp(document);

        expect(onChange).toHaveBeenLastCalledWith([
          defaultProps.max * minRelativeTarget,
          (defaultProps.value as number[])[1],
        ]);

        // update maximum value
        const maxRelativeTarget = 0.9;
        fireEvent.mouseDown(knobs[1]);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * maxRelativeTarget),
        });
        fireEvent.mouseUp(document);

        expect(onChange).toHaveBeenLastCalledWith([
          (defaultProps.value as number[])[0],
          defaultProps.max * maxRelativeTarget,
        ]);
      });

      it("should emit onChange when clicking the slider track", () => {
        // update minimum value
        const minRelativeTarget = 0.1;
        fireEvent.click(track!, {
          clientX: Math.round(mockTrackWidth * minRelativeTarget),
        });

        expect(onChange).toHaveBeenLastCalledWith([
          defaultProps.max * minRelativeTarget,
          (defaultProps.value as number[])[1],
        ]);

        // update maximum value
        const maxRelativeTarget = 0.9;
        fireEvent.click(track!, {
          clientX: Math.round(mockTrackWidth * maxRelativeTarget),
        });

        expect(onChange).toHaveBeenLastCalledWith([
          (defaultProps.value as number[])[0],
          defaultProps.max * maxRelativeTarget,
        ]);
      });
    });
  });
});
