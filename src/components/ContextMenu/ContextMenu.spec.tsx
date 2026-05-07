import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuTextItem } from "@/components/Menu";

import { ContextMenu } from "./ContextMenu";

const menu = (
  <>
    <MenuTextItem>First</MenuTextItem>
    <MenuTextItem>Second</MenuTextItem>
  </>
);

describe("ContextMenu", () => {
  it("should render its children", () => {
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    expect(screen.getByText("Right-click area")).toBeInTheDocument();
  });

  it("should not show items before a right-click", () => {
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });

  it("should open the menu on right-click", () => {
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("should suppress the native context menu", () => {
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(screen.getByText("Right-click area"), event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("should close after an item is clicked and fire its onClick", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <ContextMenu
        menu={
          <>
            <MenuTextItem onClick={onClick}>Click me</MenuTextItem>
          </>
        }
      >
        <div>Right-click area</div>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByText("Right-click area"));
    await user.click(screen.getByText("Click me"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Click me")).not.toBeInTheDocument();
  });

  it("should close when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(screen.getByText("First")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });

  it("should not open when disabled", () => {
    render(
      <ContextMenu menu={menu} disabled>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });

  it("should not suppress the native menu when disabled", () => {
    render(
      <ContextMenu menu={menu} disabled>
        <div>Right-click area</div>
      </ContextMenu>
    );
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(screen.getByText("Right-click area"), event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("should expose role=menu when open", () => {
    render(
      <ContextMenu menu={menu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("should call user-provided onContextMenu before the default behavior", () => {
    const onContextMenu = jest.fn();
    render(
      <ContextMenu menu={menu} onContextMenu={onContextMenu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(onContextMenu).toHaveBeenCalledTimes(1);
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("should respect onContextMenu calling preventDefault to opt out", () => {
    const onContextMenu = jest.fn((e) => e.preventDefault());
    render(
      <ContextMenu menu={menu} onContextMenu={onContextMenu}>
        <div>Right-click area</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click area"));
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });
});
