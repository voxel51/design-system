import { expect, test } from "@playwright/test";

import { expectStoryIndexToMatch, storiesOf } from "#/pom-testing";

import { ContextMenuPom } from "./ContextMenu.pom";

const stories = storiesOf(import.meta.url);

test("every ContextMenu story is covered", async ({ page }) => {
  await expectStoryIndexToMatch(page, stories);
});

for (const story of stories) {
  test.describe(story.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(story.url);
    });

    test("ContextMenuPom drives the story", async ({ page }) => {
      const area = page.locator("#storybook-root > *").first();
      const menu = new ContextMenuPom(area, page);
      await expect(area).toBeVisible();
      await expect(menu.trigger()).toHaveCount(1);

      if (story.disabled) {
        await menu.rightClick();
        expect(await menu.isOpen()).toBe(false);
        return;
      }

      await menu.open();
      expect(await menu.isOpen()).toBe(true);

      const labels = await menu.itemLabels();
      expect(labels.length).toBeGreaterThan(0);

      await menu.choose(labels[0]);
      expect(await menu.isOpen()).toBe(false);

      await menu.open();
      await menu.close();
      expect(await menu.isOpen()).toBe(false);
    });
  });
}
