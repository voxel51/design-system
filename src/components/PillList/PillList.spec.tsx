import { fireEvent, render, screen } from "@testing-library/react";

import { PillList } from "./PillList";

const items = Array.from({ length: 20 }, (_, i) => `model-${i}`);

describe("PillList", () => {
  it("shows every pill when they fit the max", () => {
    render(<PillList items={["a", "b"]} />);

    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("shows the first pills, and the rest on request", () => {
    render(<PillList items={items} />);

    expect(screen.queryByText("model-19")).not.toBeInTheDocument();
    expect(screen.getByText("+8 more")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    fireEvent.click(screen.getByText("+8 more"));
    expect(screen.getByText("model-19")).toBeInTheDocument();
    expect(screen.getByText("Show less")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("stays open while expanded is set", () => {
    const { rerender } = render(<PillList items={items} expanded />);

    expect(screen.getByText("model-19")).toBeInTheDocument();
    expect(screen.queryByText("Show less")).not.toBeInTheDocument();

    rerender(<PillList items={items} />);
    expect(screen.queryByText("model-19")).not.toBeInTheDocument();
    expect(screen.getByText("+8 more")).toBeInTheDocument();
  });
});
