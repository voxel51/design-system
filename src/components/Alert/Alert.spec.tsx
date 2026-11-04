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
    expect(screen.getByRole("alert")).toHaveClass("bg-content-bg-warning/10");
  });

  it("wraps a long message when multiline", () => {
    render(<Alert multiline>Long message</Alert>);
    expect(screen.getByText("Long message")).not.toHaveClass("truncate");
  });
});
