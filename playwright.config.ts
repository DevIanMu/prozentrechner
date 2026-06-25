import { defineConfig, devices } from '@playwright/test';

// Bypass the corporate proxy for local test traffic so Playwright and the
// static file server can reach localhost/127.0.0.1 without getting 502s.
process.env.NO_PROXY = 'localhost,127.0.0.1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      env: {
        // Ensure the browser also bypasses the proxy for loopback addresses.
        HTTP_PROXY: '',
        HTTPS_PROXY: '',
        NO_PROXY: 'localhost,127.0.0.1',
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npx serve dist -p 3000 --no-request-logging',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300 * 1000,
    env: {
      // Unset proxy variables for the server process so it can bind and serve
      // localhost without proxy interference.
      HTTP_PROXY: '',
      HTTPS_PROXY: '',
      NO_PROXY: 'localhost,127.0.0.1',
    },
  },
});
