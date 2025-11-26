import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  describe("onClick", () => {
    let onClick: jest.Func;
    let user: UserEvent;

    beforeEach(() => {
      onClick = jest.fn();
      user = userEvent.setup();
    });

    it("should fire when clicked", async () => {
      render(<Button onClick={onClick}></Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).toHaveBeenCalled();
    });

    it("should not fire when disabled", async () => {
      render(<Button onClick={onClick} disabled></Button>);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
