import { render, screen } from "@testing-library/react";

import { Kbd } from "@/components/Kbd/Kbd";

describe("Kbd", () => {
  it("renders the key in a kbd element", () => {
    render(<Kbd>Esc</Kbd>);

    const key = screen.getByText("Esc");
    expect(key.tagName).toBe("KBD");
    expect(key).toHaveClass("font-mono");
  });

  it("is the 28px keycap by default", () => {
    render(<Kbd>Esc</Kbd>);

    const key = screen.getByText("Esc");
    expect(key).toHaveClass("min-h-7", "min-w-7", "px-1");
    expect(key).not.toHaveClass("min-h-5", "px-1.5");
  });

  it("is the 20px keycap at size sm", () => {
    render(<Kbd size="sm">Esc</Kbd>);

    const key = screen.getByText("Esc");
    expect(key).toHaveClass("min-h-5", "min-w-7", "px-1.5", "font-mono");
    expect(key).not.toHaveClass("min-h-7", "px-1");
  });

  it("keeps the caller's classes and props", () => {
    render(
      <Kbd className="ml-1" title="Escape">
        Esc
      </Kbd>
    );

    expect(screen.getByTitle("Escape")).toHaveClass("ml-1");
  });
});
