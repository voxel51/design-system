import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { type FC } from "react";

import { IconName, Radius, Size } from "@/types";

import { Icon } from "../Icons/Icon";
import { IconProps } from "../Icons/types";

import { Input, InputType } from "./Input";

const CheckmarkIcon: FC<IconProps> = (props) => (
  <Icon name={IconName.Check} {...(props as any)} />
);

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
    const { container } = render(<Input icon={IconName.Check} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should pass through additional props", () => {
    render(<Input id="custom-id" name="username" type={InputType.Email} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.id).toBe("custom-id");
    expect(input.name).toBe("username");
    expect(input.type).toBe("email");
  });
});
