import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // Set PW_CHANNEL=chrome to use an installed Google Chrome instead of downloading Chromium.
    channel: process.env.PW_CHANNEL,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: process.env.PW_CHANNEL } },
  ],
  webServer: {
    // The real deployment is a static export on GitHub Pages; test exactly that, served the same way.
    command: `npm run build && node scripts/serve-static.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // The chat worker isn't running in tests: the specs intercept this URL and answer with a mock.
    env: { NEXT_PUBLIC_CHAT_URL: `http://localhost:${PORT}/__mock-chat`, NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}` },
  },
});
