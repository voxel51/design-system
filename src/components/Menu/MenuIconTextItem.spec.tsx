import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { DeleteIcon, EditIcon } from "@/components/Icons";
import { IconName } from "@/types";

import { MenuIconTextItem } from "./MenuIconTextItem";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

describe("MenuIconTextItem", () => {
  it("should render text and subtext", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem
          icon={<EditIcon />}
          text="Edit item"
          subtext="Make changes"
        />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Edit item")).toBeInTheDocument();
    expect(screen.getByText("Make changes")).toBeInTheDocument();
  });

  it("should render without subtext", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem icon={<EditIcon />} text="Edit item" />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Edit item")).toBeInTheDocument();
  });

  it("should render an icon component", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem icon={EditIcon} text="Edit item" />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Edit item").closest("button")!;
    expect(item.querySelector("svg")).toBeInTheDocument();
  });

  it("should resolve a legacy icon name instead of printing it", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem icon={IconName.Edit} text="Edit item" />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Edit item").closest("button")!;
    expect(item.querySelector("svg")).toBeInTheDocument();
    expect(item).not.toHaveTextContent(IconName.Edit + "Edit item");
  });

  it("should render a custom icon node", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem
          icon={<span data-testid="custom-icon">★</span>}
          text="Starred"
        />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("should fire onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem icon={<EditIcon />} text="Edit" onClick={onClick} />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Edit"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled is true", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem icon={<EditIcon />} text="Edit" disabled />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Edit").closest("button")!;
    expect(item).toBeDisabled();
  });

  it("should not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem
          icon={<EditIcon />}
          text="Edit"
          disabled
          onClick={onClick}
        />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    await user.click(screen.getByText("Edit"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should render destructive text in destructive color", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem
          icon={<DeleteIcon />}
          text="Delete"
          subtext="Permanent"
          destructive
        />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    expect(screen.getByText("Delete").className).toMatch(/destructive/i);
    expect(screen.getByText("Permanent").className).toMatch(/destructive/i);
  });

  it("should pass className through to the button", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={trigger}>
        <MenuIconTextItem
          icon={<EditIcon />}
          text="Edit"
          className="custom-item"
        />
      </Dropdown>
    );
    await user.click(screen.getByText("Open menu"));
    const item = screen.getByText("Edit").closest("button")!;
    expect(item).toHaveClass("custom-item");
  });
});
