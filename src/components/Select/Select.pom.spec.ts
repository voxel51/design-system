import { expect, test } from "@playwright/test";

import {
  expectAriaSnapshot,
  expectPomFullyExercised,
  expectStoryIndexToMatch,
  gotoStory,
  storiesOf,
  tracked,
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
      const select = tracked(new SelectPom(root, page));
      await expect(select.input()).toBeVisible();
      await expectAriaSnapshot(root, story, "rest");

      if (story.disabled) {
        expect(await select.isDisabled()).toBe(true);
        await select.input().click({ force: true });
        expect(await select.isOpen()).toBe(false);
        return;
      }

      expect(await select.isDisabled()).toBe(false);
      await select.open();
      expect(await select.isOpen()).toBe(true);
      await expectAriaSnapshot(await select.listbox(), story, "open");

      const labels = await select.optionLabels();
      expect(labels.length).toBeGreaterThan(0);
      expect(await (await select.options()).count()).toBe(labels.length);

      const alreadySelected = await select.selectedLabels();
      const target =
        labels.find((label) => !alreadySelected.includes(label)) ?? labels[0];

      await select.choose(target);
      expect(await select.selectedLabels()).toContain(target);
      expect((await select.value()).length).toBeGreaterThan(0);

      await select.close();
      expect(await select.isOpen()).toBe(false);
    });
  });
}

test("SelectPom is fully exercised", () => {
  expectPomFullyExercised(SelectPom);
});
