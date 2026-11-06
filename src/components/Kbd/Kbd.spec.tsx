import { render, screen } from "@testing-library/react";

import { Kbd } from "@/components/Kbd/Kbd";

describe("Kbd", () => {
  it("renders the key in a kbd element", () => {
    render(<Kbd>Esc</Kbd>);

    const key = screen.getByText("Esc");
    expect(key.tagName).toBe("KBD");
    expect(key).toHaveClass("font-mono");
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
