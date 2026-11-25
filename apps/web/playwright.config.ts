import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the production build.
  webServer: {
    // --ignore-lock: always a foreground server (Astro auto-backgrounds when run by an AI agent).
    command: `pnpm astro preview --port ${PORT} --ignore-lock`,
    port: PORT,
    // Always start a fresh server so tests never run against a stale build.
    reuseExistingServer: false,
  },
});
