import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import { IconName } from "@/types/icons";

import DatepickerIconButton from "./DatepickerIconButton";

describe("DatepickerIconButton", () => {
  describe("rendering", () => {
    it("should render a button element", () => {
      const onClick = jest.fn();
      render(
        <DatepickerIconButton onClick={onClick} iconName={IconName.CaretDown} />
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("onClick", () => {
    let onClick: jest.Mock;
    let user: UserEvent;

    beforeEach(() => {
      onClick = jest.fn();
      user = userEvent.setup();
    });

    it("should call onClick when button is clicked", async () => {
      render(
        <DatepickerIconButton onClick={onClick} iconName={IconName.CaretDown} />
      );
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", async () => {
      render(
        <DatepickerIconButton
          onClick={onClick}
          iconName={IconName.CaretDown}
          disabled
        />
      );
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("button type", () => {
    it("should have type button", () => {
      const onClick = jest.fn();
      render(
        <DatepickerIconButton onClick={onClick} iconName={IconName.CaretDown} />
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });
});
