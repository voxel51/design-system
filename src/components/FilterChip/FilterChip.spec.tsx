import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FilterChip } from "./FilterChip";

describe("FilterChip", () => {
  it("renders the text and a locale formatted count", () => {
    render(<FilterChip count={1234}>demo</FilterChip>);
    expect(screen.getByRole("button", { name: /demo/ })).toBeInTheDocument();
    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
  });

  it("reflects selected in aria-pressed", () => {
    const { rerender } = render(<FilterChip>demo</FilterChip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<FilterChip selected>demo</FilterChip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onClick", async () => {
    const onClick = jest.fn();
    render(<FilterChip onClick={onClick}>demo</FilterChip>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
