import { fireEvent, render, screen } from "@testing-library/react";

import { FilterMenu } from "./FilterMenu";

describe("FilterMenu", () => {
  it("shows a plain button when no filter is on", () => {
    render(
      <FilterMenu>
        <span>controls</span>
      </FilterMenu>
    );

    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("shows the count and names it for assistive tech when filters are on", () => {
    render(
      <FilterMenu activeCount={2}>
        <span>controls</span>
      </FilterMenu>
    );

    expect(
      screen.getByRole("button", { name: "Filters, 2 active" })
    ).toHaveTextContent("2");
  });

  it("opens the panel with the controls", () => {
    render(
      <FilterMenu>
        <span>controls</span>
      </FilterMenu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByText("controls")).toBeInTheDocument();
  });

  it("clears the filters from the panel, enabled only while any is on", () => {
    const onClear = jest.fn();
    const { rerender } = render(
      <FilterMenu onClear={onClear}>
        <span>controls</span>
      </FilterMenu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("button", { name: "Clear all" })).toBeDisabled();

    rerender(
      <FilterMenu activeCount={1} onClear={onClear}>
        <span>controls</span>
      </FilterMenu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
