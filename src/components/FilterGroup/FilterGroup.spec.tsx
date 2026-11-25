import { fireEvent, render, screen } from "@testing-library/react";

import { FilterGroup } from "./FilterGroup";

const options = [
  { value: "a", label: "Alpha", count: 3 },
  { value: "b", label: "Beta", count: 2 },
  { value: "c", label: "Gamma", count: 1 },
];

describe("FilterGroup", () => {
  it("lists the options with their counts under the title", () => {
    render(
      <FilterGroup
        title="Letters"
        options={options}
        selected={["b"]}
        onToggle={jest.fn()}
      />
    );
    expect(screen.getByText("Letters")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Beta" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Alpha" })).not.toBeChecked();
  });

  it("names the option pressed", () => {
    const onToggle = jest.fn();
    render(
      <FilterGroup
        title="Letters"
        options={options}
        selected={[]}
        onToggle={onToggle}
      />
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Gamma" }));
    expect(onToggle).toHaveBeenCalledWith("c");
  });

  it("folds long lists, keeps picked options shown, and unfolds", () => {
    render(
      <FilterGroup
        title="Letters"
        options={options}
        selected={["c"]}
        onToggle={jest.fn()}
        collapseAfter={1}
      />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).toBeNull();
    expect(screen.getByText("Gamma")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Show 1 more"));
    expect(screen.getByText("Beta")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText("Beta")).toBeNull();
  });

  it("draws a dash for each count when they could not be counted", () => {
    render(
      <FilterGroup
        title="Letters"
        options={options}
        selected={[]}
        onToggle={jest.fn()}
        hideCounts
      />
    );
    expect(screen.getAllByText("–")).toHaveLength(3);
    expect(screen.queryByText("3")).toBeNull();
  });
});
