import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CollapsibleCard } from "./CollapsibleCard";

describe("CollapsibleCard", () => {
  it("shows the title, summary and content while open", () => {
    render(
      <CollapsibleCard title="Target" summary="All samples">
        <p>Body</p>
      </CollapsibleCard>
    );
    const toggle = screen.getByRole("button", { name: /Target/ });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveTextContent("All samples");
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("folds its content when the header is clicked", async () => {
    const onOpenChange = jest.fn();
    render(
      <CollapsibleCard title="Agent" onOpenChange={onOpenChange}>
        <p>Body</p>
      </CollapsibleCard>
    );
    await userEvent.click(screen.getByRole("button", { name: /Agent/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("shows actions only while open, outside the toggle", () => {
    const { rerender } = render(
      <CollapsibleCard
        title="Slices"
        open
        actions={<button type="button">Select all</button>}
      />
    );
    const action = screen.getByRole("button", { name: "Select all" });
    expect(screen.getByRole("button", { name: /Slices/ })).not.toContainElement(
      action
    );
    rerender(
      <CollapsibleCard
        title="Slices"
        open={false}
        actions={<button type="button">Select all</button>}
      />
    );
    expect(
      screen.queryByRole("button", { name: "Select all" })
    ).not.toBeInTheDocument();
  });
});
