import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MultiValueSlider, SingleValueSlider } from "@/components/Slider";
import { randomString } from "@/util/random";

describe("Slider", () => {
  const expectedDebounceTime = 300;
  let testId: string;

  beforeEach(() => {
    testId = randomString();
  });

  afterEach(() => {
    // clear any tests which use fake timers
    jest.useRealTimers();
  });

  describe("with a single value", () => {
    let defaultProps: {
      "data-testid": string;
      min: number;
      max: number;
      value: number;
    };

    beforeEach(() => {
      defaultProps = { "data-testid": testId, min: 0, max: 1, value: 0.5 };
    });

    it("should render", () => {
      render(<SingleValueSlider {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("should render an input field with the provided value", () => {
      render(<SingleValueSlider {...defaultProps} />);

      const input: HTMLInputElement = within(
        screen.getByTestId(testId)
      ).getByRole("textbox");

      expect(input).toBeInTheDocument();
      expect(input.value).toBe(defaultProps.value.toString());
    });

    it("should render an input label", () => {
      const maxLabel = randomString();
      render(<SingleValueSlider {...defaultProps} maxLabel={maxLabel} />);

      const slider = screen.getByTestId(testId);
      expect(within(slider).getByText(maxLabel)).toBeInTheDocument();
    });

    it("should not render inputs when bare", () => {
      render(<SingleValueSlider {...defaultProps} bare />);

      expect(
        within(screen.getByTestId(testId)).queryByRole("textbox")
      ).not.toBeInTheDocument();
    });

    it("should emit onChange when inputs change", async () => {
      const onChange = jest.fn();
      render(<SingleValueSlider {...defaultProps} onChange={onChange} />);

      const input = within(screen.getByTestId(testId)).getByRole("textbox");

      const user = userEvent.setup();
      const newValue = 0.25;
      await user.clear(input);
      await user.type(input, newValue.toString());

      await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(newValue));
    });

    it("should debounce onChange emission when inputs change", async () => {
      jest.useFakeTimers();

      const onChange = jest.fn();
      render(<SingleValueSlider {...defaultProps} onChange={onChange} />);

      const input = within(screen.getByTestId(testId)).getByRole("textbox");

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const newValue = 0.25;
      await user.clear(input);

      const newValueString = newValue.toString();
      for (let i = 0; i < newValueString.length; i++) {
        await user.type(input, newValueString[i]);
      }

      expect(onChange).not.toHaveBeenCalled();

      jest.advanceTimersByTime(expectedDebounceTime);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(newValue);
    });

    it("should not emit onChange for invalid inputs", async () => {
      const onChange = jest.fn();
      render(<SingleValueSlider {...defaultProps} onChange={onChange} />);

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
        render(<SingleValueSlider {...defaultProps} onChange={onChange} />);

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

      it("should emit onChange when dragging the slider knob", async () => {
        const relativeTarget = 0.75;
        fireEvent.mouseDown(knob);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * relativeTarget),
        });
        fireEvent.mouseUp(document);

        await waitFor(() =>
          expect(onChange).toHaveBeenLastCalledWith(
            expect.closeTo(defaultProps.max * relativeTarget, 5)
          )
        );
      });

      it("should debounce onChange when dragging the slider knob", () => {
        jest.useFakeTimers();

        const relativeTarget = 0.75;
        const steps = [1, 1 - (1 - relativeTarget) / 2, relativeTarget];

        fireEvent.mouseDown(knob);
        for (let i = 0; i < steps.length; i++) {
          fireEvent.mouseMove(document, {
            clientX: Math.round(mockTrackWidth * relativeTarget),
          });
        }
        fireEvent.mouseUp(document);

        expect(onChange).not.toHaveBeenCalled();

        jest.advanceTimersByTime(expectedDebounceTime);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
          expect.closeTo(defaultProps.max * relativeTarget, 5)
        );
      });

      it("should emit onChange when clicking the slider track", async () => {
        const relativeTarget = 0.75;
        fireEvent.click(track!, {
          clientX: Math.round(mockTrackWidth * relativeTarget),
        });

        await waitFor(() =>
          expect(onChange).toHaveBeenLastCalledWith(
            expect.closeTo(defaultProps.max * relativeTarget, 5)
          )
        );
      });
    });
  });

  describe("with multiple values", () => {
    let defaultProps: {
      "data-testid": string;
      min: number;
      max: number;
      value: number[];
    };

    beforeEach(() => {
      defaultProps = {
        "data-testid": testId,
        min: 0,
        max: 1,
        value: [0.25, 0.75],
      };
    });

    it("should render", () => {
      render(<MultiValueSlider {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("should render input fields with the provided values", () => {
      render(<MultiValueSlider {...defaultProps} />);

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
        <MultiValueSlider
          {...defaultProps}
          minLabel={minLabel}
          maxLabel={maxLabel}
        />
      );

      const slider = screen.getByTestId(testId);
      expect(within(slider).getByText(minLabel)).toBeInTheDocument();
      expect(within(slider).getByText(maxLabel)).toBeInTheDocument();
    });

    it("should not render inputs when bare", () => {
      render(<MultiValueSlider {...defaultProps} bare />);

      expect(
        within(screen.getByTestId(testId)).queryByRole("textbox")
      ).not.toBeInTheDocument();
    });

    it("should emit onChange when inputs change", async () => {
      const onChange = jest.fn();
      render(<MultiValueSlider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByTestId(testId);
      const inputs: HTMLInputElement[] = within(slider).getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
      const [minInput, maxInput] = inputs;

      const user = userEvent.setup();
      const newMin = 0.1;
      const newMax = 0.2;

      await user.clear(minInput);
      await user.type(minInput, newMin.toString());

      await waitFor(() =>
        expect(onChange).toHaveBeenLastCalledWith([
          newMin,
          (defaultProps.value as number[])[1],
        ])
      );

      await user.clear(maxInput);
      await user.type(maxInput, newMax.toString());

      await waitFor(() =>
        expect(onChange).toHaveBeenLastCalledWith([newMin, newMax])
      );
    });

    it("should debounce onChange emission when inputs change", async () => {
      jest.useFakeTimers();

      const onChange = jest.fn();
      render(<MultiValueSlider {...defaultProps} onChange={onChange} />);

      const slider = screen.getByTestId(testId);
      const inputs: HTMLInputElement[] = within(slider).getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
      const [minInput] = inputs;

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const newMin = 0.1;
      await user.clear(minInput);

      const newMinString = newMin.toString();
      for (let i = 0; i < newMinString.length; i++) {
        await user.type(minInput, newMinString[i]);
      }

      expect(onChange).not.toHaveBeenCalled();

      jest.advanceTimersByTime(expectedDebounceTime);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([
        newMin,
        (defaultProps.value as number[])[1],
      ]);
    });

    it("should not emit onChange for invalid inputs", async () => {
      const onChange = jest.fn();
      render(<MultiValueSlider {...defaultProps} onChange={onChange} />);

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
        render(<MultiValueSlider {...defaultProps} onChange={onChange} />);

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

      it("should emit onChange when dragging the min slider knob", async () => {
        const minRelativeTarget = 0.1;
        fireEvent.mouseDown(knobs[0]);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * minRelativeTarget),
        });
        fireEvent.mouseUp(document);

        await waitFor(() =>
          expect(onChange).toHaveBeenLastCalledWith([
            defaultProps.max * minRelativeTarget,
            (defaultProps.value as number[])[1],
          ])
        );
      });

      it("should debounce onChange when dragging the min slider knob", () => {
        jest.useFakeTimers();

        const minRelativeTarget = 0.1;
        const steps = [0, minRelativeTarget / 2, minRelativeTarget];

        fireEvent.mouseDown(knobs[0]);
        for (let i = 0; i < steps.length; i++) {
          fireEvent.mouseMove(document, {
            clientX: Math.round(mockTrackWidth * steps[i]),
          });
        }
        fireEvent.mouseUp(document);

        expect(onChange).not.toHaveBeenCalled();

        jest.advanceTimersByTime(expectedDebounceTime);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([
          defaultProps.max * minRelativeTarget,
          (defaultProps.value as number[])[1],
        ]);
      });

      it("should emit onChange when dragging the max slider knob", async () => {
        const maxRelativeTarget = 0.9;
        fireEvent.mouseDown(knobs[1]);
        fireEvent.mouseMove(document, {
          clientX: Math.round(mockTrackWidth * maxRelativeTarget),
        });
        fireEvent.mouseUp(document);

        await waitFor(() =>
          expect(onChange).toHaveBeenLastCalledWith([
            (defaultProps.value as number[])[0],
            defaultProps.max * maxRelativeTarget,
          ])
        );
      });

      it("should debounce onChange when dragging the max slider knob", () => {
        jest.useFakeTimers();

        const maxRelativeTarget = 0.9;
        const steps = [1, 1 - (1 - maxRelativeTarget) / 2, maxRelativeTarget];

        fireEvent.mouseDown(knobs[1]);
        for (let i = 0; i < steps.length; i++) {
          fireEvent.mouseMove(document, {
            clientX: Math.round(mockTrackWidth * steps[i]),
          });
        }
        fireEvent.mouseUp(document);

        expect(onChange).not.toHaveBeenCalled();

        jest.advanceTimersByTime(expectedDebounceTime);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([
          (defaultProps.value as number[])[0],
          defaultProps.max * maxRelativeTarget,
        ]);
      });

      describe("when clicking the slider track", () => {
        it("should emit onChange when clicking near the min knob", async () => {
          const minRelativeTarget = 0.1;
          fireEvent.click(track!, {
            clientX: Math.round(mockTrackWidth * minRelativeTarget),
          });

          await waitFor(() =>
            expect(onChange).toHaveBeenLastCalledWith([
              defaultProps.max * minRelativeTarget,
              (defaultProps.value as number[])[1],
            ])
          );
        });

        it("should debounce onChange when clicking near the min knob", () => {
          jest.useFakeTimers();

          const minRelativeTarget = 0.1;
          const steps = [0, minRelativeTarget / 2, minRelativeTarget];

          steps.forEach((step) =>
            fireEvent.click(track!, {
              clientX: Math.round(mockTrackWidth * step),
            })
          );

          expect(onChange).not.toHaveBeenCalled();

          jest.advanceTimersByTime(expectedDebounceTime);

          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledWith([
            defaultProps.max * minRelativeTarget,
            (defaultProps.value as number[])[1],
          ]);
        });

        it("should emit onChange when clicking near the max knob", async () => {
          const maxRelativeTarget = 0.9;
          fireEvent.click(track!, {
            clientX: Math.round(mockTrackWidth * maxRelativeTarget),
          });

          await waitFor(() =>
            expect(onChange).toHaveBeenLastCalledWith([
              (defaultProps.value as number[])[0],
              defaultProps.max * maxRelativeTarget,
            ])
          );
        });

        it("should debounce onChange when clicking near the max knob", () => {
          jest.useFakeTimers();

          const maxRelativeTarget = 0.9;
          const steps = [1, 1 - (1 - maxRelativeTarget) / 2, maxRelativeTarget];

          steps.forEach((step) =>
            fireEvent.click(track!, {
              clientX: Math.round(mockTrackWidth * step),
            })
          );

          expect(onChange).not.toHaveBeenCalled();

          jest.advanceTimersByTime(expectedDebounceTime);

          expect(onChange).toHaveBeenCalledTimes(1);
          expect(onChange).toHaveBeenCalledWith([
            (defaultProps.value as number[])[0],
            defaultProps.max * maxRelativeTarget,
          ]);
        });
      });
    });
  });
});
