import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import DatepickerInput from "./DatepickerInput";

describe("DatepickerInput", () => {
  it("should render an input element", () => {
    render(<DatepickerInput />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render with a value", () => {
    render(<DatepickerInput value="2024-01-15" />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("2024-01-15");
  });

  it("should render icon buttons", () => {
    render(<DatepickerInput />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<DatepickerInput disabled />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("should disable icon buttons when disabled prop is true", () => {
    render(<DatepickerInput disabled />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  describe("onClick", () => {
    let onClick: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
      onClick = jest.fn();
      user = userEvent.setup();
    });

    it("should call onClick when input is clicked", async () => {
      render(<DatepickerInput onClick={onClick} />);
      const input = screen.getByRole("textbox");

      await user.click(input);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when left icon button is clicked", async () => {
      render(<DatepickerInput onClick={onClick} />);
      const buttons = screen.getAllByRole("button");
      const leftButton = buttons[0];

      await user.click(leftButton);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when right icon button is clicked", async () => {
      render(<DatepickerInput onClick={onClick} />);
      const buttons = screen.getAllByRole("button");
      const rightButton = buttons[1];

      await user.click(rightButton);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled and icon button is clicked", async () => {
      render(<DatepickerInput onClick={onClick} disabled />);
      const buttons = screen.getAllByRole("button");
      const leftButton = buttons[0];

      await user.click(leftButton);
      expect(onClick).not.toHaveBeenCalled();
    });

    it("should focus and click input when onClick is not provided and icon button is clicked", async () => {
      const inputClick = jest.fn();
      render(<DatepickerInput />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      input.onclick = inputClick;

      const buttons = screen.getAllByRole("button");
      const leftButton = buttons[0];

      await user.click(leftButton);
      expect(inputClick).toHaveBeenCalled();
      expect(document.activeElement).toBe(input);
    });
  });
});
