import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";

import { MenuSeparator } from "./MenuSeparator";
import { MenuTextItem } from "./MenuTextItem";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("MenuSeparator", () => {
  it("should render with role=separator", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>A</MenuTextItem>
        <MenuSeparator />
        <MenuTextItem>B</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("should pass className through to the root", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>A</MenuTextItem>
        <MenuSeparator className="custom-separator" />
        <MenuTextItem>B</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByRole("separator")).toHaveClass("custom-separator");
  });
});
