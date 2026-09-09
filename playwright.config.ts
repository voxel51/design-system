import { defineConfig, devices } from "@playwright/test";

const PORT = 6006;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * Runs the page-object specs (`src/components/**\/*.pom.spec.ts`) against a
 * Storybook dev server. Each spec drives a component's stories through the
 * component's page object and nothing else, which is what makes the page
 * object a verified contract for product e2e suites.
 */
export default defineConfig({
  testDir: "src",
  testMatch: /.*\.pom\.spec\.ts$/,
  // Files run in parallel; tests within a file run in order on one worker so
  // a spec's final "fully exercised" test sees every earlier method call.
  fullyParallel: false,
  // Aria trees are platform-independent, so baselines carry no browser or OS
  // suffix and live next to the component.
  snapshotPathTemplate: "{testFileDir}/__aria__/{arg}{ext}",
  forbidOnly: !!process.env.CI,
  retries: 0,
  // Ceiling, not a wait: the first story of a run includes vite compiling the
  // library on demand (see gotoStory in utils/pom-testing.ts).
  timeout: 150_000,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run storybook -- --ci --no-open --port ${PORT}`,
    url: `${baseURL}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
