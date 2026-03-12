import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

const CONTENT = "Enter text to set a value";

describe("Card", () => {
  it("should render card with children provided", () => {
    render(<Card>{CONTENT}</Card>);
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
});
