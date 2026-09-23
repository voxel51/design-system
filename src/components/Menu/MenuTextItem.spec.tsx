import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";

import { MenuTextItem } from "./MenuTextItem";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("MenuTextItem", () => {
  it("should render its label", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>My item</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("My item")).toBeInTheDocument();
  });

  it("should fire onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem onClick={onClick}>Clickable</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled is true", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem disabled>Disabled</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Disabled").closest("button")!;
    expect(item).toBeDisabled();
  });

  it("should not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem disabled onClick={onClick}>
          Disabled
        </MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Disabled"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should render destructive label in destructive color", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem destructive>Delete</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const label = screen.getByText("Delete");
    expect(label.className).toMatch(/failure/i);
  });

  it("should pass className through to the button", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem className="custom-item">Item</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Item").closest("button")!;
    expect(item).toHaveClass("custom-item");
  });
});
