import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Radius, Size } from "@/types";

import { ResizeBehavior, TextArea } from "./TextArea";

describe("TextArea", () => {
  // Basic Rendering
  it("should render textarea element", () => {
    render(<TextArea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render with placeholder", () => {
    render(<TextArea placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText("Enter text");
    expect(textarea).toBeInTheDocument();
  });

  // Props Pass-through
  it("should pass through native textarea attributes", () => {
    render(
      <TextArea
        id="test-textarea"
        data-testid="custom-textarea"
        placeholder="Test placeholder"
        rows={5}
      />
    );
    const textarea = screen.getByTestId("custom-textarea");
    expect(textarea).toHaveAttribute("id", "test-textarea");
    expect(textarea).toHaveAttribute("placeholder", "Test placeholder");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  // User Interaction
  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<TextArea data-testid="input-textarea" />);
    const textarea = screen.getByTestId("input-textarea");

    await user.type(textarea, "Hello World");
    expect(textarea).toHaveValue("Hello World");
  });

  it("should handle onChange events", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<TextArea onChange={handleChange} data-testid="change-textarea" />);

    const textarea = screen.getByTestId("change-textarea");
    await user.type(textarea, "Test");

    expect(handleChange).toHaveBeenCalled();
  });

  // Disabled State
  it("should be disabled when disabled prop is true", () => {
    render(<TextArea disabled data-testid="disabled-textarea" />);
    const textarea = screen.getByTestId("disabled-textarea");
    expect(textarea).toBeDisabled();
  });

  it("should not accept input when disabled", async () => {
    const user = userEvent.setup();
    render(<TextArea disabled data-testid="disabled-textarea" />);
    const textarea = screen.getByTestId("disabled-textarea");

    await user.type(textarea, "Test");
    expect(textarea).toHaveValue("");
  });

  // Size Variants
  it("should apply correct classes for Size.Xs", () => {
    render(<TextArea size={Size.Xs} data-testid="xs-textarea" />);
    const textarea = screen.getByTestId("xs-textarea");
    expect(textarea).toHaveClass("px-2.5", "py-1.5", "text-xs/5");
  });

  it("should apply correct classes for Size.Lg", () => {
    render(<TextArea size={Size.Lg} data-testid="lg-textarea" />);
    const textarea = screen.getByTestId("lg-textarea");
    expect(textarea).toHaveClass("px-4", "py-3", "text-lg/9");
  });

  // Radius Variants
  it("should apply correct radius classes", () => {
    render(<TextArea radius={Radius.Md} data-testid="radius-textarea" />);
    const textarea = screen.getByTestId("radius-textarea");
    expect(textarea).toHaveClass("rounded-md");
  });

  // Error State
  it("should apply error styling when error prop is true", () => {
    render(<TextArea error data-testid="error-textarea" />);
    const textarea = screen.getByTestId("error-textarea");
    expect(textarea).toHaveClass("border-semantic-destructive");
  });

  // Resize Behavior
  it("should apply resize-none class when resize is none", () => {
    render(
      <TextArea resize={ResizeBehavior.None} data-testid="resize-textarea" />
    );
    const textarea = screen.getByTestId("resize-textarea");
    expect(textarea).toHaveClass("resize-none");
  });

  it("should apply resize-y class by default", () => {
    render(<TextArea data-testid="resize-textarea" />);
    const textarea = screen.getByTestId("resize-textarea");
    expect(textarea).toHaveClass("resize-y");
  });

  // Custom ClassName
  it("should merge custom className with default classes", () => {
    render(<TextArea className="custom-class" data-testid="custom-textarea" />);
    const textarea = screen.getByTestId("custom-textarea");
    expect(textarea).toHaveClass("custom-class");
    expect(textarea).toHaveClass("w-full"); // Still has base classes
  });
});
