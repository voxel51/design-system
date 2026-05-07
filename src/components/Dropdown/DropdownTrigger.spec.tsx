import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuTextItem } from "@/components/Menu";
import { Size } from "@/types";


import { Dropdown } from "./Dropdown";
import { DropdownTrigger } from "./DropdownTrigger";

describe("DropdownTrigger", () => {
  it("should render with the given label", () => {
    render(
      <Dropdown trigger={<DropdownTrigger>Trigger</DropdownTrigger>}>
        {null}
      </Dropdown>
    );
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("should render a caret icon", () => {
    const { container } = render(
      <Dropdown trigger={<DropdownTrigger>Menu</DropdownTrigger>}>
        {null}
      </Dropdown>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is set", () => {
    render(
      <Dropdown trigger={<DropdownTrigger disabled>Menu</DropdownTrigger>}>
        {null}
      </Dropdown>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not open the menu when the trigger is disabled", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={<DropdownTrigger disabled>Menu</DropdownTrigger>}>
        <MenuTextItem>Item</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Menu"));
    expect(screen.queryByText("Item")).not.toBeInTheDocument();
  });

  it("should accept a size prop", () => {
    render(
      <Dropdown trigger={<DropdownTrigger size={Size.Md}>Menu</DropdownTrigger>}>
        {null}
      </Dropdown>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
