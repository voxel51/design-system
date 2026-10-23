import { render, screen } from "@testing-library/react";

import { OverflowRow } from "./OverflowRow";

const ITEM_WIDTH = 50;

const withWidth = (container: number) => {
  jest
    .spyOn(HTMLElement.prototype, "offsetWidth", "get")
    .mockImplementation(function (this: HTMLElement) {
      return this.dataset.testid === "row" ? container : ITEM_WIDTH;
    });
};

const items = ["a", "b", "c", "d"].map((id) => <button key={id}>{id}</button>);

describe("OverflowRow", () => {
  afterEach(() => jest.restoreAllMocks());

  it("shows every item when they fit", () => {
    withWidth(400);
    render(<OverflowRow data-testid="row">{items}</OverflowRow>);

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("moves the last items into the menu when they do not fit", () => {
    withWidth(150);
    render(
      <OverflowRow data-testid="row" label="More actions">
        {items}
      </OverflowRow>
    );

    expect(screen.getByRole("button", { name: "a" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "b" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "d" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "More actions" })
    ).toBeInTheDocument();
  });
});
