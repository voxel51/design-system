import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StatTile, StatTileGroup } from "./StatTile";

describe("StatTile", () => {
  it("shows the label, value and hint without a button", () => {
    render(<StatTile label="Most common" value="cat" hint="38%" />);
    expect(screen.getByText("Most common")).toBeInTheDocument();
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText("38%")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("is a toggle button described by its select label", async () => {
    const onSelect = jest.fn();
    render(
      <StatTile
        label="False positives"
        value="128"
        onSelect={onSelect}
        selected
        selectLabel="Show false positives"
      />
    );
    const button = screen.getByRole("button", { pressed: true });
    expect(button).toHaveAccessibleDescription("Show false positives");
    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("makes each compared value its own filter, with a toned delta", async () => {
    const onCompare = jest.fn();
    render(
      <StatTile
        label="Precision"
        value="0.81"
        onSelect={jest.fn()}
        delta="+0.04 (5%)"
        deltaTone="success"
        compare={{ value: "0.77", onSelect: onCompare, selected: true }}
      />
    );
    const [, second] = screen.getAllByRole("button");
    expect(second).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(second);
    expect(onCompare).toHaveBeenCalledTimes(1);
    expect(screen.getByText("+0.04 (5%)")).toHaveClass(
      "text-content-text-success"
    );
  });

  it("lays tiles out in a wrapping grid", () => {
    const { container } = render(
      <StatTileGroup>
        <StatTile label="a" value="1" />
      </StatTileGroup>
    );
    expect(container.firstChild).toHaveClass("grid");
  });
});
