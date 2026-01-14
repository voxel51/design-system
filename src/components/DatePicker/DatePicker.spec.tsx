import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { Radius, Size } from "@/types";

import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("should render a date input element", () => {
    const { container } = render(<DatePicker />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("date");
  });

  it("should render with a value", () => {
    const { container } = render(<DatePicker value="2024-01-15" readOnly />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input.value).toBe("2024-01-15");
  });

  it("should render calendar icon on the left", () => {
    render(<DatePicker />);
    const calendarButton = screen.getByLabelText("Open date picker");
    expect(calendarButton).toBeInTheDocument();
  });

  it("should render caret down icon on the right", () => {
    render(<DatePicker />);
    const buttons = screen.getAllByLabelText("Open date picker");
    expect(buttons.length).toBe(2); // Both icons have the same aria-label
  });

  it("should open date picker when calendar icon is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    const showPickerSpy = jest.spyOn(input, "showPicker").mockImplementation();
    
    const buttons = screen.getAllByLabelText("Open date picker");
    await user.click(buttons[0]); // Click the first button (calendar icon)
    
    expect(showPickerSpy).toHaveBeenCalled();
    showPickerSpy.mockRestore();
  });

  it("should open date picker when caret down icon is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<DatePicker />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    const showPickerSpy = jest.spyOn(input, "showPicker").mockImplementation();
    
    const buttons = screen.getAllByLabelText("Open date picker");
    await user.click(buttons[1]); // Click the second button (caret icon)
    
    expect(showPickerSpy).toHaveBeenCalled();
    showPickerSpy.mockRestore();
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(<DatePicker disabled />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    
    const buttons = screen.getAllByLabelText("Open date picker");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  describe("onChange", () => {
    let onChange: jest.Func;
    let user: UserEvent;

    beforeEach(() => {
      onChange = jest.fn();
      user = userEvent.setup();
    });

    it("should fire when value changes", async () => {
      const { container } = render(<DatePicker onChange={onChange} />);
      const input = container.querySelector('input[type="date"]') as HTMLInputElement;

      await user.type(input, "2024-01-15");
      expect(onChange).toHaveBeenCalled();
    });

    it("should not fire when disabled", async () => {
      const { container } = render(<DatePicker onChange={onChange} disabled />);
      const input = container.querySelector('input[type="date"]') as HTMLInputElement;

      await user.type(input, "2024-01-15");
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("sizes", () => {
    it("should apply sm size styles", () => {
      render(<DatePicker size={Size.Sm} data-testid="datepicker" />);
      const input = screen.getByTestId("datepicker");
      expect(input.className).toContain("text-sm/5");
    });

    it("should apply md size styles", () => {
      render(<DatePicker size={Size.Md} data-testid="datepicker" />);
      const input = screen.getByTestId("datepicker");
      expect(input.className).toContain("text-md/5");
    });

    it("should apply Lg size styles", () => {
      render(<DatePicker size={Size.Lg} data-testid="datepicker" />);
      const input = screen.getByTestId("datepicker");
      expect(input.className).toContain("text-lg/5");
    });
  });

  describe("radius", () => {
    it("should apply radius styles", () => {
      render(<DatePicker radius={Radius.Lg} data-testid="datepicker" />);
      const input = screen.getByTestId("datepicker");
      expect(input.className).toContain("rounded-lg");
    });
  });

  it("should pass through additional props", () => {
    const { container } = render(<DatePicker id="custom-id" name="birthdate" min="2020-01-01" max="2030-12-31" />);
    const input = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(input.id).toBe("custom-id");
    expect(input.name).toBe("birthdate");
    expect(input.min).toBe("2020-01-01");
    expect(input.max).toBe("2030-12-31");
  });
});

