import { defineConfig, devices } from "@playwright/test";

const PORT = 6006;
const baseURL = `http://127.0.0.1:${PORT}`;

/**
 * Runs the page-object specs (`src/components/**\/*.pom.spec.ts`) against a
 * static Storybook build. Each spec drives a component's stories through the
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
  // Aria trees are platform-independent, so baselines carry no browser or OS
  // suffix and live next to the component.
  snapshotPathTemplate: "{testFileDir}/__aria__/{arg}{ext}",
  use: {
    baseURL,
    // Matches the product e2e suites, so page objects work unchanged there.
    testIdAttribute: "data-cy",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // A static build, so no story pays for on-demand compilation at test time.
    command: `npm run build-storybook && npx vite preview --outDir storybook-static --port ${PORT} --strictPort`,
    url: `${baseURL}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
