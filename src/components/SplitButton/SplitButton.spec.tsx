import { fireEvent, render, screen } from "@testing-library/react";

import { MenuTextItem } from "@/components/Menu";

import { SplitButton } from "./SplitButton";

describe("SplitButton", () => {
  it("fires the primary action without opening the menu", () => {
    const onClick = jest.fn();
    render(
      <SplitButton
        onClick={onClick}
        menu={<MenuTextItem>Run now</MenuTextItem>}
      >
        Schedule
      </SplitButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Schedule" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Run now")).not.toBeInTheDocument();
  });

  it("labels the menu trigger", () => {
    render(
      <SplitButton menu={<MenuTextItem>Run now</MenuTextItem>}>
        Schedule
      </SplitButton>
    );
    expect(
      screen.getByRole("button", { name: "More actions" })
    ).toBeInTheDocument();
  });

  it("disables both segments", () => {
    render(
      <SplitButton disabled menu={<MenuTextItem>Run now</MenuTextItem>}>
        Schedule
      </SplitButton>
    );
    screen.getAllByRole("button").forEach((b) => expect(b).toBeDisabled());
  });
});
