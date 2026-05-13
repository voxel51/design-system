import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuTextItem } from "@/components/Menu";

import { Dropdown } from "./Dropdown";
import { DropdownTrigger } from "./DropdownTrigger";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("Dropdown", () => {
  it("should render the trigger", () => {
    render(<Dropdown trigger={trigger}>{null}</Dropdown>);
    expect(screen.getByText("Open menu")).toBeInTheDocument();
  });

  it("should not show items before the trigger is clicked", () => {
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>Hidden item</MenuTextItem>
      </Dropdown>
    );
    expect(screen.queryByText("Hidden item")).not.toBeInTheDocument();
  });

  it("should show items after the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>Visible item</MenuTextItem>
      </Dropdown>
    );

    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Visible item")).toBeInTheDocument();
  });

  it("should close after an item is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem onClick={onClick}>Click me</MenuTextItem>
      </Dropdown>
    );

    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Click me"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("should close when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>Item</MenuTextItem>
      </Dropdown>
    );

    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Item")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Item")).not.toBeInTheDocument();
  });

  it("should expose role=menu when open", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuTextItem>Item</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should pass className through to the root", () => {
    const { container } = render(
      <Dropdown trigger={trigger} className="custom-root">
        {null}
      </Dropdown>
    );
    expect(container.querySelector(".custom-root")).toBeInTheDocument();
  });

  it("should not open when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger} disabled>
        <MenuTextItem>Item</MenuTextItem>
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.queryByText("Item")).not.toBeInTheDocument();
  });
});
