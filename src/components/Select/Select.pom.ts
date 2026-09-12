import { expect, type Locator, type Page } from "@playwright/test";

import { ariaEntries } from "../../e2e/aria";

/**
 * Drives a voodo {@link Select} in a Playwright test.
 *
 * `root` is the `data-cy` test id the consuming app put on the `Select`, or a
 * locator that contains exactly one `Select`. The option list is portalled to
 * the document body and is resolved through the input's `aria-controls`, so
 * several open selects on one page never collide. Requires
 * `testIdAttribute: "data-cy"` in the consumer's Playwright config.
 *
 * @example
 * ```ts
 * const select = new SelectPom(page, "label-field");
 * await select.choose("dog");
 * await select.assert.hasValue("dog");
 * ```
 */
export class SelectPom {
  readonly root: Locator;
  readonly assert: SelectPomAsserter;

  constructor(
    readonly page: Page,
    root: Locator | string
  ) {
    this.root = typeof root === "string" ? page.getByTestId(root) : root;
    this.assert = new SelectPomAsserter(this);
  }

  /** The typeahead input. Also the trigger, and it displays the selection. */
  get input(): Locator {
    return this.root.getByTestId("select-input");
  }

  /** The option list. Only mounted while the select is open. */
  async getOptions(): Promise<Locator> {
    const id = await this.input.getAttribute("aria-controls");
    if (!id) {
      throw new Error("SelectPom: the option list is not mounted; open first");
    }
    return this.page
      .getByTestId("select-options")
      .and(this.page.locator(`[id="${id}"]`));
  }

  /** The option whose accessible name is exactly `label`. */
  async getOption(label: string): Promise<Locator> {
    return (await this.getOptions()).getByRole("option", {
      name: label,
      exact: true,
    });
  }

  /**
   * Opens the option list if it is closed. Opens by keyboard, which works
   * whether or not the input already has focus, then waits for the expanded
   * state before the list is looked up.
   */
  async open(): Promise<void> {
    if ((await this.input.getAttribute("aria-expanded")) !== "true") {
      await this.input.press("ArrowDown");
    }
    await this.input
      .and(this.page.locator('[aria-expanded="true"]'))
      .waitFor({ state: "attached" });
    await (await this.getOptions()).waitFor({ state: "visible" });
  }

  /** Closes the option list if it is open. */
  async close(): Promise<void> {
    if ((await this.input.getAttribute("aria-expanded")) === "true") {
      await this.input.press("Escape");
      await this.input.evaluate((el) => (el as HTMLElement).blur());
    }
  }

  /**
   * Types into the input, which filters the option list by label. An empty
   * query restores the full list.
   */
  async filter(query: string): Promise<void> {
    await this.open();
    await this.input.fill(query);
    await this.open();
  }

  /**
   * Selects the option whose accessible name is exactly `label`. In an
   * exclusive select the list closes afterwards; in a multi-select it stays
   * open and a second call with the same label deselects it.
   */
  async choose(label: string): Promise<void> {
    await this.open();
    const options = await this.getOptions();
    const exclusive =
      (await options.getAttribute("aria-multiselectable")) !== "true";
    await (await this.getOption(label)).click();
    if (exclusive) {
      // An exclusive select blurs its input a tick after selecting; wait for
      // that so a following open() cannot race it.
      await this.input
        .and(this.page.locator(":not(:focus)"))
        .waitFor({ state: "attached" });
    }
  }

  /**
   * Accessible name of every listed option, in display order. This is the
   * string `choose` matches against.
   */
  async getOptionLabels(): Promise<string[]> {
    await this.open();
    const snapshot = await (await this.getOptions()).ariaSnapshot();
    return ariaEntries(snapshot, "option").map((entry) => entry.name);
  }

  /** Accessible name of every option marked selected, in display order. */
  async getSelectedLabels(): Promise<string[]> {
    await this.open();
    const snapshot = await (await this.getOptions()).ariaSnapshot();
    return ariaEntries(snapshot, "option")
      .filter((entry) => entry.selected)
      .map((entry) => entry.name);
  }

  /**
   * Display text of the current selection: the selected label, or the
   * selected labels joined by ", " in a multi-select. Empty when nothing is
   * selected.
   */
  async getValue(): Promise<string> {
    return this.input.inputValue();
  }
}

/** Assertions about a {@link SelectPom}; reached as `select.assert`. */
export class SelectPomAsserter {
  constructor(private readonly select: SelectPom) {}

  /** The option list is open. */
  async isOpen(): Promise<void> {
    await expect(this.select.input).toHaveAttribute("aria-expanded", "true");
  }

  /** The option list is closed. */
  async isClosed(): Promise<void> {
    await expect(this.select.input).not.toHaveAttribute(
      "aria-expanded",
      "true"
    );
  }

  /** The select refuses interaction. */
  async isDisabled(): Promise<void> {
    await expect(this.select.input).toBeDisabled();
  }

  /** The select accepts interaction. */
  async isEnabled(): Promise<void> {
    await expect(this.select.input).toBeEnabled();
  }

  /** The input displays exactly `text`. */
  async hasValue(text: string): Promise<void> {
    await expect(this.select.input).toHaveValue(text);
  }

  /** The option named `label` is marked selected. The list must be open. */
  async hasSelected(label: string): Promise<void> {
    await expect(await this.select.getOption(label)).toHaveAttribute(
      "aria-selected",
      "true"
    );
  }

  /** The list shows exactly `labels`, by accessible name, in order. */
  async hasOptions(labels: string[]): Promise<void> {
    await expect
      .poll(() => this.select.getOptionLabels(), {
        message: "option labels",
      })
      .toEqual(labels);
  }

  /** The list holds exactly `count` options. */
  async hasOptionCount(count: number): Promise<void> {
    await expect(
      (await this.select.getOptions()).getByTestId("select-option")
    ).toHaveCount(count);
  }
}
