import { defineConfig, devices } from '@playwright/test'

// Allow overriding the UI base via environment variable for local vs CI testing.
// Local dev: PLAYWRIGHT_UI_BASE_URL=http://localhost:5173
// CI (Vercel): no override - uses the default below
const UI_BASE = process.env.PLAYWRIGHT_UI_BASE_URL ?? 'https://springaitour.vercel.app'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  use: {
    baseURL: UI_BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
})