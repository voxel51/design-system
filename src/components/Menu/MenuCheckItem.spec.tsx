import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";

import { MenuCheckItem } from "./MenuCheckItem";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("MenuCheckItem", () => {
  it("should render its label", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem>Option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Option")).toBeInTheDocument();
  });

  it("should show a checkmark when checked", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem checked>Checked option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));

    const item = screen.getByText("Checked option").closest("button")!;
    expect(item).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should not show a checkmark when unchecked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem checked={false}>Unchecked option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));

    const item = screen.getByText("Unchecked option").closest("button")!;
    expect(item).toHaveAttribute("aria-checked", "false");
  });

  it("should fire onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem onClick={onClick}>Option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Option"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled is true", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem disabled>Option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Option").closest("button")!;
    expect(item).toBeDisabled();
  });

  it("should not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem disabled onClick={onClick}>
          Option
        </MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Option"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should pass className through to the button", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuCheckItem className="custom-item">Option</MenuCheckItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Option").closest("button")!;
    expect(item).toHaveClass("custom-item");
  });
});
