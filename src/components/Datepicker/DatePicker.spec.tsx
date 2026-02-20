import { render, screen } from "@testing-library/react";

import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  describe("rendering", () => {
    it("should render a text input element", () => {
      render(<DatePicker />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render icon buttons", () => {
      render(<DatePicker />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("should render with a selected date", () => {
      const selectedDate = new Date("2024-01-15");
      render(<DatePicker selected={selectedDate} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });

    it("should render with null selected date", () => {
      render(<DatePicker selected={null} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<DatePicker disabled />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });
  });

  describe("minDate and maxDate", () => {
    it("should accept minDate prop", () => {
      const minDate = new Date("2024-01-01");
      render(<DatePicker minDate={minDate} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should accept maxDate prop", () => {
      const maxDate = new Date("2024-12-31");
      render(<DatePicker maxDate={maxDate} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should accept both minDate and maxDate", () => {
      const minDate = new Date("2024-01-01");
      const maxDate = new Date("2024-12-31");
      render(<DatePicker minDate={minDate} maxDate={maxDate} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("showTimeSelect", () => {
    it("should render without time select by default", () => {
      render(<DatePicker />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render with time select", () => {
      render(<DatePicker showTimeSelect />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("should render with time select only", () => {
      render(<DatePicker showTimeSelectOnly />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("additional props", () => {
    it("should pass through additional props to react-datepicker", () => {
      render(<DatePicker id="custom-id" name="birthdate" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });
  });
});
