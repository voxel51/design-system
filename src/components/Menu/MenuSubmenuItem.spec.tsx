import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { PuzzleIcon } from "@/components/Icons";

import { MenuIconTextItem } from "./MenuIconTextItem";
import { MenuSubmenuItem } from "./MenuSubmenuItem";
import { MenuTextItem } from "./MenuTextItem";

const trigger = <DropdownTrigger>Open menu</DropdownTrigger>;

/**
 * Renders a dropdown with one submenu row and opens it. Base UI opens menus
 * a frame after the press and leaves `pointer-events: none` on a freshly
 * opened popup in jsdom, so the user skips that check and every lookup that
 * follows an open waits for it.
 */
const renderOpenMenu = async (
  options: { disabled?: boolean; onSelect?: () => void } = {}
): Promise<ReturnType<typeof userEvent.setup>> => {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  render(
    <Dropdown trigger={trigger}>
      <MenuIconTextItem icon={<PuzzleIcon />} text="Top-level item" />
      <MenuSubmenuItem
        icon={<PuzzleIcon />}
        text="Panels"
        subtext="Open a panel"
        disabled={options.disabled}
      >
        <MenuTextItem onClick={options.onSelect}>Histograms</MenuTextItem>
        <MenuTextItem>Embeddings</MenuTextItem>
      </MenuSubmenuItem>
    </Dropdown>
  );
  await user.click(screen.getByText("Open menu"));
  await screen.findByRole("menu");
  return user;
};

const submenuRow = (): HTMLElement =>
  screen.getByText("Panels").closest<HTMLElement>('[aria-haspopup="menu"]')!;

describe("MenuSubmenuItem", () => {
  it("should render the row with text, subtext and a trailing chevron, submenu closed", async () => {
    await renderOpenMenu();

    expect(screen.getByText("Panels")).toBeInTheDocument();
    expect(screen.getByText("Open a panel")).toBeInTheDocument();
    expect(submenuRow()).toHaveAttribute("role", "menuitem");
    expect(submenuRow()).toHaveAttribute("aria-expanded", "false");
    expect(submenuRow().querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("Histograms")).not.toBeInTheDocument();
  });

  it("should open the submenu on click and keep the parent open", async () => {
    const user = await renderOpenMenu();
    await user.click(screen.getByText("Panels"));

    expect(await screen.findByText("Histograms")).toBeInTheDocument();
    expect(screen.getByText("Top-level item")).toBeInTheDocument();
    expect(submenuRow()).toHaveAttribute("aria-expanded", "true");
  });

  it("should open the submenu when the pointer rests on the row", async () => {
    const user = await renderOpenMenu();
    await user.hover(screen.getByText("Panels"));

    expect(await screen.findByText("Histograms")).toBeInTheDocument();
  });

  it("should close both levels when a submenu item is selected", async () => {
    const onSelect = jest.fn();
    const user = await renderOpenMenu({ onSelect });
    await user.click(screen.getByText("Panels"));
    await user.click(await screen.findByText("Histograms"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText("Histograms")).not.toBeInTheDocument();
      expect(screen.queryByText("Top-level item")).not.toBeInTheDocument();
    });
  });

  it("should open on ArrowRight from the row and close on ArrowLeft, keeping the parent open", async () => {
    const user = await renderOpenMenu();

    act(() => submenuRow().focus());
    await user.keyboard("{ArrowRight}");
    expect(await screen.findByText("Histograms")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(screen.queryByText("Histograms")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Top-level item")).toBeInTheDocument();
    expect(submenuRow()).toHaveFocus();
  });

  it("should close only the submenu on Escape", async () => {
    const user = await renderOpenMenu();
    await user.click(screen.getByText("Panels"));
    expect(await screen.findByText("Histograms")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Histograms")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Top-level item")).toBeInTheDocument();
  });

  it("should not open when disabled", async () => {
    const user = await renderOpenMenu({ disabled: true });

    await user.hover(screen.getByText("Panels"));
    await user.click(screen.getByText("Panels"));
    // give a hover or press a frame to (wrongly) open the flyout
    await act(() => new Promise((resolve) => window.setTimeout(resolve, 200)));

    expect(submenuRow()).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByText("Histograms")).not.toBeInTheDocument();
    expect(screen.getByText("Top-level item")).toBeInTheDocument();
  });
});
