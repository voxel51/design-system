import { expect, test } from "@playwright/test";

import { expectStoryIndexToMatch, storiesOf } from "#/pom-testing";

import { SelectPom } from "./Select.pom";

const stories = storiesOf(import.meta.url);

test("every Select story is covered", async ({ page }) => {
  await expectStoryIndexToMatch(page, stories);
});

for (const story of stories) {
  test.describe(story.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(story.url);
    });

    test("SelectPom drives the story", async ({ page }) => {
      const select = new SelectPom(page.locator("#storybook-root"), page);
      await expect(select.input()).toBeVisible();

      if (story.disabled) {
        expect(await select.isDisabled()).toBe(true);
        await select.input().click({ force: true });
        expect(await select.isOpen()).toBe(false);
        return;
      }

      expect(await select.isDisabled()).toBe(false);
      await select.open();
      expect(await select.isOpen()).toBe(true);

      const labels = await select.optionLabels();
      expect(labels.length).toBeGreaterThan(0);

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
