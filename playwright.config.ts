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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
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
