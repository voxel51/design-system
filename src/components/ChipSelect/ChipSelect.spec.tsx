import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChipSelect } from "./ChipSelect";

const options = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
];

describe("ChipSelect", () => {
  it("shows the checked option's label unless a label is given", () => {
    const { rerender } = render(
      <ChipSelect
        aria-label="Sort by"
        value="oldest"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByRole("button", { name: "Sort by" })).toHaveTextContent(
      "Oldest"
    );

    rerender(
      <ChipSelect
        aria-label="Sort by"
        value="oldest"
        label="Oldest (3)"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByRole("button", { name: "Sort by" })).toHaveTextContent(
      "Oldest (3)"
    );
  });

  it("calls onChange with the id of the option picked", async () => {
    const onChange = jest.fn();
    render(
      <ChipSelect
        aria-label="Sort by"
        value="newest"
        onChange={onChange}
        options={options}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Sort by" }));
    await userEvent.click(await screen.findByText("Oldest"));
    expect(onChange).toHaveBeenCalledWith("oldest");
  });
});
