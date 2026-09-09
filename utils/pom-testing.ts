import { readFileSync } from "fs";
import { fileURLToPath } from "url";

import { expect, type Page } from "@playwright/test";

/** One story of a component, as the page-object specs see it. */
export interface Story {
  /** Storybook story id, e.g. `components-select--controlled`. */
  id: string;
  /** Story export name, e.g. `Controlled`. */
  name: string;
  /** Storybook `title`, e.g. `Components/Select`. */
  title: string;
  /** Iframe URL that renders only this story. */
  url: string;
  /**
   * Stories whose export name contains "Disabled" are expected to refuse the
   * component's primary interaction. Every other story is expected to accept
   * it. This is the one naming convention the page-object specs rely on.
   */
  disabled: boolean;
}

const sanitize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const startCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

/**
 * Enumerates the stories exported by a `*.stories.tsx` file at collection
 * time, deriving each story id the way Storybook does (sanitized title, then
 * the start-cased export name). Pass `import.meta.url` of the spec; the
 * stories file is its `*.stories.tsx` sibling.
 *
 * Collection cannot consult the running Storybook, so `expectStoryIndexToMatch`
 * checks this list against `/index.json` once the server is up.
 */
export const storiesOf = (specUrl: string): Story[] => {
  const storiesPath = fileURLToPath(specUrl).replace(
    /\.pom\.spec\.ts$/,
    ".stories.tsx"
  );
  const source = readFileSync(storiesPath, "utf8");
  const title = /title:\s*"([^"]+)"/.exec(source)?.[1];
  if (!title) {
    throw new Error(`${storiesPath}: no \`title\` in the stories meta`);
  }
  const names = [...source.matchAll(/^export const (\w+): Story\b/gm)].map(
    (match) => match[1]
  );
  if (names.length === 0) {
    throw new Error(`${storiesPath}: no \`export const X: Story\` found`);
  }
  return names.map((name) => {
    const id = `${sanitize(title)}--${sanitize(startCase(name))}`;
    return {
      id,
      name,
      title,
      url: `/iframe.html?id=${id}&viewMode=story`,
      disabled: /disabled/i.test(name),
    };
  });
};

/**
 * Navigates to a story and waits until Storybook has either rendered it or
 * shown its error display. The first render in a `storybook dev` session
 * compiles the library on demand and can take well over Playwright's default
 * expect timeout, so waiting on Storybook's own body state is what makes the
 * specs deterministic. A story that fails to render fails here, with
 * Storybook's message, rather than as a missing element later.
 */
export const gotoStory = async (page: Page, story: Story): Promise<void> => {
  await page.goto(story.url);
  await page
    .locator("body.sb-show-main, body.sb-show-errordisplay")
    .waitFor({ state: "attached", timeout: 120_000 });
  const failed = await page.locator("body.sb-show-errordisplay").count();
  if (failed > 0) {
    const message = await page.locator("#error-message").innerText();
    const stack = await page.locator("#error-stack").innerText();
    throw new Error(`${story.id} failed to render:\n${message}\n${stack}`);
  }
};

/**
 * Asserts that the stories enumerated at collection time are exactly the
 * stories Storybook serves for that title. A story the spec cannot see (a
 * custom `name`, a differently shaped export) fails here rather than going
 * silently untested.
 */
export const expectStoryIndexToMatch = async (
  page: Page,
  stories: Story[]
): Promise<void> => {
  const title = stories[0].title;
  const response = await page.request.get("/index.json");
  expect(response.ok(), "Storybook index is reachable").toBe(true);
  const index = (await response.json()) as {
    entries: Record<string, { id: string; title: string; type: string }>;
  };
  const served = Object.values(index.entries)
    .filter((entry) => entry.type === "story" && entry.title === title)
    .map((entry) => entry.id)
    .sort();
  expect(served, `stories served for ${title}`).toEqual(
    stories.map((story) => story.id).sort()
  );
};
