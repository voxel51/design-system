import { expect, test } from "@playwright/test";

import {
  expectAriaSnapshot,
  expectStoryIndexToMatch,
  gotoStory,
  storiesOf,
} from "#/pom-testing";

import { ContextMenuPom } from "./ContextMenu.pom";

const stories = storiesOf(import.meta.url);

test("every ContextMenu story is covered", async ({ page }) => {
  await expectStoryIndexToMatch(page, stories);
});

for (const story of stories) {
  test.describe(story.name, () => {
    test.beforeEach(async ({ page }) => {
      await gotoStory(page, story);
    });

    test("ContextMenuPom drives the story", async ({ page }) => {
      const root = page.locator("#storybook-root");
      const area = root.locator("> *").first();
      const menu = new ContextMenuPom(page, area);
      await expect(area).toBeVisible();
      await expect(menu.trigger).toHaveCount(1);
      await expectAriaSnapshot(root, story, "rest");

      if (story.disabled) {
        await menu.assert.isDisabled();
        await menu.rightClick();
        await menu.assert.isClosed();
        return;
      }

      await menu.assert.isEnabled();
      await menu.open();
      await menu.assert.isOpen();
      await expectAriaSnapshot(await menu.getMenu(), story, "open");

      const labels = await menu.getItemLabels();
      expect(labels.length).toBeGreaterThan(0);
      await menu.assert.hasItems(labels);
      await expect(await menu.getItem(labels[0])).toBeVisible();

      await menu.choose(labels[0]);
      await menu.assert.isClosed();

      await menu.open();
      await menu.close();
      await menu.assert.isClosed();
    });
  });
}
