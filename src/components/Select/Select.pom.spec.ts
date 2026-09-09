import { expect, test } from "@playwright/test";

import {
  expectAriaSnapshot,
  expectStoryIndexToMatch,
  gotoStory,
  storiesOf,
} from "#/pom-testing";

import { SelectPom } from "./Select.pom";

const stories = storiesOf(import.meta.url);

test("every Select story is covered", async ({ page }) => {
  await expectStoryIndexToMatch(page, stories);
});

for (const story of stories) {
  test.describe(story.name, () => {
    test.beforeEach(async ({ page }) => {
      await gotoStory(page, story);
    });

    test("SelectPom drives the story", async ({ page }) => {
      const root = page.locator("#storybook-root");
      const select = new SelectPom(page, root);
      await expect(select.input).toBeVisible();
      await expectAriaSnapshot(root, story, "rest");

      if (story.disabled) {
        await select.assert.isDisabled();
        await select.input.click({ force: true });
        await select.assert.isClosed();
        return;
      }

      await select.assert.isEnabled();
      await select.open();
      await select.assert.isOpen();
      await expectAriaSnapshot(await select.getOptions(), story, "open");

      const labels = await select.getOptionLabels();
      expect(labels.length).toBeGreaterThan(0);
      await select.assert.hasOptions(labels);

      await select.filter(labels[0].split(" ")[0]);
      const filtered = await select.getOptionLabels();
      expect(filtered.every((label) => labels.includes(label))).toBe(true);
      await select.filter("");
      await select.assert.hasOptions(labels);

      const alreadySelected = await select.getSelectedLabels();
      const target =
        labels.find((label) => !alreadySelected.includes(label)) ?? labels[0];

      await select.choose(target);
      await select.open();
      await select.assert.hasSelected(target);
      await expect(await select.getOption(target)).toBeVisible();
      await select.assert.hasValue(await select.getValue());
      expect((await select.getValue()).length).toBeGreaterThan(0);

      await select.close();
      await select.assert.isClosed();
    });
  });
}
