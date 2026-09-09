import type { Locator, Page } from "@playwright/test";

import { ariaEntries } from "../../e2e/aria";

/**
 * Drives a voodo {@link ContextMenu} in a Playwright test.
 *
 * `root` is the right-clickable area, which is the element the consuming app
 * passed props such as `data-testid` to. `page` is required because the menu
 * panel is portalled to the document body. The panel is resolved through the
 * `aria-controls` of the menu's own trigger, so several context menus on one
 * page never collide.
 *
 * @example
 * ```ts
 * const menu = new ContextMenuPom(page.getByTestId("track-bar"), page);
 * await menu.choose("Delete track");
 * ```
 */
export class ContextMenuPom {
  constructor(
    readonly root: Locator,
    readonly page: Page
  ) {}

  /**
   * The Headless UI menu button that `ContextMenu` renders immediately after
   * the right-clickable area. It is invisible and never clicked directly; it
   * only carries the menu's ARIA state.
   */
  trigger(): Locator {
    return this.root.locator(
      "xpath=following-sibling::*[@aria-haspopup='menu'][1]"
    );
  }

  /** The menu panel. Only mounted while the menu is open; call {@link open} first. */
  async menu(): Promise<Locator> {
    const id = await this.trigger().getAttribute("aria-controls");
    if (!id) {
      throw new Error("ContextMenuPom: the menu is not mounted; open first");
    }
    return this.page.locator(`[id="${id}"]`);
  }

  /** Whether the menu panel is open. */
  async isOpen(): Promise<boolean> {
    return (await this.trigger().getAttribute("aria-expanded")) === "true";
  }

  /**
   * Right-clicks the area without waiting for the menu, for asserting that a
   * disabled context menu stays closed. `position` is relative to `root`.
   */
  async rightClick(position?: { x: number; y: number }): Promise<void> {
    await this.root.click({ button: "right", position });
  }

  /** Right-clicks the area and waits for the menu panel to be visible. */
  async open(position?: { x: number; y: number }): Promise<void> {
    if (!(await this.isOpen())) {
      await this.rightClick(position);
    }
    await (await this.menu()).waitFor({ state: "visible" });
  }

  /** Closes the menu if it is open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.page.keyboard.press("Escape");
    }
  }

  /** Every menu item currently listed, in display order. */
  async items(): Promise<Locator> {
    return (await this.menu()).getByRole("menuitem");
  }

  /**
   * Accessible name of every menu item, in display order. This is the string
   * `choose` matches against.
   */
  async itemLabels(): Promise<string[]> {
    await this.open();
    const snapshot = await (await this.menu()).ariaSnapshot();
    return ariaEntries(snapshot, "menuitem").map((entry) => entry.name);
  }

  /**
   * Opens the menu if needed and activates the item whose visible text is
   * exactly `label`. The menu closes afterwards.
   */
  async choose(label: string): Promise<void> {
    await this.open();
    await (await this.menu())
      .getByRole("menuitem", { name: label, exact: true })
      .click();
  }
}
