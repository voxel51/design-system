import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Size } from "@/types";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
  const toggleLabel = "Toggle label";

  it("should render with label", () => {
    render(<Toggle label={toggleLabel} />);
    expect(screen.getByLabelText(toggleLabel)).toBeInTheDocument();
  });

  it("should render without label", () => {
    render(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Toggle
        id="test-toggle"
        data-testid="custom-toggle"
        label={toggleLabel}
      />
    );

    const toggle = screen.getByTestId("custom-toggle");
    expect(toggle).toHaveAttribute("id", "test-toggle");
    expect(toggle).toHaveAttribute("data-testid", "custom-toggle");
  });

  it("should handle checked state", () => {
    render(<Toggle checked label={toggleLabel} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("should handle click events", async () => {
    const handleChange = jest.fn();
    render(
      <Toggle
        onChange={handleChange}
        label={toggleLabel}
        data-testid="clickable-toggle"
      />
    );

    const toggle = screen.getByTestId("clickable-toggle");
    const user = userEvent.setup();

    await user.click(toggle);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should render disabled toggle", () => {
    render(<Toggle disabled label={toggleLabel} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeDisabled();
  });

  it("should not call onChange when disabled", async () => {
    const handleChange = jest.fn();
    render(<Toggle disabled onChange={handleChange} label={toggleLabel} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should render with size Sm", () => {
    render(<Toggle size={Size.Sm} label={toggleLabel} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should render with size Md", () => {
    render(<Toggle size={Size.Md} label={toggleLabel} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should render UnsetHint when showUnsetHint is true and checked is undefined", () => {
    render(<Toggle showUnsetHint label={toggleLabel} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByText(/click the toggle/i)).toBeInTheDocument();
  });

  it("should not render UnsetHint when showUnsetHint is false", () => {
    render(<Toggle showUnsetHint={false} label={toggleLabel} />);
    expect(screen.queryByText(/click the toggle/i)).not.toBeInTheDocument();
  });
});
