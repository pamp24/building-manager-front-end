import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60_000,
  testMatch: '**/*.spec.ts',
  webServer: {
    command: 'npm start -- --port 4301',
    port: 4301,
    reuseExistingServer: false,
    timeout: 120_000
  },
  use: {
    baseURL: 'http://localhost:4301',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  workers: 1
});
