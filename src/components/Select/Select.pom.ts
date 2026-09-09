import type { Locator, Page } from "@playwright/test";

/**
 * Drives a voodo {@link Select} in a Playwright test.
 *
 * `root` is any element that contains exactly one `Select`, typically the
 * element the consuming app rendered it into. `page` is required because the
 * option list is portalled to the document body and cannot be reached from
 * `root`. The list is always resolved through the input's `aria-controls`, so
 * several open selects on one page never collide.
 *
 * @example
 * ```ts
 * const select = new SelectPom(page.getByTestId("label-field"), page);
 * await select.choose("dog");
 * ```
 */
export class SelectPom {
  constructor(
    readonly root: Locator,
    readonly page: Page
  ) {}

  /**
   * The typeahead input. It is also the trigger: clicking it opens the option
   * list, and its value is the display text of the current selection.
   */
  input(): Locator {
    return this.root.getByRole("combobox");
  }

  /**
   * The option list. Only mounted while the select is open; call {@link open}
   * first.
   */
  async listbox(): Promise<Locator> {
    const id = await this.input().getAttribute("aria-controls");
    if (!id) {
      throw new Error("SelectPom: the option list is not mounted; open first");
    }
    return this.page.locator(`[id="${id}"]`);
  }

  /** Every option currently listed, in display order. */
  async options(): Promise<Locator> {
    return (await this.listbox()).getByRole("option");
  }

  /** Whether the option list is open. */
  async isOpen(): Promise<boolean> {
    return (await this.input().getAttribute("aria-expanded")) === "true";
  }

  /** Whether the select refuses interaction. */
  async isDisabled(): Promise<boolean> {
    return this.input().isDisabled();
  }

  /** Opens the option list if it is closed and waits for it to be visible. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.input().click();
    }
    await (await this.listbox()).waitFor({ state: "visible" });
  }

  /** Closes the option list if it is open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.input().press("Escape");
      await this.input().evaluate((el) => (el as HTMLElement).blur());
    }
  }

  /**
   * Text of every listed option, whitespace collapsed, in display order. Read
   * from `textContent` rather than `innerText` so CSS `text-transform` does
   * not alter it; this matches the accessible name Playwright uses in
   * `getByRole("option", { name })`.
   */
  async optionLabels(): Promise<string[]> {
    await this.open();
    return (await this.options()).evaluateAll((elements) =>
      elements.map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim())
    );
  }

  /** Text of every option marked selected, in display order. */
  async selectedLabels(): Promise<string[]> {
    await this.open();
    return (await this.listbox())
      .locator('[role="option"][aria-selected="true"]')
      .evaluateAll((elements) =>
        elements.map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim())
      );
  }

  /**
   * Selects the option whose text is exactly `label`. In an exclusive
   * select the list closes afterwards; in a multi-select it stays open and a
   * second call with the same label deselects it.
   */
  async choose(label: string): Promise<void> {
    await this.open();
    await (await this.listbox())
      .getByRole("option", { name: label, exact: true })
      .click();
  }

  /**
   * Display text of the current selection: the selected label, or the selected
   * labels joined by ", " in a multi-select. Empty when nothing is selected.
   */
  async value(): Promise<string> {
    return this.input().inputValue();
  }
}
