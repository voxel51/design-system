import { render, screen } from "@testing-library/react";

import { OverflowRow, useOverflowRowCompact } from "./OverflowRow";

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

  describe("compactable", () => {
    const Item = ({ id }: { id: string }) => {
      const compact = useOverflowRowCompact();
      return <button data-compact={compact}>{compact ? "" : id}</button>;
    };
    const compactItems = ["a", "b", "c", "d"].map((id) => (
      <Item key={id} id={id} />
    ));

    const withCompactWidth = (container: number) => {
      jest
        .spyOn(HTMLElement.prototype, "offsetWidth", "get")
        .mockImplementation(function (this: HTMLElement) {
          if (this.dataset.testid === "row") return container;
          return this.querySelector('[data-compact="true"]') ? 20 : ITEM_WIDTH;
        });
    };

    it("goes compact before moving any item into the menu", () => {
      withCompactWidth(100);
      render(
        <OverflowRow data-testid="row" label="More actions" compactable>
          {compactItems}
        </OverflowRow>
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(4);
      buttons.forEach((b) => expect(b).toHaveAttribute("data-compact", "true"));
    });

    it("reports how it fits, so neighbours can shrink alongside", () => {
      withCompactWidth(100);
      const onFitChange = jest.fn();
      render(
        <OverflowRow data-testid="row" compactable onFitChange={onFitChange}>
          {compactItems}
        </OverflowRow>
      );

      expect(onFitChange).toHaveBeenLastCalledWith({
        compact: true,
        labelMax: null,
        folded: false,
      });
    });

    it("stays full when every item fits", () => {
      withCompactWidth(400);
      render(
        <OverflowRow data-testid="row" compactable>
          {compactItems}
        </OverflowRow>
      );

      screen
        .getAllByRole("button")
        .forEach((b) => expect(b).toHaveAttribute("data-compact", "false"));
    });

    it("folds the rest once compact items no longer fit", () => {
      withCompactWidth(60);
      render(
        <OverflowRow data-testid="row" label="More actions" compactable>
          {compactItems}
        </OverflowRow>
      );

      expect(
        screen.getByRole("button", { name: "More actions" })
      ).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });
});
