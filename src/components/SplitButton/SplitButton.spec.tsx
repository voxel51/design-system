import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuCheckItem } from "@/components/Menu";

import { SplitButton } from "./SplitButton";

describe("SplitButton", () => {
  it("renders a plain button without a menu", () => {
    render(<SplitButton>Execute</SplitButton>);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("runs the action from the main half and opens the menu from the chevron", async () => {
    const onClick = jest.fn();
    const onPick = jest.fn();
    render(
      <SplitButton
        onClick={onClick}
        menuLabel="Run options"
        menu={
          <MenuCheckItem select onClick={onPick}>
            Schedule
          </MenuCheckItem>
        }
      >
        Execute
      </SplitButton>
    );
    await userEvent.click(screen.getByRole("button", { name: "Execute" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Run options" }));
    await userEvent.click(await screen.findByText("Schedule"));
    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables both halves", () => {
    render(
      <SplitButton disabled menuLabel="Run options" menu={<span />}>
        Execute
      </SplitButton>
    );
    expect(screen.getByRole("button", { name: "Execute" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Run options" })).toBeDisabled();
  });
});
