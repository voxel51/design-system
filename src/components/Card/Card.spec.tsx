import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

const CONTENT = "Enter text to set a value";

describe("Card", () => {
  it("should render card with children provided", () => {
    render(<Card>{CONTENT}</Card>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });

  it("draws a subtle border with `border` and keeps it off the DOM", () => {
    render(<Card border>{CONTENT}</Card>);
    const card = screen.getByText(CONTENT);
    expect(card).toHaveClass("border-1");
    expect(card).not.toHaveAttribute("border");
  });
});
