import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 60_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    acceptDownloads: true,
  },
  // Desktop plus phone emulation (touch, small screen, mobile user agent).
  // Real Safari/WebKit is not bundled here; see README for device testing.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'iphone-size', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
  ],
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
