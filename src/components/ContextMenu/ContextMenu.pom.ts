import { expect, type Locator, type Page } from "@playwright/test";

import { ariaEntries } from "../../e2e/aria";

/**
 * Drives a voodo {@link ContextMenu} in a Playwright test.
 *
 * `root` is the `data-cy` test id the consuming app put on the `ContextMenu`
 * (its right-clickable area), or a locator for that area. The menu panel is
 * portalled to the document body and is resolved through the menu's own
 * trigger, so several context menus on one page never collide. Requires
 * `testIdAttribute: "data-cy"` in the consumer's Playwright config.
 *
 * @example
 * ```ts
 * const menu = new ContextMenuPom(page, "track-bar");
 * await menu.choose("Delete track");
 * await menu.assert.isClosed();
 * ```
 */
export class ContextMenuPom {
  readonly root: Locator;
  readonly assert: ContextMenuPomAsserter;

  constructor(
    readonly page: Page,
    root: Locator | string
  ) {
    this.root = typeof root === "string" ? page.getByTestId(root) : root;
    this.assert = new ContextMenuPomAsserter(this);
  }

  /**
   * The Headless UI menu button that `ContextMenu` renders right after the
   * right-clickable area. Invisible and never clicked directly; it carries the
   * menu's ARIA state.
   */
  get trigger(): Locator {
    return this.page
      .getByTestId("context-menu-trigger")
      .and(this.root.locator("xpath=following-sibling::*[1]"));
  }

  /** The menu panel. Only mounted while the menu is open. */
  async getMenu(): Promise<Locator> {
    const id = await this.trigger.getAttribute("aria-controls");
    if (!id) {
      throw new Error("ContextMenuPom: the menu is not mounted; open first");
    }
    return this.page
      .getByTestId("context-menu")
      .and(this.page.locator(`[id="${id}"]`));
  }

  /** The menu item whose accessible name is exactly `label`. */
  async getItem(label: string): Promise<Locator> {
    return (await this.getMenu()).getByRole("menuitem", {
      name: label,
      exact: true,
    });
  }

  /**
   * Right-clicks the area without waiting for the menu, for driving a disabled
   * context menu. `position` is relative to `root`.
   */
  async rightClick(position?: { x: number; y: number }): Promise<void> {
    await this.root.click({ button: "right", position });
  }

  /** Right-clicks the area if the menu is closed and waits for the panel. */
  async open(position?: { x: number; y: number }): Promise<void> {
    if ((await this.trigger.getAttribute("aria-expanded")) !== "true") {
      await this.rightClick(position);
    }
    await (await this.getMenu()).waitFor({ state: "visible" });
  }

  /** Closes the menu if it is open. */
  async close(): Promise<void> {
    if ((await this.trigger.getAttribute("aria-expanded")) === "true") {
      await this.page.keyboard.press("Escape");
    }
  }

  /**
   * Opens the menu if needed and activates the item whose accessible name is
   * exactly `label`. The menu closes afterwards.
   */
  async choose(label: string): Promise<void> {
    await this.open();
    await (await this.getItem(label)).click();
  }

  /**
   * Accessible name of every menu item, in display order. This is the string
   * `choose` matches against.
   */
  async getItemLabels(): Promise<string[]> {
    await this.open();
    const snapshot = await (await this.getMenu()).ariaSnapshot();
    return ariaEntries(snapshot, "menuitem").map((entry) => entry.name);
  }
}

/** Assertions about a {@link ContextMenuPom}; reached as `menu.assert`. */
export class ContextMenuPomAsserter {
  constructor(private readonly menu: ContextMenuPom) {}

  /** The menu panel is open. */
  async isOpen(): Promise<void> {
    await expect(this.menu.trigger).toHaveAttribute("aria-expanded", "true");
  }

  /** The menu panel is closed. */
  async isClosed(): Promise<void> {
    await expect(this.menu.trigger).not.toHaveAttribute(
      "aria-expanded",
      "true"
    );
  }

  /** Right-clicking is ignored. */
  async isDisabled(): Promise<void> {
    await expect(this.menu.trigger).toHaveAttribute("aria-disabled", "true");
  }

  /** Right-clicking opens the menu. */
  async isEnabled(): Promise<void> {
    await expect(this.menu.trigger).not.toHaveAttribute(
      "aria-disabled",
      "true"
    );
  }

  /** The open menu lists exactly `labels`, in order. */
  async hasItems(labels: string[]): Promise<void> {
    await expect((await this.menu.getMenu()).getByRole("menuitem")).toHaveText(
      labels,
      { useInnerText: false }
    );
  }
}
