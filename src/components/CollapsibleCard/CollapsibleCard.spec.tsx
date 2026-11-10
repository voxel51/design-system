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
    expect(
      document.getElementById(toggle.getAttribute("aria-controls") ?? "")
    ).toContainElement(screen.getByText("Body"));
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

  it("rules off the content under the header", () => {
    render(
      <CollapsibleCard title="Agent settings">
        <p>Body</p>
      </CollapsibleCard>
    );
    expect(screen.getByText("Body").parentElement).toHaveClass("border-t");
  });

  it("draws no content strip without children", () => {
    const { container } = render(<CollapsibleCard title="Import" />);
    expect(container.querySelector(".border-t")).toBeNull();
    expect(screen.getByRole("button", { name: /Import/ })).not.toHaveAttribute(
      "aria-controls"
    );
  });

  it("shows a spinner in place of the chevron while loading, still folding", async () => {
    render(
      <CollapsibleCard title="Import" loading>
        <p>Body</p>
      </CollapsibleCard>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Collapse", hidden: true })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Import/ }));
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("keeps the content mounted but hidden while closed with keepMounted", async () => {
    render(
      <CollapsibleCard title="Query" keepMounted defaultOpen={false}>
        <input aria-label="Field" defaultValue="kept" />
      </CollapsibleCard>
    );
    expect(screen.queryByRole("textbox", { name: "Field" })).toBeNull();
    expect(screen.getByLabelText("Field", { selector: "input" })).toHaveValue(
      "kept"
    );
    await userEvent.click(screen.getByRole("button", { name: /Query/ }));
    expect(screen.getByRole("textbox", { name: "Field" })).toBeVisible();
  });
});
