import { expect, test } from "@playwright/test";

import {
  expectAriaSnapshot,
  expectPomFullyExercised,
  expectStoryIndexToMatch,
  gotoStory,
  storiesOf,
  tracked,
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
      const menu = tracked(new ContextMenuPom(area, page));
      await expect(area).toBeVisible();
      await expect(menu.trigger()).toHaveCount(1);
      await expectAriaSnapshot(root, story, "rest");

      if (story.disabled) {
        expect(await menu.isDisabled()).toBe(true);
        await menu.rightClick();
        expect(await menu.isOpen()).toBe(false);
        return;
      }

      expect(await menu.isDisabled()).toBe(false);
      await menu.open();
      expect(await menu.isOpen()).toBe(true);
      await expectAriaSnapshot(await menu.menu(), story, "open");

      const labels = await menu.itemLabels();
      expect(labels.length).toBeGreaterThan(0);
      expect(await (await menu.items()).count()).toBe(labels.length);

      await menu.choose(labels[0]);
      expect(await menu.isOpen()).toBe(false);

      await menu.open();
      await menu.close();
      expect(await menu.isOpen()).toBe(false);
    });
  });
}

test("ContextMenuPom is fully exercised", () => {
  expectPomFullyExercised(ContextMenuPom);
});
