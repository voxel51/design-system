import { render, screen } from "@testing-library/react";

import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders the message and the action", () => {
    render(<Alert action={<button>Retry</button>}>Something failed</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("tints the surface by tone", () => {
    render(<Alert tone="warning">Careful</Alert>);
    expect(screen.getByRole("status")).toHaveClass("bg-content-bg-warning/10");
  });

  it("wraps a long message when multiline", () => {
    render(<Alert multiline>Long message</Alert>);
    expect(screen.getByText("Long message")).not.toHaveClass("truncate");
  });

  it("announces only a failure urgently", () => {
    render(<Alert tone="info">Seats</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Seats");
  });

  it("draws its action in the tone's colour", () => {
    render(<Alert action={<button>Retry</button>}>Failed</Alert>);
    const wrapper = screen.getByText("Retry").parentElement as HTMLElement;
    expect(wrapper).toHaveClass("text-content-text-failure");
    expect(wrapper.className).toContain("[&_:is(a,button)]:text-current");
  });
});
