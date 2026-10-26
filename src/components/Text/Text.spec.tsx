import { fireEvent, render, screen } from "@testing-library/react";

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

  describe("gradient prop", () => {
    it("should fill the text with the gradient instead of the color", () => {
      render(
        <Text gradient color="text-secondary">
          fancy
        </Text>
      );
      const el = screen.getByText("fancy");
      expect(el).toHaveClass("bg-clip-text", "text-transparent");
      expect(el).not.toHaveClass("text-content-text-secondary");
    });
  });

  describe("truncate prop", () => {
    const widths = (el: HTMLElement, scroll: number, client: number) => {
      Object.defineProperty(el, "scrollWidth", { value: scroll });
      Object.defineProperty(el, "clientWidth", { value: client });
    };

    it("should cut the text to one line", () => {
      render(<Text truncate>long title</Text>);
      expect(screen.getByText("long title")).toHaveClass("truncate", "block");
    });

    it("should show the full text in a tooltip only when cut", () => {
      render(<Text truncate>long title</Text>);
      const el = screen.getByText("long title");
      widths(el, 300, 100);
      fireEvent.mouseOver(el);
      fireEvent.mouseEnter(el.parentElement!);
      expect(screen.getByRole("tooltip")).toHaveTextContent("long title");
    });

    it("should show no tooltip when the text fits", () => {
      render(<Text truncate>short</Text>);
      const el = screen.getByText("short");
      widths(el, 100, 100);
      fireEvent.mouseOver(el);
      fireEvent.mouseEnter(el.parentElement!);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
