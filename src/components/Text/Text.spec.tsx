import { render, screen } from "@testing-library/react";

import { Text } from "./Text";

describe("Text", () => {
  it("should render with text", () => {
    const text = "some text here";
    render(<Text>{text}</Text>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  describe("color prop", () => {
    it("should apply a raw CSS color as an inline style for colors the token palette doesn't cover", () => {
      render(<Text color="#ff0000">custom text</Text>);
      const el = screen.getByText("custom text");
      expect(el).toHaveStyle({ color: "#ff0000" });
      expect(el).not.toHaveClass("text-content-text-primary");
    });
  });
});
