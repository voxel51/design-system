import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pill } from "./Pill";

describe("Pill", () => {
  const pillText = "Pill text";

  it("should render with text", () => {
    render(<Pill>{pillText}</Pill>);
    expect(screen.getByText(pillText)).toBeInTheDocument();
  });

  it("should pass through additional props to the component", () => {
    render(
      <Pill id="test-pill" data-testid="custom-pill">
        {pillText}
      </Pill>
    );

    const pill = screen.getByTestId("custom-pill");
    expect(pill).toHaveAttribute("id", "test-pill");
    expect(pill).toHaveAttribute("data-testid", "custom-pill");
  });

  it("should render status icon when isStatus is true", () => {
    const { container } = render(<Pill isStatus={true}>{pillText}</Pill>);

    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
  });

  it("should not render status icon when isStatus is false", () => {
    render(<Pill isStatus={false}>{pillText}</Pill>);

    const pill = screen.getByText(pillText);
    const svg = pill.querySelector("svg");

    expect(svg).not.toBeInTheDocument();
  });

  it("should not render status icon when isStatus is not provided", () => {
    render(<Pill>{pillText}</Pill>);

    const pill = screen.getByText(pillText);
    const svg = pill.querySelector("svg");

    expect(svg).not.toBeInTheDocument();
  });

  describe("onRemove", () => {
    it("renders a remove button when onRemove is provided", () => {
      render(<Pill onRemove={jest.fn()}>{pillText}</Pill>);
      expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });

    it("does not render a remove button when onRemove is omitted", () => {
      render(<Pill>{pillText}</Pill>);
      expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    });

    it("fires onRemove when the remove button is clicked", async () => {
      const user = userEvent.setup();
      const onRemove = jest.fn();
      render(<Pill onRemove={onRemove}>{pillText}</Pill>);

      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("stops propagation so wrapping click handlers are not fired", async () => {
      const user = userEvent.setup();
      const outerClick = jest.fn();
      const onRemove = jest.fn();
      render(
        <div onClick={outerClick}>
          <Pill onRemove={onRemove}>{pillText}</Pill>
        </div>
      );

      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(outerClick).not.toHaveBeenCalled();
    });
  });
});
