import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { type FC } from "react";

import { Radius, Size } from "@/types";

import { CheckIcon, type IconProps } from "../Icons";

import { Input, InputType } from "./Input";

const CheckmarkIcon: FC<IconProps> = (props) => <CheckIcon {...props} />;

describe("Input", () => {
  it("should render an input element", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render with a value", () => {
    render(<Input value="test value" readOnly />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("test value");
  });

  it("should render with a placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    const input = screen.getByPlaceholderText("Enter text...");
    expect(input).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  describe("onChange", () => {
    let onChange: jest.Func;
    let user: UserEvent;

    beforeEach(() => {
      onChange = jest.fn();
      user = userEvent.setup();
    });

    it("should fire when value changes", async () => {
      render(<Input onChange={onChange} />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test");
      expect(onChange).toHaveBeenCalled();
    });

    it("should not fire when disabled", async () => {
      render(<Input onChange={onChange} disabled />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test");
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("sizes", () => {
    it("should apply sm size styles", () => {
      render(<Input size={Size.Sm} data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input.className).toContain("text-sm/5");
    });

    it("should apply md size styles", () => {
      render(<Input size={Size.Md} data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input.className).toContain("text-md/5");
    });

    it("should apply Lg size styles", () => {
      render(<Input size={Size.Lg} data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input.className).toContain("text-lg/5");
    });
  });

  describe("radius", () => {
    it("should apply radius styles", () => {
      render(<Input radius={Radius.Lg} data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input.className).toContain("rounded-lg");
    });
  });

  it("should render an FC icon if provided", () => {
    const { container } = render(<Input icon={CheckmarkIcon} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render a string icon if provided", () => {
    const { container } = render(<Input icon={CheckIcon} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should pass through additional props", () => {
    render(<Input id="custom-id" name="username" type={InputType.Email} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.id).toBe("custom-id");
    expect(input.name).toBe("username");
    expect(input.type).toBe("email");
  });

  // The error state is surfaced via `aria-invalid` (set on the DOM node directly,
  // since Headless UI's Input doesn't forward the prop) plus the error border color.
  describe("error prop", () => {
    it("marks the input invalid when error is true", () => {
      render(<Input error data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("border-content-border-error");
    });

    it("is not marked invalid by default", () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId("input");
      expect(input).not.toHaveAttribute("aria-invalid");
      expect(input.className).toContain("border-content-border-default");
    });
  });

  describe("email validation", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("does not flag an empty email", () => {
      render(<Input type={InputType.Email} data-testid="input" />);
      expect(screen.getByTestId("input")).not.toHaveAttribute("aria-invalid");
    });

    it("flags a malformed email typed into an uncontrolled input", async () => {
      render(<Input type={InputType.Email} data-testid="input" />);
      const input = screen.getByTestId("input");

      await user.type(input, "not-an-email");

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("border-content-border-error");
    });

    it("clears the error once the email is valid", async () => {
      render(<Input type={InputType.Email} data-testid="input" />);
      const input = screen.getByTestId("input");

      await user.type(input, "user@example.com");

      expect(input).not.toHaveAttribute("aria-invalid");
      expect(input.className).toContain("border-content-border-default");
    });

    it("validates a controlled value", () => {
      render(
        <Input
          type={InputType.Email}
          value="bad"
          readOnly
          data-testid="input"
        />
      );
      expect(screen.getByTestId("input")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not flag other input types", async () => {
      render(<Input type={InputType.Text} data-testid="input" />);
      const input = screen.getByTestId("input");

      await user.type(input, "not-an-email");

      expect(input).not.toHaveAttribute("aria-invalid");
    });
  });

  describe("tel input", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("blocks non-numeric characters", async () => {
      render(<Input type={InputType.Tel} data-testid="input" />);
      const input = screen.getByTestId("input") as HTMLInputElement;

      await user.type(input, "1a2b3");

      expect(input.value).toBe("123");
    });

    it("allows common phone formatting characters", async () => {
      render(<Input type={InputType.Tel} data-testid="input" />);
      const input = screen.getByTestId("input") as HTMLInputElement;

      await user.type(input, "+1 (555) 123-4567");

      expect(input.value).toBe("+1 (555) 123-4567");
    });
  });

  describe("password toggle", () => {
    let user: UserEvent;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("toggles the rendered type between password and text", async () => {
      const { container } = render(<Input type={InputType.Password} />);
      const input = container.querySelector("input") as HTMLInputElement;
      expect(input.type).toBe("password");

      await user.click(screen.getByRole("button", { name: /show password/i }));
      expect(input.type).toBe("text");

      await user.click(screen.getByRole("button", { name: /hide password/i }));
      expect(input.type).toBe("password");
    });

    it("does not render a toggle for non-password inputs", () => {
      render(<Input type={InputType.Text} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("number input", () => {
    it("renders type=number and hides the native spinners", () => {
      render(<Input type={InputType.Number} data-testid="input" />);
      const input = screen.getByTestId("input") as HTMLInputElement;
      expect(input.type).toBe("number");
      expect(input.className).toContain("appearance-none");
    });
  });
});
